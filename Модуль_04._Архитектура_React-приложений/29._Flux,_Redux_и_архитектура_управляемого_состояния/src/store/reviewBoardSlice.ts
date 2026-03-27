import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { reviewBoardSeed, type BoardItem, type ReviewTrack } from '../lib/redux-domain';

type ReviewBoardState = {
  scopeName: string;
  filter: ReviewTrack;
  showResolved: boolean;
  focusedId: string | null;
  draftNote: string;
  items: BoardItem[];
  actionCount: number;
  lastActionType: string;
};

function cloneItems(items: readonly BoardItem[]) {
  return items.map((item) => ({ ...item }));
}

function cyclePriority(priority: BoardItem['priority']) {
  if (priority === 'low') {
    return 'medium';
  }

  if (priority === 'medium') {
    return 'high';
  }

  return 'low';
}

export function createReviewBoardState(): ReviewBoardState {
  const items = cloneItems(reviewBoardSeed);

  return {
    scopeName: 'Redux review board',
    filter: 'all',
    showResolved: true,
    focusedId: items[0]?.id ?? null,
    draftNote: items[0]?.note ?? '',
    items,
    actionCount: 0,
    lastActionType: 'reviewBoard/bootstrap',
  };
}

function markAction(state: ReviewBoardState, type: string) {
  state.actionCount += 1;
  state.lastActionType = type;
}

const initialState = createReviewBoardState();

export const reviewBoardSlice = createSlice({
  name: 'reviewBoard',
  initialState,
  reducers: {
    // RTK позволяет писать reducers в "мутабельном" стиле, но под капотом
    // они всё равно остаются immutable transitions через Immer. Это важно для
    // Redux-модели: reducers по-прежнему описывают следующее состояние.
    filterSet(state, action: PayloadAction<ReviewTrack>) {
      state.filter = action.payload;
      markAction(state, 'reviewBoard/filterSet');
    },
    resolvedVisibilityToggled(state) {
      state.showResolved = !state.showResolved;
      markAction(state, 'reviewBoard/resolvedVisibilityToggled');
    },
    focusSet(state, action: PayloadAction<string>) {
      state.focusedId = action.payload;
      const focusedItem = state.items.find((item) => item.id === action.payload);
      state.draftNote = focusedItem?.note ?? '';
      markAction(state, 'reviewBoard/focusSet');
    },
    itemResolvedToggled(state, action: PayloadAction<string>) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) {
        item.resolved = !item.resolved;
      }
      markAction(state, 'reviewBoard/itemResolvedToggled');
    },
    itemPriorityCycled(state, action: PayloadAction<string>) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) {
        item.priority = cyclePriority(item.priority);
      }
      markAction(state, 'reviewBoard/itemPriorityCycled');
    },
    draftChanged(state, action: PayloadAction<string>) {
      state.draftNote = action.payload;
      markAction(state, 'reviewBoard/draftChanged');
    },
    draftApplied(state) {
      if (!state.focusedId) {
        return;
      }

      const item = state.items.find((entry) => entry.id === state.focusedId);
      if (item) {
        item.note = state.draftNote;
      }
      markAction(state, 'reviewBoard/draftApplied');
    },
    boardReset() {
      return createReviewBoardState();
    },
  },
});

export const {
  boardReset,
  draftApplied,
  draftChanged,
  filterSet,
  focusSet,
  itemPriorityCycled,
  itemResolvedToggled,
  resolvedVisibilityToggled,
} = reviewBoardSlice.actions;
