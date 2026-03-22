import type { ReviewItem, ReviewTrack } from './context-domain';

export type WorkspaceState = {
  scopeName: string;
  filter: ReviewTrack;
  showResolved: boolean;
  focusedId: string | null;
  draftNote: string;
  items: ReviewItem[];
  actionCount: number;
};

export type WorkspaceAction =
  | { type: 'filter/set'; filter: ReviewTrack }
  | { type: 'focus/set'; id: string }
  | { type: 'visibility/toggleResolved' }
  | { type: 'item/toggleResolved'; id: string }
  | { type: 'item/cyclePriority'; id: string }
  | { type: 'draft/set'; value: string }
  | { type: 'draft/apply' }
  | { type: 'workspace/reset'; snapshot: WorkspaceState };

function cyclePriority(priority: ReviewItem['priority']): ReviewItem['priority'] {
  if (priority === 'low') {
    return 'medium';
  }

  if (priority === 'medium') {
    return 'high';
  }

  return 'low';
}

function cloneItems(items: readonly ReviewItem[]) {
  return items.map((item) => ({ ...item }));
}

export function cloneWorkspaceState(snapshot: WorkspaceState): WorkspaceState {
  return {
    ...snapshot,
    items: cloneItems(snapshot.items),
  };
}

export function createWorkspaceState(
  scopeName: string,
  items: readonly ReviewItem[],
): WorkspaceState {
  const clonedItems = cloneItems(items);
  const focusedId = clonedItems[0]?.id ?? null;

  return {
    scopeName,
    filter: 'all',
    showResolved: true,
    focusedId,
    draftNote: clonedItems[0]?.note ?? '',
    items: clonedItems,
    actionCount: 0,
  };
}

function withActionCount(
  state: WorkspaceState,
  nextState: WorkspaceState,
): WorkspaceState {
  return {
    ...nextState,
    actionCount: state.actionCount + 1,
  };
}

export function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  // Reducer держит все переходы состояния в одном месте.
  // Это и есть главная польза useReducer: UI dispatch-ит намерение,
  // а не размазывает setState-логику по множеству обработчиков.
  switch (action.type) {
    case 'filter/set':
      return withActionCount(state, {
        ...state,
        filter: action.filter,
      });

    case 'focus/set': {
      const focusedItem = state.items.find((item) => item.id === action.id);

      return withActionCount(state, {
        ...state,
        focusedId: action.id,
        draftNote: focusedItem?.note ?? '',
      });
    }

    case 'visibility/toggleResolved':
      return withActionCount(state, {
        ...state,
        showResolved: !state.showResolved,
      });

    case 'item/toggleResolved':
      return withActionCount(state, {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, resolved: !item.resolved } : item,
        ),
      });

    case 'item/cyclePriority':
      return withActionCount(state, {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, priority: cyclePriority(item.priority) }
            : item,
        ),
      });

    case 'draft/set':
      return withActionCount(state, {
        ...state,
        draftNote: action.value,
      });

    case 'draft/apply':
      if (!state.focusedId) {
        return state;
      }

      return withActionCount(state, {
        ...state,
        items: state.items.map((item) =>
          item.id === state.focusedId ? { ...item, note: state.draftNote } : item,
        ),
      });

    case 'workspace/reset':
      return cloneWorkspaceState(action.snapshot);

    default:
      return state;
  }
}

export function getVisibleItems(state: WorkspaceState) {
  return state.items.filter((item) => {
    const matchesFilter = state.filter === 'all' || item.track === state.filter;
    const matchesVisibility = state.showResolved || !item.resolved;

    return matchesFilter && matchesVisibility;
  });
}

export function getWorkspaceSummary(state: WorkspaceState) {
  const openCount = state.items.filter((item) => !item.resolved).length;
  const resolvedCount = state.items.length - openCount;
  const focusedTitle =
    state.items.find((item) => item.id === state.focusedId)?.title ?? 'Ничего не выбрано';

  return {
    openCount,
    resolvedCount,
    focusedTitle,
  };
}
