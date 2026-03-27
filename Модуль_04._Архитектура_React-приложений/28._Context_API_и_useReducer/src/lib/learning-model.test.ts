import { describe, expect, it } from 'vitest';

import {
  evaluateGlobalContainer,
  recommendArchitecture,
} from './architecture-strategy-model';
import { describeDelivery } from './delivery-model';
import { initialLessonViewState, lessonViewReducer } from './lesson-view-reducer';
import {
  createWorkspaceState,
  getVisibleItems,
  workspaceReducer,
} from './workspace-reducer-model';
import { reviewBoardSeed } from './context-domain';

describe('context + reducer lesson models', () => {
  it('describes prop drilling and context delivery differently', () => {
    expect(describeDelivery('props').visibleIntermediaries).toBe(3);
    expect(describeDelivery('context').visibleIntermediaries).toBe(0);
  });

  it('updates lesson shell state through reducer actions', () => {
    const next = lessonViewReducer(initialLessonViewState, {
      type: 'lab/select',
      labId: 'container',
    });

    expect(next.activeLabId).toBe('container');
  });

  it('applies reducer transitions to workspace state', () => {
    const initial = createWorkspaceState('Test scope', reviewBoardSeed);
    const focused = workspaceReducer(initial, {
      type: 'focus/set',
      id: reviewBoardSeed[1]!.id,
    });
    const drafted = workspaceReducer(focused, {
      type: 'draft/set',
      value: 'Новая заметка',
    });
    const applied = workspaceReducer(drafted, { type: 'draft/apply' });

    expect(applied.items.find((item) => item.id === reviewBoardSeed[1]!.id)?.note).toBe(
      'Новая заметка',
    );
  });

  it('filters visible items from workspace state', () => {
    const initial = createWorkspaceState('Test scope', reviewBoardSeed);
    const filtered = workspaceReducer(initial, {
      type: 'filter/set',
      filter: 'architecture',
    });

    expect(getVisibleItems(filtered).every((item) => item.track === 'architecture')).toBe(
      true,
    );
  });

  it('recommends appropriate architecture by scenario', () => {
    expect(
      recommendArchitecture({
        treeDepth: 2,
        distantConsumers: false,
        logicComplexity: 'simple',
        sharedScope: 'branch',
        updates: 'rare',
        providerEverywhere: false,
      }).primary,
    ).toBe('local state + props');

    expect(
      recommendArchitecture({
        treeDepth: 5,
        distantConsumers: true,
        logicComplexity: 'complex',
        sharedScope: 'section',
        updates: 'frequent',
        providerEverywhere: false,
      }).primary,
    ).toBe('context + reducer');
  });

  it('flags overloaded global containers', () => {
    const report = evaluateGlobalContainer(
      ['theme', 'draft', 'catalogData', 'tooltip'],
      ['theme'],
    );

    expect(report.tone).toBe('error');
    expect(report.irrelevantFeatures).toContain('draft');
  });
});
