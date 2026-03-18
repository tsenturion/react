import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/components/rendering/JsxCatalogCard.tsx',
        note: 'Реальный JSX-компонент, который описывает карточку без ручной работы с DOM.',
      },
      {
        path: 'src/lib/catalog-card-model.ts',
        note: 'Чистая модель данных для той же карточки: JSX получает уже подготовленный view model.',
      },
      {
        path: 'src/pages/JsxOverviewPage.tsx',
        note: 'Лаборатория связывает controls, preview, snippets и element tree в одном месте.',
      },
    ],
    snippets: [
      {
        label: 'JSX card builder',
        note: 'Карточка описывается как дерево элементов, а не как последовательность DOM-команд.',
        code: [
          'return (',
          '  <article className={viewModel.rootClassName}>',
          '    <header className="space-y-3">',
          '      {viewModel.badgeLabel ? <span>{viewModel.badgeLabel}</span> : null}',
          '      <h3>{viewModel.title}</h3>',
          '    </header>',
          '    <ul>{viewModel.highlights.map((item) => <li key={item}>{item}</li>)}</ul>',
          '  </article>',
          ');',
        ].join('\n'),
      },
      {
        label: 'View model',
        note: 'Данные для JSX сначала собираются в чистую модель, чтобы рендер оставался коротким и читаемым.',
        code: [
          'export function buildCardViewModel(controls: CardControls): CardViewModel {',
          "  const isSoldOut = controls.stockState === 'sold-out';",
          '  return {',
          '    title: tone.title,',
          '    highlights: highlightPool.slice(0, controls.highlightCount),',
          '    ctaDisabled: isSoldOut,',
          '  };',
          '}',
        ].join('\n'),
      },
    ],
  },
  'create-element': {
    files: [
      {
        path: 'src/components/rendering/ManualCatalogCard.tsx',
        note: 'Та же карточка, но уже без JSX, через `React.createElement(...)`.',
      },
      {
        path: 'src/components/rendering/ElementTreeView.tsx',
        note: 'Инспектор показывает не DOM, а React element tree, созданный JSX или createElement.',
      },
      {
        path: 'src/lib/element-inspector.ts',
        note: 'Нормализация React elements в читаемую текстовую форму.',
      },
    ],
    snippets: [
      {
        label: 'Manual createElement',
        note: 'Здесь намеренно нет JSX: структура раскрывается через явные вызовы `React.createElement`.',
        code: [
          "return React.createElement('article', { className: viewModel.rootClassName },",
          "  React.createElement('header', { className: 'space-y-3' }, ...),",
          "  React.createElement('ul', null,",
          "    ...viewModel.highlights.map((item) => React.createElement('li', { key: item }, item)),",
          '  ),',
          ');',
        ].join('\n'),
      },
      {
        label: 'Element inspector',
        note: 'Инспектор читает React elements как данные и показывает тип, props и children.',
        code: [
          'if (isValidElement<Record<string, unknown>>(node)) {',
          '  const { children, ...restProps } = node.props ?? {};',
          '  return [{',
          '    kind: "element",',
          '    typeName: getTypeName(node.type),',
          '    children: Children.toArray(children as ReactNode).flatMap(inspectReactNode),',
          '  }];',
          '}',
        ].join('\n'),
      },
    ],
  },
  expressions: {
    files: [
      {
        path: 'src/lib/expression-model.ts',
        note: 'Все типовые кейсы собраны в одну чистую модель: валидные выражения, ошибки и опасные паттерны.',
      },
      {
        path: 'src/pages/ExpressionsPage.tsx',
        note: 'Лаборатория показывает результат выражения и исправление рядом.',
      },
      {
        path: 'src/App.tsx',
        note: 'Верхнее меню урока само использует условия и массивы в JSX.',
      },
    ],
    snippets: [
      {
        label: 'Case switch',
        note: 'Одна чистая функция выдаёт итог для конкретной JSX-конструкции.',
        code: [
          'switch (caseId) {',
          "  case 'map':",
          '    return {',
          "      previewKind: 'list',",
          '      previewItems: tags.map((tag) => `Тег: ${tag}`),',
          '      example: `{tags.map((tag) => <span key={tag}>{tag}</span>)}`',
          '    };',
          '}',
        ].join('\n'),
      },
      {
        label: 'Preview routing',
        note: 'Результат из модели превращается в JSX только на последнем шаге.',
        code: [
          "{report.previewKind === 'text' ? <p>{report.previewText}</p> : null}",
          "{report.previewKind === 'list' ? (",
          '  <div>{report.previewItems.map((item) => <span key={item}>{item}</span>)}</div>',
          ') : null}',
        ].join('\n'),
      },
    ],
  },
  'html-vs-jsx': {
    files: [
      {
        path: 'src/lib/html-vs-jsx-model.ts',
        note: 'Собран набор различий между HTML и JSX с практическими последствиями.',
      },
      {
        path: 'src/pages/HtmlVsJsxPage.tsx',
        note: 'Правило можно переключать и сразу сравнивать HTML-привычку с корректным JSX.',
      },
      {
        path: 'src/main.tsx',
        note: 'Даже в точке входа видно, что JSX живёт внутри JavaScript-модуля и подчиняется его синтаксису.',
      },
    ],
    snippets: [
      {
        label: 'HTML vs JSX rule',
        note: 'Каждое правило хранит сразу два примера: HTML и корректный JSX.',
        code: [
          '{',
          "  id: 'htmlFor',",
          '  htmlExample: \'<label for="email">Email</label>\',',
          '  jsxExample: \'<label htmlFor="email">Email</label>\',',
          '}',
        ].join('\n'),
      },
      {
        label: 'Rule selection',
        note: 'Сами карточки правил тоже строятся через JSX и локальное состояние.',
        code: [
          '{htmlVsJsxRules.map((item) => (',
          '  <button key={item.id} onClick={() => setSelectedRuleId(item.id)}>',
          '    {item.label}',
          '  </button>',
          '))}',
        ].join('\n'),
      },
    ],
  },
  fragments: {
    files: [
      {
        path: 'src/components/rendering/BreadcrumbTrail.tsx',
        note: 'Один и тот же breadcrumb trail показан в трёх режимах: wrapper, Fragment и component + Fragment.',
      },
      {
        path: 'src/lib/fragment-model.ts',
        note: 'Модель считает лишние DOM-узлы и объясняет разницу между режимами.',
      },
      {
        path: 'src/pages/FragmentsPage.tsx',
        note: 'На странице есть и визуальный preview, и инспекция структуры.',
      },
    ],
    snippets: [
      {
        label: 'Key on Fragment',
        note: 'Когда внешней оболочкой пары siblings становится Fragment, ключ нужен именно ему.',
        code: [
          '{items.map((item, index) => (',
          '  <Fragment key={item.id}>',
          '    <li>{item.label}</li>',
          '    {index < items.length - 1 ? <li aria-hidden="true">/</li> : null}',
          '  </Fragment>',
          '))}',
        ].join('\n'),
      },
      {
        label: 'Wrapper warning',
        note: 'Лишний wrapper сразу меняет прямых детей списка и добавляет шум в DOM.',
        code: [
          '<ol>',
          '  {items.map((item) => (',
          '    <div key={item.id}>',
          '      <li>{item.label}</li>',
          '    </div>',
          '  ))}',
          '</ol>',
        ].join('\n'),
      },
    ],
  },
  'render-description': {
    files: [
      {
        path: 'src/components/rendering/LessonCatalogSurface.tsx',
        note: 'Компонент получает уже отфильтрованные данные и описывает каталог через `map(...)`.',
      },
      {
        path: 'src/lib/render-description-model.ts',
        note: 'Фильтры, сортировка и empty state собраны в чистой модели отдельно от JSX.',
      },
      {
        path: 'src/components/rendering/ElementTreeView.tsx',
        note: 'Инспектор показывает, как новое описание UI появляется раньше обновления DOM.',
      },
    ],
    snippets: [
      {
        label: 'Data → surface',
        note: 'Сначала вычисляется новый набор карточек, затем JSX описывает его одной формой.',
        code: [
          'const filtered = lessons',
          '  .filter((lesson) => matchesQuery(lesson, query))',
          '  .filter((lesson) => level === "all" ? true : lesson.level === level)',
          '  .sort(sortLessons);',
          '',
          'return { lessons: filtered, rootType: layout === "grid" ? "ul" : "div" };',
        ].join('\n'),
      },
      {
        label: 'Catalog map',
        note: 'Сам список строится обычным `map(...)`: структура интерфейса следует за структурой данных.',
        code: [
          '<ul>',
          '  {surface.lessons.map((lesson) => (',
          '    <li key={lesson.id}>',
          '      <h3>{lesson.title}</h3>',
          '      <p>{lesson.summary}</p>',
          '    </li>',
          '  ))}',
          '</ul>',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
