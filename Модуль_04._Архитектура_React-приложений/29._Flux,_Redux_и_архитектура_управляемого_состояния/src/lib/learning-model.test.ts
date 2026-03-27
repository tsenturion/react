import { describe, expect, it } from 'vitest';

import { buildFluxReport } from './flux-loop-model';
import { evaluateStoreSurface, recommendStateArchitecture } from './redux-strategy-model';
import { lessonViewSlice } from '../store/lessonViewSlice';
import {
  draftApplied,
  draftChanged,
  filterSet,
  focusSet,
  resolvedVisibilityToggled,
  reviewBoardSlice,
} from '../store/reviewBoardSlice';
import { selectVisibleItems } from '../store/selectors';
import type { RootState } from '../store/store';

function createRootState(
  reviewBoard = reviewBoardSlice.reducer(undefined, { type: '@@INIT' }),
): RootState {
  return {
    lessonView: lessonViewSlice.reducer(undefined, { type: '@@INIT' }),
    reviewBoard,
  };
}

describe('lesson 29 models', () => {
  it('builds a six-step flux report for a concrete action preset', () => {
    const report = buildFluxReport('resolve-item');

    expect(report.actionType).toBe('reviewBoard/itemResolvedToggled');
    expect(report.steps).toHaveLength(6);
    expect(report.steps[0]?.phase).toBe('view');
    expect(report.steps[5]?.phase).toBe('view-update');
  });

  it('updates filter and telemetry fields through the slice reducer', () => {
    const state = reviewBoardSlice.reducer(undefined, filterSet('state'));

    expect(state.filter).toBe('state');
    expect(state.lastActionType).toBe('reviewBoard/filterSet');
    expect(state.actionCount).toBe(1);
  });

  it('applies a draft note to the focused item through redux transitions', () => {
    let state = reviewBoardSlice.reducer(undefined, focusSet('redux-2'));
    state = reviewBoardSlice.reducer(
      state,
      draftChanged('Новая заметка для централизованного store.'),
    );
    state = reviewBoardSlice.reducer(state, draftApplied());

    expect(state.lastActionType).toBe('reviewBoard/draftApplied');
    expect(state.items.find((item) => item.id === 'redux-2')?.note).toBe(
      'Новая заметка для централизованного store.',
    );
  });

  it('filters derived visible items through selectors instead of JSX conditions', () => {
    let board = reviewBoardSlice.reducer(undefined, filterSet('state'));
    board = reviewBoardSlice.reducer(board, resolvedVisibilityToggled());
    const items = selectVisibleItems(createRootState(board));

    expect(items).toHaveLength(0);
  });

  it('recommends local state for small nearby scenarios and redux for app-wide coordination', () => {
    const localRecommendation = recommendStateArchitecture({
      treeDepth: 2,
      sharedScope: 'branch',
      consumerSpread: 'near',
      transitions: 'simple',
      crossFeature: false,
      debugNeed: false,
    });
    const reduxRecommendation = recommendStateArchitecture({
      treeDepth: 5,
      sharedScope: 'app',
      consumerSpread: 'distant',
      transitions: 'complex',
      crossFeature: true,
      debugNeed: true,
    });

    expect(localRecommendation.primary).toBe('local state');
    expect(reduxRecommendation.primary).toBe('redux');
  });

  it('detects an overloaded redux store surface when local and server concerns are mixed in', () => {
    const report = evaluateStoreSurface(
      ['theme', 'inlineDraft', 'serverCatalog'],
      ['theme'],
    );

    expect(report.tone).toBe('error');
    expect(report.irrelevantConcerns).toEqual(['inlineDraft', 'serverCatalog']);
    expect(report.overloadScore).toBeGreaterThan(4);
  });
});
