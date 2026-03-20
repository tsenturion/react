import type { CatalogItem } from './shared-state-domain';

export type DashboardState = {
  query: string;
  track: 'all' | CatalogItem['track'];
};

export type DashboardSummary = {
  visibleCount: number;
  totalDuration: number;
  summary: string;
  snippet: string;
};

export function getVisibleCatalogItems(
  items: CatalogItem[],
  state: DashboardState,
): CatalogItem[] {
  const query = state.query.trim().toLowerCase();

  return items.filter((item) => {
    if (state.track !== 'all' && item.track !== state.track) {
      return false;
    }

    if (!query) {
      return true;
    }

    return item.title.toLowerCase().includes(query);
  });
}

export function buildDashboardSummary(
  items: CatalogItem[],
  state: DashboardState,
): DashboardSummary {
  const visibleItems = getVisibleCatalogItems(items, state);

  return {
    visibleCount: visibleItems.length,
    totalDuration: visibleItems.reduce((sum, item) => sum + item.duration, 0),
    summary:
      'Один shared filter state одновременно управляет toolbar, списком карточек и summary-блоком. Это и есть нормальная связь одного состояния с несколькими визуально независимыми частями интерфейса.',
    snippet: [
      'const visibleItems = getVisibleCatalogItems(items, filterState);',
      'const totalDuration = visibleItems.reduce((sum, item) => sum + item.duration, 0);',
    ].join('\n'),
  };
}
