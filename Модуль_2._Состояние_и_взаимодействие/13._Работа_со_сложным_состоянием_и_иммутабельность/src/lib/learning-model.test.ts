import { describe, expect, it } from 'vitest';

import { appendChecklistItem, toggleChecklistItem } from './array-state-model';
import {
  createChecklistItems,
  createHistorySnapshots,
  createLessonSettings,
  createNestedBoard,
  createNormalizedBoard,
  createReferenceItems,
} from './complex-state-domain';
import {
  analyzeHistory,
  appendHistoryImmutably,
  appendHistoryWithMutation,
} from './mutation-history-model';
import {
  buildNormalizationComparison,
  moveNormalizedTaskToNextColumn,
} from './normalization-model';
import { increaseTaskPointsImmutably } from './nested-state-model';
import { toggleThemeImmutable, toggleThemeMutably } from './object-state-model';
import {
  buildReferenceReuseReport,
  updateReferenceItemTargeted,
  updateReferenceItemsDeepClone,
} from './structural-sharing-model';

describe('complex state and immutability lesson models', () => {
  it('replaces object reference for immutable updates and keeps it for mutations', () => {
    const settings = createLessonSettings();

    expect(toggleThemeImmutable(settings)).not.toBe(settings);
    expect(toggleThemeMutably(settings)).toBe(settings);
  });

  it('updates arrays through immutable helpers', () => {
    const appended = appendChecklistItem(createChecklistItems());
    const toggled = toggleChecklistItem(appended, 'step-2');

    expect(appended).toHaveLength(4);
    expect(toggled.find((item) => item.id === 'step-2')?.done).toBe(true);
  });

  it('copies nested path when updating deep task', () => {
    const board = createNestedBoard();
    const nextBoard = increaseTaskPointsImmutably(board, 'doing', 'task-immutability', 1);

    expect(nextBoard).not.toBe(board);
    expect(nextBoard.columns[1]).not.toBe(board.columns[1]);
    expect(nextBoard.columns[1].tasks[0].points).toBe(
      board.columns[1].tasks[0].points + 1,
    );
  });

  it('shows how mutation breaks history snapshots', () => {
    const badHistory = appendHistoryWithMutation(
      appendHistoryWithMutation(createHistorySnapshots()),
    );
    const goodHistory = appendHistoryImmutably(
      appendHistoryImmutably(createHistorySnapshots()),
    );

    expect(analyzeHistory(badHistory).uniqueReferences).toBe(1);
    expect(analyzeHistory(goodHistory).uniqueReferences).toBe(3);
  });

  it('moves normalized task without touching unrelated entities', () => {
    const board = createNormalizedBoard();
    const nextBoard = moveNormalizedTaskToNextColumn(board, 'task-state');
    const comparison = buildNormalizationComparison('move');

    expect(nextBoard.columnsById.backlog.taskIds.includes('task-state')).toBe(false);
    expect(nextBoard.columnsById.doing.taskIds.includes('task-state')).toBe(true);
    expect(comparison.normalizedCopies).toBeLessThan(comparison.nestedCopies);
  });

  it('reuses more references in targeted copy than in deep clone', () => {
    const items = createReferenceItems();
    const targeted = updateReferenceItemTargeted(items, 'item-3');
    const deepClone = updateReferenceItemsDeepClone(items, 'item-3');

    expect(buildReferenceReuseReport(items, targeted, 'targeted').reusedCount).toBe(5);
    expect(buildReferenceReuseReport(items, deepClone, 'deep-clone').reusedCount).toBe(0);
  });
});
