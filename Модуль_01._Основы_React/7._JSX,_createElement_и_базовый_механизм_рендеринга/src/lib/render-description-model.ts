export type CatalogLevel = 'all' | 'base' | 'advanced';
export type CatalogSort = 'title' | 'duration' | 'price';
export type CatalogLayout = 'grid' | 'list';

export type CatalogState = {
  query: string;
  level: CatalogLevel;
  availableOnly: boolean;
  sort: CatalogSort;
  layout: CatalogLayout;
};

export type CatalogLesson = {
  id: string;
  title: string;
  level: Exclude<CatalogLevel, 'all'>;
  duration: number;
  price: number;
  available: boolean;
  summary: string;
};

export type RenderSurface = {
  lessons: CatalogLesson[];
  emptyMessage: string | null;
  rootType: 'ul' | 'div';
  summary: string;
  removedCount: number;
};

export const defaultCatalogState: CatalogState = {
  query: '',
  level: 'all',
  availableOnly: false,
  sort: 'title',
  layout: 'grid',
};

const lessons: readonly CatalogLesson[] = [
  {
    id: 'jsx-basics',
    title: 'JSX как описание интерфейса',
    level: 'base',
    duration: 35,
    price: 0,
    available: true,
    summary: 'Сравнение декларативного описания с ручными DOM-действиями.',
  },
  {
    id: 'create-element',
    title: 'Что скрывает createElement',
    level: 'advanced',
    duration: 48,
    price: 1200,
    available: true,
    summary: 'Переход от JSX к структуре React elements и чтение итогового дерева.',
  },
  {
    id: 'jsx-constraints',
    title: 'Ограничения JSX и чистый рендер',
    level: 'base',
    duration: 42,
    price: 900,
    available: false,
    summary: 'Выражения, ошибки компиляции и побочные эффекты внутри render-phase.',
  },
  {
    id: 'fragment-lab',
    title: 'Fragments без лишней разметки',
    level: 'advanced',
    duration: 30,
    price: 700,
    available: true,
    summary: 'Как сохранить корректную структуру без дополнительных wrapper-элементов.',
  },
] as const;

export function buildRenderSurface(state: CatalogState): RenderSurface {
  const query = state.query.trim().toLowerCase();

  const filtered = lessons
    .filter((lesson) =>
      query.length === 0
        ? true
        : `${lesson.title} ${lesson.summary}`.toLowerCase().includes(query),
    )
    .filter((lesson) => (state.level === 'all' ? true : lesson.level === state.level))
    .filter((lesson) => (state.availableOnly ? lesson.available : true))
    .slice()
    .sort((left, right) => {
      if (state.sort === 'duration') return left.duration - right.duration;
      if (state.sort === 'price') return left.price - right.price;
      return left.title.localeCompare(right.title, 'ru');
    });

  return {
    lessons: filtered,
    emptyMessage:
      filtered.length === 0
        ? 'Текущие входные данные не создают ни одной карточки в результирующем JSX.'
        : null,
    rootType: state.layout === 'grid' ? 'ul' : 'div',
    summary:
      filtered.length === 0
        ? 'Описание интерфейса свелось к empty state.'
        : `Из ${lessons.length} исходных элементов в JSX-дереве осталось ${filtered.length}.`,
    removedCount: lessons.length - filtered.length,
  };
}

export function buildRenderSnippet(surface: RenderSurface) {
  if (surface.lessons.length === 0) {
    return [
      '<section>',
      '  <h3>Пустой результат</h3>',
      '  <p>{emptyMessage}</p>',
      '</section>',
    ].join('\n');
  }

  if (surface.rootType === 'ul') {
    return [
      '<ul>',
      '  {lessons.map((lesson) => (',
      '    <li key={lesson.id}>',
      '      <h3>{lesson.title}</h3>',
      '      <p>{lesson.summary}</p>',
      '    </li>',
      '  ))}',
      '</ul>',
    ].join('\n');
  }

  return [
    '<div>',
    '  {lessons.map((lesson) => (',
    '    <article key={lesson.id}>',
    '      <h3>{lesson.title}</h3>',
    '      <p>{lesson.summary}</p>',
    '    </article>',
    '  ))}',
    '</div>',
  ].join('\n');
}
