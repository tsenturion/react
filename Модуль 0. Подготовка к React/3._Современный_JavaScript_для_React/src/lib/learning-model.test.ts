import { describe, expect, it } from 'vitest';

import { filterRemoteLessons } from './async-model';
import { buildCollectionView } from './collection-model';
import { createClosureActionPack, evaluateClosureScenario } from './closure-model';
import {
  buildStrategyPreview,
  createLearningBoard,
  mutateLessonInPlace,
  toggleLessonImmutably,
} from './immutability-model';
import { buildModulePlayground } from './module-model';
import { buildSyntaxPlayground } from './syntax-model';

describe('modern javascript learning models', () => {
  it('keeps empty string with nullish coalescing but not with logical or', () => {
    const view = buildSyntaxPlayground({
      bindingMode: 'const',
      captionState: 'empty',
      includeMentor: false,
      city: '',
      extraTopics: ['closures'],
    });

    expect(view.captionWithOr).toBe('react-ready');
    expect(view.captionWithNullish).toBe('');
    expect(view.safeMentor).toBe('не назначен');
  });

  it('combines named and default exports inside module playground', () => {
    const view = buildModulePlayground({
      goal: 'async',
      readyOnly: true,
      limit: 5,
    });

    expect(view.visibleLessons.length).toBe(5);
    expect(view.recommendedLesson?.id).toBe('async-fetch');
    expect(view.moduleKinds).toContain('async');
  });

  it('derives visible cards and metrics from one lesson array', () => {
    const view = buildCollectionView({
      level: 'all',
      query: 'map',
      readyOnly: false,
      tag: 'all',
    });

    expect(view.visibleLessons.length).toBeGreaterThan(0);
    expect(view.metrics.totalVisible).toBe(view.visibleLessons.length);
    expect(view.metrics.totalDuration).toBeGreaterThan(0);
  });

  it('creates stable closure actions with captured bonus', () => {
    const actions = createClosureActionPack(4);

    expect(actions[0]?.capturedBonus).toBe(4);
    expect(actions[1]?.run()).toContain('мин');

    const comparison = evaluateClosureScenario({
      initialBonus: 4,
      currentBonus: 12,
      baseDuration: 20,
    });

    expect(comparison.snapshotDuration).toBe(24);
    expect(comparison.mutableDuration).toBe(32);
  });

  it('filters remote lessons after fetch without mutating payload', () => {
    const visible = filterRemoteLessons(
      {
        generatedAt: '2026-03-17T10:00:00.000Z',
        lessons: [
          {
            id: 'modules',
            title: 'Import/export',
            level: 'base',
            kind: 'modules',
            ready: true,
            duration: 14,
            tags: ['modules'],
            summary: 'ES modules',
          },
          {
            id: 'fetch',
            title: 'Fetch data',
            level: 'async',
            kind: 'async',
            ready: false,
            duration: 20,
            tags: ['async', 'fetch'],
            summary: 'Network state',
          },
        ],
      },
      { query: 'fetch', onlyReady: false },
    );

    expect(visible).toHaveLength(1);
    expect(visible[0]?.id).toBe('fetch');
  });

  it('shows different reference behavior for mutation and immutable update', () => {
    const board = createLearningBoard();
    const mutated = mutateLessonInPlace(board, 'spread');

    expect(mutated).toBe(board);

    const cleanBoard = createLearningBoard();
    const immutable = toggleLessonImmutably(cleanBoard, 'spread');
    const preview = buildStrategyPreview(cleanBoard, 'spread');

    expect(immutable).not.toBe(cleanBoard);
    expect(immutable.lessons).not.toBe(cleanBoard.lessons);
    expect(preview.mutable.sameRoot).toBe(true);
    expect(preview.immutable.sameRoot).toBe(false);
  });
});
