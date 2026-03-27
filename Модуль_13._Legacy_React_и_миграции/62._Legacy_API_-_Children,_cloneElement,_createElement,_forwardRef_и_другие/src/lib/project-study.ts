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
        note: 'Shell урока строится вокруг реальных legacy API surfaces и их migration-оптики.',
      },
      {
        path: 'src/lib/legacy-api-overview-model.ts',
        note: 'Карта lesson 62: фокусы, карточки и сравнение legacy API с современными альтернативами.',
      },
      {
        path: 'src/main.tsx',
        note: 'Проект рендерится без StrictMode, чтобы лаборатории показывали прямое поведение legacy-механик.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Структура урока совпадает с реальными группами legacy API, а не с абстрактной теорией.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/legacy-api-overview?focus=all' },
  { id: 'children', href: '/children-api' },
  { id: 'clone', href: '/clone-element' },
  { id: 'create', href: '/create-element' },
  { id: 'refs', href: '/ref-migration' },
  { id: 'context', href: '/legacy-context' },
];`,
      },
      {
        label: 'Overview comparison rows',
        note: 'В overview сопоставление идёт не по синтаксису, а по ответственности и migration path.',
        code: `export const legacyApiComparisonRows = [
  { legacy: 'Children.map / toArray', modern: 'явные props, arrays of data, context' },
  { legacy: 'cloneElement', modern: 'render props, slots, context, explicit wrapper props' },
  { legacy: 'forwardRef', modern: 'ref-as-prop в React 19' },
];`,
      },
    ],
  },
  children: {
    files: [
      {
        path: 'src/components/legacy-api-labs/ChildrenApiLab.tsx',
        note: 'Классическая лаборатория про opaque children, isValidElement и Children.only.',
      },
      {
        path: 'src/lib/children-api-model.ts',
        note: 'Чистые правила для Children.only и guardrails по использованию Children API.',
      },
      {
        path: 'src/components/legacy-api-labs/ChildrenApiLab.test.tsx',
        note: 'Тесты фиксируют поведение strict single child contract и filtering valid elements.',
      },
    ],
    snippets: [
      {
        label: 'Children.only contract',
        note: 'Лаборатория специально переключает single element, two elements и text node, чтобы контракт был виден вживую.',
        code: `const onlyChildren =
  mode === 'single-element'
    ? <LegacyChip label="Single slot child" />
    : mode === 'two-elements'
      ? [<LegacyChip key="first" />, <LegacyChip key="second" />]
      : 'Only plain text';`,
      },
      {
        label: 'Safe element narrowing',
        note: 'props читаются только после isValidElement, иначе children остаются opaque structure.',
        code: `const validElements = normalizedChildren.filter(
  (child): child is ReactElement<{ label?: string }> =>
    isValidElement<{ label?: string }>(child),
);`,
      },
    ],
  },
  clone: {
    files: [
      {
        path: 'src/components/legacy-api-labs/CloneElementLab.tsx',
        note: 'Adapter-контейнер подмешивает active/disabled/onClick в уже созданные children.',
      },
      {
        path: 'src/lib/clone-element-model.ts',
        note: 'Модель рисков cloneElement и сравнение override против compose поведения.',
      },
      {
        path: 'src/components/legacy-api-labs/CloneElementLab.test.tsx',
        note: 'Тесты показывают, как injected handler влияет на child contract.',
      },
    ],
    snippets: [
      {
        label: 'Injected handler',
        note: 'Вся сила и вся опасность cloneElement в том, что родитель незаметно меняет поведение дочернего элемента.',
        code: `return cloneElement(child, {
  active: actionId === this.props.activeId,
  disabled: this.props.disabledAll || child.props.disabled,
  onClick: () => {
    if (this.props.composeHandlers) {
      originalOnClick?.();
    }
    this.props.onSelect(actionId);
  },
});`,
      },
      {
        label: 'Risk summary',
        note: 'Урок фиксирует, что cloneElement чаще всего проигрывает более явным API.',
        code: `export const cloneElementRisks = [
  'cloneElement скрывает точку изменения props и затрудняет чтение data flow.',
  'Неосторожный cloneElement легко перезаписывает onClick, className, aria-атрибуты и refs.',
];`,
      },
    ],
  },
  create: {
    files: [
      {
        path: 'src/components/legacy-api-labs/CreateElementLab.tsx',
        note: 'Вся фабрика UI собирается через createElement, чтобы показать низкоуровневую модель под JSX.',
      },
      {
        path: 'src/lib/create-element-model.ts',
        note: 'Descriptor-модель blocks/layout и guardrails для уместного использования createElement.',
      },
      {
        path: 'src/pages/CreateElementPage.tsx',
        note: 'Страница связывает createElement с JSX, runtime factories и generated UI trees.',
      },
    ],
    snippets: [
      {
        label: 'Factory canvas',
        note: 'Эта часть урока намеренно не прячется за JSX, а собирает tree вручную.',
        code: `return createElement(
  this.props.layout,
  { className: 'space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm' },
  createElement('header', null, ...),
  ...this.props.blocks.map((block) => renderLegacyBlock(block, this.props.emphasize)),
  this.props.showFooter ? createElement('footer', null, 'Factory footer') : null,
);`,
      },
      {
        label: 'Factory snippet builder',
        note: 'Дополнительная строковая модель помогает сравнить JSX-мышление с низкоуровневой формой.',
        code: `export function buildFactorySnippet(layout, emphasize, showFooter) {
  return \`return createElement(
  '\${layout}',
  { className: '\${emphasize ? 'highlighted-root' : 'plain-root'}' },
  createElement('header', null, 'Legacy API dashboard'),
  blocks.map((block) => renderLegacyBlock(block)),
  \${showFooter ? "createElement('footer', null, 'Factory footer')" : 'null'},
);\`;
}`,
      },
    ],
  },
  refs: {
    files: [
      {
        path: 'src/components/legacy-api-labs/RefMigrationLab.tsx',
        note: 'Сравнение DOM ref, forwardRef и React 19 ref-as-prop на одном интерактивном экране.',
      },
      {
        path: 'src/lib/ref-migration-model.ts',
        note: 'Чистая модель для выбора migration path и предупреждение про ref как escape hatch.',
      },
      {
        path: 'src/components/legacy-api-labs/RefMigrationLab.test.tsx',
        note: 'Тесты подтверждают, что focus действительно доходит до нужного input в каждом сценарии.',
      },
    ],
    snippets: [
      {
        label: 'Legacy wrapper vs React 19',
        note: 'В одном файле соседствуют два поколения API, чтобы разница была видна прямо в коде.',
        code: `const ForwardRefField = forwardRef<HTMLInputElement, BaseFieldProps>(function ForwardRefField(
  { label, description, ...props },
  ref,
) {
  return <input {...props} ref={ref} />;
});

function RefAsPropField({ ref, ...props }: RefAsPropFieldProps) {
  return <input {...props} ref={ref} />;
}`,
      },
      {
        label: 'Imperative focus path',
        note: 'Урок подчёркивает, что ref остаётся imperatively bridge, даже если API стало проще.',
        code: `if (target === 'ref-as-prop') {
  this.refAsPropField.current?.focus();
  this.setState({
    lastFocused: 'Фокус дошёл до input через React 19 ref-as-prop без forwardRef wrapper.',
    choice: 'ref-as-prop',
  });
}`,
      },
    ],
  },
  context: {
    files: [
      {
        path: 'src/components/legacy-api-labs/LegacyContextLab.tsx',
        note: 'На одном экране сопоставлены contextType, Consumer, useContext и historical context reference.',
      },
      {
        path: 'src/lib/context-interop-model.ts',
        note: 'Модель сценариев consumption и рекомендации по migration strategy.',
      },
      {
        path: 'src/lib/historical-context-reference.ts',
        note: 'Справочный листинг старого childContextTypes/contextTypes API для чтения legacy-кода.',
      },
    ],
    snippets: [
      {
        label: 'Class consumer',
        note: 'Старый class-based consumption всё ещё полезно уметь читать в существующих деревьях.',
        code: `class ClassConsumerCard extends Component {
  static contextType = ThemeContext;
  declare context: ThemeState;

  render() {
    return <p>{this.context.theme} / {this.context.density}</p>;
  }
}`,
      },
      {
        label: 'Historical context reference',
        note: 'Эта историческая форма включена в урок не для нового кода, а для поддержки старых приложений.',
        code: `class LegacyProvider extends React.Component {
  static childContextTypes = { theme: PropTypes.string };

  getChildContext() {
    return { theme: this.props.theme };
  }
}`,
      },
    ],
  },
};
