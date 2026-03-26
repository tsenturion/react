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
        note: 'Shell урока уже разбивает тему на component contracts, events, refs, UI states и playbook.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Route map и модель лабораторий урока.',
      },
      {
        path: 'src/lib/typescript-overview-domain.ts',
        note: 'Карта основных идей темы и типичных ошибок.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Маршруты урока выражают структуру темы через реальные практические поверхности TypeScript в React.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/typescript-overview?focus=all' },
  { id: 'props', href: '/typed-props-and-children' },
  { id: 'events', href: '/typed-events-and-state' },
  { id: 'refs', href: '/typed-refs-and-dom' },
  { id: 'states', href: '/typed-ui-states' },
  { id: 'playbook', href: '/typescript-playbook' },
] as const;`,
      },
      {
        label: 'Overview focus parser',
        note: 'Даже обзор урока держится на конкретной типовой модели, а не на неструктурированном наборе карточек.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (value === 'contracts' || value === 'events' || value === 'refs') {
    return value;
  }

  return 'all';
}`,
      },
    ],
  },
  props: {
    files: [
      {
        path: 'src/components/typescript-labs/PropsContractsLab.tsx',
        note: 'Typed component API, `children` и взаимоисключающие варианты props прямо в живом React-компоненте.',
      },
      {
        path: 'src/lib/props-contract-model.ts',
        note: 'Сравнение loose props, typed contract и слишком гибкого API.',
      },
      {
        path: 'src/components/typescript-labs/PropsContractsLab.test.tsx',
        note: 'Проверка того, что лаборатория действительно переключает typed сценарии.',
      },
    ],
    snippets: [
      {
        label: 'Typed component contract',
        note: 'Взаимоисключающие props показывают, что типы формируют API компонента, а не только подписывают поля.',
        code: `type TypedLessonCardProps = {
  title: string;
  tone: 'info' | 'warn';
  children: ReactNode;
} & (
  | { actionKind: 'link'; href: string; onAction?: never }
  | { actionKind: 'button'; onAction: () => void; href?: never }
);`,
      },
      {
        label: 'Loose contract',
        note: 'Широкий loose-контракт выглядит “гибко”, но быстро превращает API компонента в источник ambiguity.',
        code: `type LessonCardProps = {
  title?: string;
  href?: string;
  onAction?: () => void;
  children?: React.ReactNode;
};`,
      },
    ],
  },
  events: {
    files: [
      {
        path: 'src/components/typescript-labs/EventsStateLab.tsx',
        note: 'Typed handlers для `ChangeEvent`, `FormEvent`, `KeyboardEvent` и state union формы.',
      },
      {
        path: 'src/lib/events-state-model.ts',
        note: 'Парсинг поля, валидация и submit-state модель.',
      },
      {
        path: 'src/components/typescript-labs/EventsStateLab.test.tsx',
        note: 'Проверка submit flow и обработки ошибок.',
      },
    ],
    snippets: [
      {
        label: 'Typed event handlers',
        note: 'Обработчики читают данные через `currentTarget`, а не через размытый `target`.',
        code: `function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
  setTitle(event.currentTarget.value);
}

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}`,
      },
      {
        label: 'Submit state union',
        note: 'Состояние формы оформлено как явные ветки, а не как набор несвязанных флагов.',
        code: `type SubmitState =
  | { status: 'idle' }
  | { status: 'editing'; dirtyFields: readonly string[] }
  | { status: 'submitting'; queuePosition: number }
  | { status: 'success'; receipt: string }
  | { status: 'error'; field: 'title' | 'score'; message: string };`,
      },
    ],
  },
  refs: {
    files: [
      {
        path: 'src/components/typescript-labs/RefsDomLab.tsx',
        note: 'Типизация DOM refs и таймера автосохранения.',
      },
      {
        path: 'src/lib/refs-dom-model.ts',
        note: 'Практические ref-сценарии и их безопасные паттерны.',
      },
      {
        path: 'src/main.tsx',
        note: 'Даже shell урока фиксирует, что TypeScript проходит через весь проект, а не только через лаборатории.',
      },
    ],
    snippets: [
      {
        label: 'Typed refs',
        note: 'Ref к DOM-узлу и ref к таймеру хранят принципиально разные сущности и не должны жить в одном бесформенном типе.',
        code: `const inputRef = useRef<HTMLInputElement | null>(null);
const listRef = useRef<HTMLUListElement | null>(null);
const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);`,
      },
      {
        label: 'Safe DOM access',
        note: 'Даже простой `focus()` остаётся честно завязан на null-check и конкретный DOM API.',
        code: `function focusInput() {
  inputRef.current?.focus();
}`,
      },
    ],
  },
  states: {
    files: [
      {
        path: 'src/components/typescript-labs/UiStatesLab.tsx',
        note: 'Живой экран со switch по union-состоянию.',
      },
      {
        path: 'src/lib/ui-states-model.ts',
        note: 'Discriminated union для loading/error/empty/ready и exhaustive helper.',
      },
      {
        path: 'src/components/typescript-labs/UiStatesLab.test.tsx',
        note: 'Проверка переходов между empty/error/ready ветками.',
      },
    ],
    snippets: [
      {
        label: 'Catalog state union',
        note: 'Модель данных и интерфейса оформлена как конечные ветки одного состояния.',
        code: `type CatalogState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'empty'; reason: string }
  | { status: 'ready'; items: readonly string[] };`,
      },
      {
        label: 'Exhaustive handling',
        note: 'Пропуск новой ветки состояния ломает сборку, а не превращается в тихий runtime-баг.',
        code: `function describeCatalogState(state: CatalogState): string {
  switch (state.status) {
    case 'loading':
      return 'Загрузка ещё не завершилась.';
    default:
      return assertNever(state);
  }
}`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/typescript-labs/TypeScriptPlaybookLab.tsx',
        note: 'Итоговая стратегия внедрения TypeScript по типу проблем и зрелости команды.',
      },
      {
        path: 'src/lib/typescript-playbook-model.ts',
        note: 'Чистая модель рекомендаций для rollout типизации.',
      },
      {
        path: 'README.md',
        note: 'README фиксирует границу между пользой типов и тем, что типы не решают автоматически.',
      },
    ],
    snippets: [
      {
        label: 'DOM-first playbook branch',
        note: 'Если баги идут с DOM и imperative-кода, полезнее сначала типизировать refs и события.',
        code: `if (input.bugPattern === 'dom-imperative') {
  return {
    title: 'Сфокусируйтесь на refs, currentTarget и безопасных DOM-boundaries',
    tone: 'error',
  };
}`,
      },
      {
        label: 'Starting branch',
        note: 'На старте стратегия рекомендует идти от component contracts и UI states, а не от тотального покрытия всего подряд.',
        code: `if (input.teamLevel === 'starting') {
  return {
    title: 'Начните с component contracts и UI states',
    tone: 'warn',
  };
}`,
      },
    ],
  },
};
