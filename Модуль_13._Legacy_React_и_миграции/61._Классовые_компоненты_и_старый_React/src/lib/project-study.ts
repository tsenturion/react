import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока сам организован вокруг legacy mental model: state, lifecycle, refs, PureComponent и maintenance.',
      },
      {
        path: 'src/main.tsx',
        note: 'Урок намеренно рендерится без StrictMode, чтобы жизненный цикл legacy classes был виден прямо.',
      },
      {
        path: 'src/lib/legacy-overview-model.ts',
        note: 'Карта старого React mental model и сопоставление с hooks.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Структура урока привязана к реально существующим legacy-поверхностям React.',
        code: `export const lessonLabs = [
  { id: 'state', href: '/class-state' },
  { id: 'lifecycle', href: '/lifecycle-methods' },
  { id: 'refs', href: '/legacy-refs' },
  { id: 'pure', href: '/pure-component' },
  { id: 'maintenance', href: '/maintenance-and-boundaries' },
];`,
      },
      {
        label: 'Main render without StrictMode',
        note: 'Для этой темы важно показать legacy lifecycle в чистом виде, без dev-only двойных probes.',
        code: `createRoot(container).render(
  <App />,
);`,
      },
    ],
  },
  state: {
    files: [
      {
        path: 'src/components/legacy-react-labs/ClassStateLab.tsx',
        note: 'Class component с object-form и updater-form setState.',
      },
      {
        path: 'src/lib/class-state-model.ts',
        note: 'Чистая модель очереди обновлений и пояснения про callback после commit.',
      },
      {
        path: 'src/components/legacy-react-labs/ClassStateLab.test.tsx',
        note: 'Тест на +1 против +2 и на поведение очереди setState.',
      },
    ],
    snippets: [
      {
        label: 'Unsafe queue',
        note: 'Два object-form обновления видят один и тот же snapshot current state.',
        code: `const snapshot = this.state.count;
this.setState({ count: snapshot + 1 });
this.setState({ count: snapshot + 1 });`,
      },
      {
        label: 'Safe queue',
        note: 'Updater-form читает актуальный prevState на каждом шаге очереди.',
        code: `this.setState((prev) => ({ count: prev.count + 1 }));
this.setState((prev) => ({ count: prev.count + 1 }));`,
      },
    ],
  },
  lifecycle: {
    files: [
      {
        path: 'src/components/legacy-react-labs/LifecycleLab.tsx',
        note: 'Workbench и probe на class components с mount/update/unmount logging.',
      },
      {
        path: 'src/lib/lifecycle-model.ts',
        note: 'Lifecycle methods и современная hook-based оптика для их чтения.',
      },
      {
        path: 'src/router.tsx',
        note: 'Shell проекта тоже подчёркивает, что lifecycle нужно понимать в контексте современной инфраструктуры.',
      },
    ],
    snippets: [
      {
        label: 'Guarded componentDidUpdate',
        note: 'Без сравнения с prevProps или prevState update-side effects становятся источником циклов.',
        code: `componentDidUpdate(prevProps, prevState) {
  if (prevProps.filter !== this.props.filter) {
    this.props.onLog('filter changed');
  }
}`,
      },
      {
        label: 'Forced remount',
        note: 'Смена key создаёт новый экземпляр class component и снова запускает mount/unmount цикл.',
        code: `<LifecycleProbe
  key={this.state.probeKey}
  filter={this.state.filter}
  showDetails={this.state.showDetails}
/>\n`,
      },
    ],
  },
  refs: {
    files: [
      {
        path: 'src/components/legacy-react-labs/LegacyRefsLab.tsx',
        note: 'createRef, uncontrolled input и imperative focus/clear actions.',
      },
      {
        path: 'src/components/legacy-react-labs/LegacyRefsLab.test.tsx',
        note: 'Проверка, что ref действительно переводит фокус в DOM input.',
      },
      {
        path: 'src/pages/RefsPage.tsx',
        note: 'Страница сравнивает старый ref bridge с современной практикой useRef.',
      },
    ],
    snippets: [
      {
        label: 'Ref field',
        note: 'В class components ref обычно создаётся как поле экземпляра, а не внутри render.',
        code: `private inputRef = createRef<HTMLInputElement>();
private resultsRef = createRef<HTMLDivElement>();`,
      },
      {
        label: 'Imperative DOM action',
        note: 'Ref здесь нужен именно как bridge к DOM, а не как хранилище бизнес-состояния.',
        code: `focusInput = () => {
  this.inputRef.current?.focus();
};`,
      },
    ],
  },
  pure: {
    files: [
      {
        path: 'src/components/legacy-react-labs/PureComponentLab.tsx',
        note: 'Сравнение обычного Component и PureComponent на одном и том же объекте props.',
      },
      {
        path: 'src/lib/pure-component-model.ts',
        note: 'Сценарии shallow compare и guardrails для legacy оптимизаций.',
      },
      {
        path: 'src/components/legacy-react-labs/PureComponentLab.test.tsx',
        note: 'Тест на баг из-за мутации по ссылке и корректное поведение immutable update.',
      },
    ],
    snippets: [
      {
        label: 'Pure child',
        note: 'PureComponent сравнивает props поверхностно и пропускает ререндер при той же ссылке.',
        code: `class PurePreview extends React.PureComponent<PreviewProps> {
  render() {
    return <Card card={this.props.card} />;
  }
}`,
      },
      {
        label: 'Intentional mutation trap',
        note: 'Лаборатория специально мутирует объект, чтобы показать старый class-based performance bug.',
        code: `this.state.card.reviews += 1;
this.setState({ card: this.state.card });`,
      },
    ],
  },
  maintenance: {
    files: [
      {
        path: 'src/components/legacy-react-labs/LegacyErrorBoundary.tsx',
        note: 'Универсальный class-based boundary с resetKey и fallback UI.',
      },
      {
        path: 'src/components/legacy-react-labs/ErrorBoundariesLab.tsx',
        note: 'Локализация сбоя, reset strategies и migration chooser на одной странице.',
      },
      {
        path: 'src/lib/legacy-playbook-model.ts',
        note: 'Где классы всё ещё уместны и как выбирать стратегию поддержки.',
      },
    ],
    snippets: [
      {
        label: 'Boundary core',
        note: 'Error boundary остаётся class-based API: ошибка переводит boundary в fallback state.',
        code: `static getDerivedStateFromError(error: Error) {
  return { error };
}

componentDidCatch(error: Error) {
  this.props.onCatch?.(error.message);
}`,
      },
      {
        label: 'Reset strategy',
        note: 'Смена resetKey позволяет сбросить boundary после локального сбоя.',
        code: `componentDidUpdate(prevProps: Props) {
  if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
    this.setState({ error: null });
  }
}`,
      },
    ],
  },
};
