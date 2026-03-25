import { describe, expect, it } from 'vitest';

import { evaluateConcurrencyStrategy } from './concurrency-playbook-model';
import { filterGuideCardsByFocus, parseOverviewFocus } from './concurrent-domain';
import { describeDeferredValueScenario } from './deferred-value-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { projectSearchResults } from './search-workload-model';
import { describeStartTransitionScenario } from './start-transition-model';
import { describeTransitionPriority } from './transition-priority-model';

describe('lesson model', () => {
  it('keeps transition lab pointing to a concrete route', () => {
    const target = lessonLabs.find((item) => item.id === 'transition-priority');

    expect(target?.href).toBe('/use-transition-priority');
  });

  it('resolves lesson lab id from pathname', () => {
    expect(describeLabFromPath('/deferred-value-search')).toBe('deferred-value');
    expect(describeLabFromPath('/concurrency-playbook')).toBe('concurrency-playbook');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('concurrent models', () => {
  it('normalizes invalid overview focus values', () => {
    expect(parseOverviewFocus('broken')).toBe('all');
    expect(filterGuideCardsByFocus('transitions').length).toBeGreaterThan(0);
  });

  it('shows transition mode separating urgent and background work', () => {
    expect(
      describeTransitionPriority({
        mode: 'transition',
        action: 'typing',
        isPending: false,
      }).backgroundChannel,
    ).toContain('non-urgent');
  });

  it('describes imported startTransition as background screen switch', () => {
    expect(
      describeStartTransitionScenario({
        mode: 'start-transition',
        target: 'insights',
      }).headline,
    ).toContain('background');
  });

  it('marks deferred value as lagging when consumer trails input', () => {
    expect(
      describeDeferredValueScenario({
        query: 'router',
        deferredQuery: 'rou',
      }).isLagging,
    ).toBe(true);
  });

  it('projects search results with visible items and operations', () => {
    const projection = projectSearchResults({
      query: 'search',
      track: 'all',
      sort: 'relevance',
      intensity: 2,
    });

    expect(projection.visibleItems.length).toBeGreaterThan(0);
    expect(projection.operations).toBeGreaterThan(0);
  });

  it('recommends measure-first path for structural bottlenecks', () => {
    expect(
      evaluateConcurrencyStrategy({
        lagSeverity: 'high',
        updatePattern: 'filter-list',
        resultCanLag: true,
        needsPendingIndicator: true,
        startedOutsideComponent: false,
        structuralProblemLikely: true,
      }).recommendedTool,
    ).toBe('measure-first');
  });

  it('recommends deferred or transition tools for lagging list filters', () => {
    expect(
      evaluateConcurrencyStrategy({
        lagSeverity: 'noticeable',
        updatePattern: 'filter-list',
        resultCanLag: true,
        needsPendingIndicator: false,
        startedOutsideComponent: false,
        structuralProblemLikely: false,
      }).recommendedTool,
    ).toBe('useDeferredValue');
  });
});
