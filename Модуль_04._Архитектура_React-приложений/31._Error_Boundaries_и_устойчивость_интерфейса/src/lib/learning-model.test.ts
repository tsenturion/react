import { describe, expect, it } from 'vitest';

import { describeResetGuidance, haveResetKeysChanged } from './boundary-reset-model';
import { getIsolationMetrics } from './boundary-scope-model';
import { recommendBoundaryPlacement } from './error-architecture-model';
import { evaluateFallbackProfile } from './fallback-model';

describe('boundary reset model', () => {
  it('detects reset key changes by length and Object.is semantics', () => {
    expect(haveResetKeysChanged(['a'], ['a'])).toBe(false);
    expect(haveResetKeysChanged(['a'], ['b'])).toBe(true);
    expect(haveResetKeysChanged(['a'], ['a', 'b'])).toBe(true);
  });

  it('explains why retry without fixing input is not enough', () => {
    expect(describeResetGuidance('manual', false)).toContain('ошибка повторится');
    expect(describeResetGuidance('reset-keys', true)).toContain('автоматически');
  });
});

describe('boundary scope model', () => {
  it('calculates blast radius for local and shared boundaries', () => {
    expect(getIsolationMetrics('local', 3, 1)).toMatchObject({
      lostWidgets: 1,
      healthyWidgets: 2,
    });
    expect(getIsolationMetrics('shared', 3, 1)).toMatchObject({
      lostWidgets: 3,
      healthyWidgets: 0,
    });
  });
});

describe('fallback model', () => {
  it('scores contextual fallback higher than vague fallback', () => {
    const poor = evaluateFallbackProfile({
      explainsImpact: false,
      preservesContext: false,
      offersRecovery: false,
      isolatesFailure: true,
      exposesRawError: false,
    });

    const good = evaluateFallbackProfile({
      explainsImpact: true,
      preservesContext: true,
      offersRecovery: true,
      isolatesFailure: true,
      exposesRawError: false,
    });

    expect(good).toBeGreaterThan(poor);
  });
});

describe('error architecture model', () => {
  it('recommends widget boundaries for risky third-party islands', () => {
    const recommendation = recommendBoundaryPlacement({
      risk: 'high',
      sharedState: 'section',
      criticality: 'high',
      thirdParty: true,
    });

    expect(recommendation.primaryLayer).toBe('widget');
    expect(recommendation.highlightedLayers).toContain('shell');
  });

  it('recommends route boundary for app-level shared state', () => {
    const recommendation = recommendBoundaryPlacement({
      risk: 'medium',
      sharedState: 'app',
      criticality: 'medium',
      thirdParty: false,
    });

    expect(recommendation.primaryLayer).toBe('route');
  });
});
