import type { RoutingModule } from './routing-domain';

export type CatalogLevel = 'all' | RoutingModule['level'];
export type CatalogSort = 'popular' | 'progress' | 'title';
export type CatalogView = 'cards' | 'table';

export type WorkspaceTab = 'outline' | 'activity' | 'notes';
export type WorkspaceStatus = 'all' | RoutingModule['status'];
export type WorkspaceSort = 'progress' | 'title';

export type EntityTab = 'overview' | 'routing' | 'pitfalls';
export type EntityPanel = 'summary' | 'history' | 'links';

const catalogLevels = ['all', 'base', 'advanced'] as const;
const catalogSorts = ['popular', 'progress', 'title'] as const;
const catalogViews = ['cards', 'table'] as const;
const workspaceTabs = ['outline', 'activity', 'notes'] as const;
const workspaceStatuses = ['all', 'todo', 'in-progress', 'done'] as const;
const workspaceSorts = ['progress', 'title'] as const;
const entityTabs = ['overview', 'routing', 'pitfalls'] as const;
const entityPanels = ['summary', 'history', 'links'] as const;

function normalizeValue<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes((value ?? '') as T) ? (value as T) : fallback;
}

export function resolveCatalogSearchState(searchParams: URLSearchParams) {
  return {
    level: normalizeValue(searchParams.get('level'), catalogLevels, 'all'),
    sort: normalizeValue(searchParams.get('sort'), catalogSorts, 'popular'),
    view: normalizeValue(searchParams.get('view'), catalogViews, 'cards'),
  };
}

export function getCatalogItems(
  items: readonly RoutingModule[],
  state: ReturnType<typeof resolveCatalogSearchState>,
) {
  const filtered =
    state.level === 'all'
      ? [...items]
      : items.filter((item) => item.level === state.level);

  return filtered.sort((left, right) => {
    if (state.sort === 'popular') {
      return right.popularity - left.popularity;
    }

    if (state.sort === 'progress') {
      return right.progress - left.progress;
    }

    return left.title.localeCompare(right.title, 'ru');
  });
}

export function resolveWorkspaceUrlState(searchParams: URLSearchParams) {
  return {
    tab: normalizeValue(searchParams.get('tab'), workspaceTabs, 'outline'),
    status: normalizeValue(searchParams.get('status'), workspaceStatuses, 'all'),
    sort: normalizeValue(searchParams.get('sort'), workspaceSorts, 'progress'),
  };
}

export function getWorkspaceRows(
  items: readonly RoutingModule[],
  state: ReturnType<typeof resolveWorkspaceUrlState>,
) {
  const filtered =
    state.status === 'all'
      ? [...items]
      : items.filter((item) => item.status === state.status);

  const ordered = filtered.sort((left, right) => {
    if (state.sort === 'progress') {
      return right.progress - left.progress;
    }

    return left.title.localeCompare(right.title, 'ru');
  });

  return ordered.map((item) => ({
    id: item.id,
    title: item.title,
    tone:
      state.tab === 'outline'
        ? item.focus
        : state.tab === 'activity'
          ? item.routingNotes[0]
          : item.pitfallNotes[0],
  }));
}

export function resolveEntityUrlState(searchParams: URLSearchParams) {
  return {
    tab: normalizeValue(searchParams.get('tab'), entityTabs, 'overview'),
    panel: normalizeValue(searchParams.get('panel'), entityPanels, 'summary'),
  };
}

// URL уже и есть источник истины. Здесь не нужен дополнительный local state
// для query-driven фильтров: достаточно нормализовать значения и писать в адрес
// только те параметры, которые действительно описывают состояние экрана.
export function patchSearchParams(
  searchParams: URLSearchParams,
  patch: Record<string, string | null | undefined>,
) {
  const next = new URLSearchParams(searchParams);

  Object.entries(patch).forEach(([key, value]) => {
    if (value == null || value === '') {
      next.delete(key);
      return;
    }

    next.set(key, value);
  });

  return next;
}
