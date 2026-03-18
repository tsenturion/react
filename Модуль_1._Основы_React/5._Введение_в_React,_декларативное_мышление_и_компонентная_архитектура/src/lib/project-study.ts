export const projectStudy = {
  reactValue: {
    files: [
      {
        path: 'src/App.tsx',
        note: 'Верхний shell сам собран как React-дерево с menu-driven переключением лабораторий.',
      },
      {
        path: 'src/lib/react-value-model.ts',
        note: 'Pure model показывает, когда React начинает окупаться как слой описания UI.',
      },
      {
        path: 'src/components/catalog/CatalogSurface.tsx',
        note: 'Текущий проект сам использует компоненты section/card/summary вместо одного большого render-блока.',
      },
    ],
    snippets: [
      {
        label: 'src/App.tsx',
        note: 'Даже оболочка урока выражает тему через компоненты и activeLab state.',
        code: `const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
const ActiveComponent = activeLab.component;

<main className="panel p-6 sm:p-8">
  <ActiveComponent />
</main>`,
      },
      {
        label: 'src/lib/react-value-model.ts',
        note: 'Модель оценивает, как сложность экрана, повторяемость и shared state влияют на ценность React.',
        code: `const combinedScore = surfaceScore + reuseScore + stateScore;
const tone = combinedScore >= 7 ? 'success' : 'warn';`,
      },
    ],
  },
  declarative: {
    files: [
      {
        path: 'src/pages/DeclarativePage.tsx',
        note: 'Страница держит только filters-state и передаёт дальше уже вычисленный результат.',
      },
      {
        path: 'src/lib/declarative-model.ts',
        note: 'Сравнивает imperative DOM-шаги и declarative rules на одном сценарии.',
      },
      {
        path: 'src/lib/catalog-domain.ts',
        note: '`deriveCatalogView` делает список, summary и empty state следствием одной модели данных.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/declarative-model.ts',
        note: 'Здесь UI уже мыслится как вывод из состояния фильтров, а не как набор ручных патчей.',
        code: `const declarativeRules = [
  'Получать \`visibleItems\` и \`sections\` из одной pure function \`deriveCatalogView\`.',
  'Строить summary, empty state и список из одного и того же результата вычисления.',
];`,
      },
      {
        label: 'src/pages/DeclarativePage.tsx',
        note: 'Компонент хранит filters, а не DOM-узлы.',
        code: `const comparison = buildDeclarativeComparison({
  ...defaultCatalogOptions,
  query,
  category,
  onlyStable,
  sortMode,
});`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/component-architecture-model.ts',
        note: 'Модель задаёт стратегии деления, boundary groups и архитектурные trade-offs.',
      },
      {
        path: 'src/components/architecture/BoundaryMap.tsx',
        note: 'Карта экрана сама рендерится как независимый компонент, а не смешивается с логикой страницы.',
      },
      {
        path: 'src/components/catalog/CatalogSurface.tsx',
        note: 'Настоящее дерево текущего проекта уже разбито на summary/section/card-компоненты.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/component-architecture-model.ts',
        note: 'Balanced strategy не абстрактна: она прямо называет реальные роли компонентов.',
        code: `componentList: [
  'PageShell',
  'FilterPanel',
  'SummaryStrip',
  'CatalogSurface',
  'CatalogSection',
  'CatalogCard',
],`,
      },
      {
        label: 'src/components/catalog/CatalogSurface.tsx',
        note: 'Даже preview рендерится не одним блоком, а компонентным деревом.',
        code: `return (
  <div className="space-y-5">
    {view.sections.map((section) => (
      <CatalogSection key={section.category} ... />
    ))}
  </div>
);`,
      },
    ],
  },
  tree: {
    files: [
      {
        path: 'src/lib/component-tree-model.ts',
        note: 'Хранит дерево, роли узлов, owner варианты и цепочки props.',
      },
      {
        path: 'src/components/architecture/ComponentTreeView.tsx',
        note: 'Рекурсивный рендер дерева сделан отдельным компонентом и сам показывает component tree в действии.',
      },
      {
        path: 'src/pages/ComponentTreePage.tsx',
        note: 'Страница связывает state owner selector и выбранный узел с моделью дерева.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/component-tree-model.ts',
        note: 'Owner-позиция размечается в самом дереве, а не просто отмечается текстом рядом.',
        code: `const cloneTree = (node, stateOwnerId) => ({
  ...node,
  ownsState: node.id === stateOwnerId,
  children: node.children.map((child) => cloneTree(child, stateOwnerId)),
});`,
      },
      {
        label: 'src/components/architecture/ComponentTreeView.tsx',
        note: 'Tree view рекурсивен, поэтому структура читается как настоящее дерево компонентов.',
        code: `{node.children.length > 0 ? (
  <ul className="ml-4 space-y-3 border-l border-slate-200 pl-4">
    {node.children.map((child) => (
      <TreeBranch key={child.id} node={child} ... />
    ))}
  </ul>
) : null}`,
      },
    ],
  },
  reactVsJs: {
    files: [
      {
        path: 'src/components/imperative/ImperativeCatalogPreview.tsx',
        note: 'В проекте реально есть imperative DOM-рендер через document.createElement и replaceChildren.',
      },
      {
        path: 'src/lib/react-vs-js-model.ts',
        note: 'Отдельно считает, сколько операций описывает ручной DOM против React-модели.',
      },
      {
        path: 'src/components/catalog/CatalogSurface.tsx',
        note: 'React-версия той же задачи выражается обычным компонентным рендером из props.',
      },
    ],
    snippets: [
      {
        label: 'src/components/imperative/ImperativeCatalogPreview.tsx',
        note: 'Imperative preview написан вручную намеренно, чтобы сравнение было честным не только в теории.',
        code: `const summary = document.createElement('div');
summary.textContent = \`Видимых карточек: \${view.visibleCount}.\`;
host.replaceChildren(fragment);`,
      },
      {
        label: 'src/lib/react-vs-js-model.ts',
        note: 'Сравнение строится вокруг операций и декларативных правил.',
        code: `const reactLog = [
  'Держать filters и selectedId как данные внутри компонента.',
  'Передать \`view\` и \`highlightedId\` в <CatalogSurface />.',
];`,
      },
    ],
  },
  composition: {
    files: [
      {
        path: 'src/components/composition/WorkbenchLayout.tsx',
        note: 'Layout собирается из slot-like props и показывает композицию прямо в текущем коде.',
      },
      {
        path: 'src/lib/data-composition-model.ts',
        note: 'Модель раскладывает экран на зависимости частей и их входные данные.',
      },
      {
        path: 'src/pages/DataCompositionPage.tsx',
        note: 'Страница соединяет layout, summary, main и aside в одно дерево из независимых частей.',
      },
    ],
    snippets: [
      {
        label: 'src/components/composition/WorkbenchLayout.tsx',
        note: 'Композиция здесь выражена через пропсы частей, а не через жёстко захардкоженный экран.',
        code: `<WorkbenchLayout
  header={...}
  toolbar={...}
  summary={...}
  main={...}
  aside={...}
/>`,
      },
      {
        label: 'src/lib/data-composition-model.ts',
        note: 'Каждая часть экрана получает только свой набор входных зависимостей.',
        code: `const dependencies = [
  { part: 'FilterPanel', dependsOn: ['query', 'category', 'onlyStable'] },
  { part: 'CatalogSurface', dependsOn: ['view.sections', 'view.focusTag'] },
];`,
      },
    ],
  },
} as const;
