import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';

export const selectLessonView = (state: RootState) => state.lessonView;
export const selectReviewBoard = (state: RootState) => state.reviewBoard;

export const selectVisibleItems = createSelector([selectReviewBoard], (board) =>
  board.items.filter((item) => {
    const matchesFilter = board.filter === 'all' || item.track === board.filter;
    const matchesVisibility = board.showResolved || !item.resolved;

    return matchesFilter && matchesVisibility;
  }),
);

export const selectFocusedItem = createSelector(
  [selectReviewBoard],
  (board) => board.items.find((item) => item.id === board.focusedId) ?? null,
);

export const selectBoardSummary = createSelector([selectReviewBoard], (board) => {
  const openCount = board.items.filter((item) => !item.resolved).length;
  const resolvedCount = board.items.length - openCount;

  return {
    openCount,
    resolvedCount,
    actionCount: board.actionCount,
    lastActionType: board.lastActionType,
  };
});
