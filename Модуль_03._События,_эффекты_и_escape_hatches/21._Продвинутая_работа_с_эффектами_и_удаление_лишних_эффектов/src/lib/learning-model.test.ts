import { describe, expect, it } from 'vitest';

import {
  buildWorkshopSummary,
  filterPlaybook,
  filterWorkshopModules,
  getPlaybookLatency,
} from './advanced-effect-domain';
import { buildAsyncEffectReport } from './async-effect-model';
import { getPublishCount } from './event-effect-model';
import { getNotificationTheme, getReconnectCount } from './effect-event-model';
import { hasDrift } from './remove-effect-model';
import { getExpectedRaceWinner } from './race-condition-model';
import { getExpectedCounter, getExpectedSetupCount } from './stale-closure-model';

describe('advanced effects lesson models', () => {
  it('describes correct async effect shape', () => {
    expect(buildAsyncEffectReport('correct').snippet).toContain('AbortController');
  });

  it('keeps latest query only when race is handled', () => {
    expect(getExpectedRaceWinner('bad', 'effect', 'async')).toBe('async');
    expect(getExpectedRaceWinner('abort', 'effect', 'async')).toBe('effect');
  });

  it('explains stale closures and setup churn', () => {
    expect(getExpectedCounter('stale', 5)).toBe(1);
    expect(getExpectedCounter('functional', 5)).toBe(5);
    expect(getExpectedSetupCount('deps', 5)).toBe(6);
  });

  it('keeps event handlers single-shot', () => {
    expect(getPublishCount('effect-driven', 2)).toBe(3);
    expect(getPublishCount('event-driven', 2)).toBe(1);
  });

  it('models useEffectEvent without reconnect storm', () => {
    expect(getReconnectCount('theme-dependency', 2)).toBe(3);
    expect(getNotificationTheme('stale-theme', 'light', 'contrast')).toBe('light');
    expect(getNotificationTheme('effect-event', 'light', 'contrast')).toBe('contrast');
  });

  it('filters derived data and detects drift', () => {
    const filtered = filterWorkshopModules('effect', 'all');
    expect(buildWorkshopSummary(filtered)).toContain('Найдено');
    expect(hasDrift(['a1'], ['a1'])).toBe(false);
    expect(hasDrift(['a1'], ['a2'])).toBe(true);
  });

  it('filters playbook and keeps deterministic latency', () => {
    const filtered = filterPlaybook(
      [
        {
          id: '1',
          title: 'Abort stale requests',
          track: 'race',
          summary: 'Stop stale work.',
          tags: ['abort', 'cleanup'],
        },
      ],
      'abort',
    );

    expect(filtered).toHaveLength(1);
    expect(getPlaybookLatency('async')).toBeGreaterThan(getPlaybookLatency('abort'));
  });
});
