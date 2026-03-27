import { describe, expect, it } from 'vitest';

import {
  compareVisibilityStrategies,
  describeActivityMode,
} from './activity-visibility-model';
import { buildPulseMessage, describeResubscribeRisk } from './effect-event-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { choosePriorityStrategy, type PriorityScenario } from './priority-playbook-model';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
} from './priority-overview-domain';
import { filterWorkbenchItems, summarizeDeferredState } from './priority-workbench-model';

describe('lesson route model', () => {
  it('keeps all lesson 51 labs in route map', () => {
    expect(lessonLabs.map((item) => item.id)).toEqual([
      'overview',
      'transitions',
      'deferred-value',
      'effect-event',
      'activity',
      'playbook',
    ]);
  });

  it('maps pathname to matching lab id', () => {
    expect(describeLabFromPath('/transitions')).toBe('transitions');
    expect(describeLabFromPath('/activity-visibility')).toBe('activity');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('overview model', () => {
  it('parses URL focus safely', () => {
    expect(parseOverviewFocus('deferred')).toBe('deferred');
    expect(parseOverviewFocus('x')).toBe('all');
  });

  it('filters cards by focus', () => {
    expect(filterOverviewCardsByFocus('activity')).toHaveLength(1);
    expect(filterOverviewCardsByFocus('all').length).toBeGreaterThan(3);
  });
});

describe('priority workbench model', () => {
  it('filters workbench items by query and domain', () => {
    const result = filterWorkbenchItems('stream', 'compiler');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.domain === 'compiler')).toBe(true);
  });

  it('summarizes deferred freshness', () => {
    expect(summarizeDeferredState('', '')).toBe('idle');
    expect(summarizeDeferredState('react', 'rea')).toBe('lagging');
    expect(summarizeDeferredState('react', 'react')).toBe('fresh');
  });
});

describe('effect event model', () => {
  it('builds pulse label and risk description', () => {
    expect(buildPulseMessage({ roomId: 'release', sequence: 2 }, 'night')).toContain(
      'release #2',
    );
    expect(describeResubscribeRisk(true)).toContain('без пересоздания подписки');
  });
});

describe('activity model', () => {
  it('describes activity visibility mode', () => {
    expect(describeActivityMode('hidden')).toContain('скрыто');
    expect(compareVisibilityStrategies('visible').activity).toContain('Activity');
  });
});

describe('priority playbook', () => {
  it('recommends useTransition for urgent input plus background pending', () => {
    const scenario: PriorityScenario = {
      urgentInput: true,
      needsPendingIndicator: true,
      backgroundViewMayLag: true,
      bulkNonUrgentEvent: false,
      externalEffectNeedsLatestValue: false,
      hiddenSubtreeKeepsState: false,
    };

    expect(choosePriorityStrategy(scenario).primaryTool).toBe('use-transition');
  });

  it('recommends Activity for preserved hidden subtree', () => {
    const scenario: PriorityScenario = {
      urgentInput: false,
      needsPendingIndicator: false,
      backgroundViewMayLag: false,
      bulkNonUrgentEvent: false,
      externalEffectNeedsLatestValue: false,
      hiddenSubtreeKeepsState: true,
    };

    expect(choosePriorityStrategy(scenario).primaryTool).toBe('activity');
  });

  it('recommends composed tools for combined boundary problem', () => {
    const scenario: PriorityScenario = {
      urgentInput: true,
      needsPendingIndicator: true,
      backgroundViewMayLag: true,
      bulkNonUrgentEvent: false,
      externalEffectNeedsLatestValue: true,
      hiddenSubtreeKeepsState: false,
    };

    expect(choosePriorityStrategy(scenario).primaryTool).toBe('compose-tools');
  });
});
