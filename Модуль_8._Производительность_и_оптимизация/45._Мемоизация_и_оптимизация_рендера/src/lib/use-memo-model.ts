export type CatalogTrack = 'all' | 'render' | 'data' | 'routing';

export type CatalogItem = {
  id: string;
  title: string;
  track: Exclude<CatalogTrack, 'all'>;
  complexity: number;
  seats: number;
};

export const memoCatalog: readonly CatalogItem[] = [
  { id: 'render-scan', title: 'Render scan', track: 'render', complexity: 4, seats: 18 },
  { id: 'memo-review', title: 'Memo review', track: 'render', complexity: 5, seats: 12 },
  {
    id: 'callback-map',
    title: 'Callback map',
    track: 'render',
    complexity: 3,
    seats: 24,
  },
  { id: 'data-index', title: 'Data index', track: 'data', complexity: 4, seats: 14 },
  {
    id: 'projection-lab',
    title: 'Projection lab',
    track: 'data',
    complexity: 5,
    seats: 10,
  },
  { id: 'query-cache', title: 'Query cache', track: 'data', complexity: 3, seats: 20 },
  { id: 'route-flow', title: 'Route flow', track: 'routing', complexity: 2, seats: 26 },
  {
    id: 'loader-debug',
    title: 'Loader debug',
    track: 'routing',
    complexity: 4,
    seats: 16,
  },
  {
    id: 'intent-redirect',
    title: 'Intent redirect',
    track: 'routing',
    complexity: 5,
    seats: 8,
  },
] as const;

export type CatalogFilters = {
  track: CatalogTrack;
  minComplexity: number;
};

export function projectCatalog(items: readonly CatalogItem[], filters: CatalogFilters) {
  let operations = 0;
  let totalSeats = 0;

  const visibleItems: CatalogItem[] = [];

  for (const item of items) {
    operations += 1;

    if (filters.track !== 'all' && item.track !== filters.track) {
      continue;
    }

    operations += 1;

    if (item.complexity < filters.minComplexity) {
      continue;
    }

    operations += item.complexity * 5;
    totalSeats += item.seats;
    visibleItems.push(item);
  }

  return {
    visibleItems,
    operations,
    totalSeats,
    summary: `${visibleItems.length} items / ${totalSeats} seats`,
  };
}

export function describeUseMemoScenario(input: {
  usesMemoForProjection: boolean;
  unrelatedStateChanged: boolean;
}) {
  if (!input.usesMemoForProjection) {
    return {
      projectionShouldChange: true,
      headline: 'Derived object пересобирается на каждый parent render',
      detail:
        'Даже изменение заметки shell заново создаёт projection object, поэтому memo-child ниже по дереву теряет стабильность.',
      nextMove:
        'Сначала проверьте, зависит ли derived data только от фильтров, и только потом заворачивайте её в useMemo.',
    } as const;
  }

  if (input.unrelatedStateChanged) {
    return {
      projectionShouldChange: false,
      headline: 'useMemo удерживает derived data стабильной на постороннем render',
      detail:
        'Фильтры не менялись, поэтому projection object и downstream memo-child могут остаться нетронутыми.',
      nextMove:
        'Используйте этот паттерн там, где derived value дорогая или участвует в сравнении props.',
    } as const;
  }

  return {
    projectionShouldChange: true,
    headline: 'Изменение фильтра должно пересчитать projection',
    detail:
      'useMemo не отменяет полезный пересчёт. Оно лишь не даёт делать тот же самый expensive derive без причины.',
    nextMove:
      'Следите за тем, чтобы dependencies отражали только реальные входные данные derived value.',
  } as const;
}
