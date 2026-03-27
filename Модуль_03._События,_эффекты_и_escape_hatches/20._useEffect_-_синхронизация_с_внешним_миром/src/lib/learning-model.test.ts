import { describe, expect, it } from 'vitest';

import { buildLifecycleReport } from './effect-lifecycle-model';
import { buildEffectNeedReport, derivePreviewLabel } from './effect-need-model';
import {
  buildPitfallReport,
  getExpectedEffectRuns,
  simulateLoopTrace,
} from './effect-pitfall-model';
import {
  buildRequestReport,
  filterGlossary,
  getRequestLatency,
} from './effect-request-model';
import { effectRooms } from './effect-domain';
import { buildSubscriptionReport } from './effect-subscription-model';
import { buildTimerReport } from './effect-timer-model';

describe('useEffect lesson models', () => {
  it('marks derived values as non-effects', () => {
    const report = buildEffectNeedReport('derived-value');

    expect(report.needsEffect).toBe(false);
    expect(derivePreviewLabel('Ada', 'Lovelace', 'Effects')).toContain('Ada Lovelace');
  });

  it('describes missing dependencies as risky', () => {
    expect(buildLifecycleReport('missing-room').tone).toBe('warn');
  });

  it('describes timer leak mode', () => {
    expect(buildTimerReport('leak').tone).toBe('error');
    expect(buildSubscriptionReport('cleanup').tone).toBe('success');
  });

  it('filters glossary data and exposes stable request latency', () => {
    const filtered = filterGlossary(
      [
        {
          id: '1',
          title: 'Cleanup in useEffect',
          kind: 'cleanup',
          summary: 'Remove subscriptions and timers.',
        },
      ],
      'clean',
    );

    expect(filtered).toHaveLength(1);
    expect(getRequestLatency('use')).toBeGreaterThan(getRequestLatency('useeffect'));
  });

  it('describes cleanup for requests', () => {
    expect(buildRequestReport('cancel-stale').snippet).toContain('AbortController');
  });

  it('simulates unstable deps and loop risk', () => {
    expect(getExpectedEffectRuns(5, 'stable')).toBe(1);
    expect(getExpectedEffectRuns(5, 'unstable')).toBe(5);
    expect(simulateLoopTrace(3)).toHaveLength(3);
    expect(buildPitfallReport('loop-risk').tone).toBe('error');
    expect(effectRooms).toHaveLength(3);
  });
});
