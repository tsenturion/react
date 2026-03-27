export type CatalogCategory = 'Мышление' | 'Компоненты' | 'Данные' | 'Практика';
export type CatalogCategoryFilter = 'all' | CatalogCategory;
export type CatalogTag = 'react' | 'components' | 'state' | 'composition' | 'dom';
export type CatalogFocusTag = 'all' | CatalogTag;
export type SortMode = 'priority' | 'alphabetical';

export type CatalogItem = {
  id: string;
  title: string;
  summary: string;
  category: CatalogCategory;
  stable: boolean;
  priority: number;
  tags: readonly CatalogTag[];
};

export type CatalogOptions = {
  query: string;
  category: CatalogCategoryFilter;
  onlyStable: boolean;
  sortMode: SortMode;
  focusTag: CatalogFocusTag;
};

export type CatalogSection = {
  category: CatalogCategory;
  items: CatalogItem[];
};

export type CatalogView = {
  items: CatalogItem[];
  sections: CatalogSection[];
  totalCount: number;
  visibleCount: number;
  stableVisibleCount: number;
  emphasizedCount: number;
  focusTag: CatalogFocusTag;
  activeFilters: string[];
  emptyTitle: string;
  emptyCopy: string;
};

export const catalogCategories = [
  'Мышление',
  'Компоненты',
  'Данные',
  'Практика',
] as const satisfies readonly CatalogCategory[];

export const categoryFilters = [
  { id: 'all', label: 'Все категории' },
  { id: 'Мышление', label: 'Мышление' },
  { id: 'Компоненты', label: 'Компоненты' },
  { id: 'Данные', label: 'Данные и state' },
  { id: 'Практика', label: 'Практика' },
] as const satisfies readonly { id: CatalogCategoryFilter; label: string }[];

export const focusTagOptions = [
  { id: 'all', label: 'Без акцента' },
  { id: 'react', label: 'React' },
  { id: 'components', label: 'Components' },
  { id: 'state', label: 'State' },
  { id: 'composition', label: 'Composition' },
  { id: 'dom', label: 'DOM' },
] as const satisfies readonly { id: CatalogFocusTag; label: string }[];

export const sortModes = [
  { id: 'priority', label: 'По смысловому приоритету' },
  { id: 'alphabetical', label: 'По алфавиту' },
] as const satisfies readonly { id: SortMode; label: string }[];

export const defaultCatalogOptions: CatalogOptions = {
  query: '',
  category: 'all',
  onlyStable: false,
  sortMode: 'priority',
  focusTag: 'all',
};

export const catalogItems: readonly CatalogItem[] = [
  {
    id: 'react-role',
    title: 'React как слой описания UI',
    summary: 'Помогает описывать экран через данные, состояние и композицию компонентов.',
    category: 'Мышление',
    stable: true,
    priority: 1,
    tags: ['react', 'components'],
  },
  {
    id: 'declarative-render',
    title: 'Декларативный рендер',
    summary:
      'Сначала описывается результат, затем React синхронизирует DOM под это описание.',
    category: 'Мышление',
    stable: true,
    priority: 2,
    tags: ['react', 'state'],
  },
  {
    id: 'component-boundaries',
    title: 'Границы компонентов',
    summary:
      'Экран разбивается на независимые части по ответственности, а не по размеру файла.',
    category: 'Компоненты',
    stable: true,
    priority: 3,
    tags: ['components', 'composition'],
  },
  {
    id: 'component-tree',
    title: 'Дерево компонентов',
    summary:
      'UI становится деревом экранов, контейнеров, секций и карточек с понятными связями.',
    category: 'Компоненты',
    stable: true,
    priority: 4,
    tags: ['components', 'react', 'composition'],
  },
  {
    id: 'derived-view',
    title: 'UI из данных',
    summary:
      'Список, summary и empty state вычисляются из одного набора данных, а не поддерживаются вручную.',
    category: 'Данные',
    stable: true,
    priority: 5,
    tags: ['state', 'react', 'composition'],
  },
  {
    id: 'shared-owner',
    title: 'Владелец состояния',
    summary:
      'Нужно выбрать компонент, который держит состояние и передаёт остальным только нужные props.',
    category: 'Данные',
    stable: true,
    priority: 6,
    tags: ['state', 'components'],
  },
  {
    id: 'dom-patches',
    title: 'Ручные DOM-патчи',
    summary:
      'Наглядно показывают, насколько быстро разрастается императивная логика на динамическом экране.',
    category: 'Практика',
    stable: false,
    priority: 7,
    tags: ['dom', 'state'],
  },
  {
    id: 'js-vs-react',
    title: 'Обычный JS vs React',
    summary:
      'Одна и та же задача выглядит по-разному: команды для DOM против описания результата.',
    category: 'Практика',
    stable: true,
    priority: 8,
    tags: ['dom', 'react'],
  },
  {
    id: 'layout-composition',
    title: 'Композиция экрана',
    summary:
      'Layout, toolbar, summary, main и aside собираются как независимые блоки в одно дерево.',
    category: 'Компоненты',
    stable: true,
    priority: 9,
    tags: ['composition', 'react'],
  },
] as const;

const sortItems = (items: CatalogItem[], sortMode: SortMode) =>
  [...items].sort((left, right) => {
    if (sortMode === 'alphabetical') {
      return left.title.localeCompare(right.title, 'ru');
    }

    return left.priority - right.priority;
  });

export function deriveCatalogView(options: CatalogOptions): CatalogView {
  const query = options.query.trim().toLowerCase();
  const focusTag = options.focusTag;

  const items = catalogItems.filter((item) => {
    const queryMatches =
      query.length === 0 ||
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query);
    const categoryMatches =
      options.category === 'all' || item.category === options.category;
    const stabilityMatches = !options.onlyStable || item.stable;

    return queryMatches && categoryMatches && stabilityMatches;
  });

  const sortedItems = sortItems(items, options.sortMode);
  const sections = catalogCategories
    .map((category) => ({
      category,
      items: sortedItems.filter((item) => item.category === category),
    }))
    .filter((section) => section.items.length > 0);

  const activeFilters = [
    ...(options.query ? [`Поиск: «${options.query}»`] : []),
    ...(options.category !== 'all' ? [`Категория: ${options.category}`] : []),
    ...(options.onlyStable ? ['Только готовые блоки'] : []),
    ...(options.sortMode === 'alphabetical' ? ['Сортировка: алфавит'] : []),
    ...(options.focusTag !== 'all' ? [`Акцент: ${options.focusTag}`] : []),
  ];

  return {
    items: sortedItems,
    sections,
    totalCount: catalogItems.length,
    visibleCount: sortedItems.length,
    stableVisibleCount: sortedItems.filter((item) => item.stable).length,
    emphasizedCount:
      focusTag === 'all'
        ? 0
        : sortedItems.filter((item) => item.tags.includes(focusTag)).length,
    focusTag,
    activeFilters,
    emptyTitle: 'Компонентное дерево стало пустым',
    emptyCopy:
      'Текущая комбинация фильтров не оставила ни одной карточки. В декларативном UI это один и тот же branch рендера, а не набор ручных hide/show команд.',
  };
}
