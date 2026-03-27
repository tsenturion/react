import { describe, expect, it } from 'vitest';

import { describeComponentSplitScenario } from './component-split-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { parseOverviewFocus } from './lazy-loading-domain';
import { describeProgressiveLoading } from './progressive-loading-model';
import { describeRouteSplitScenario } from './route-split-model';
import { evaluateSplitStrategy } from './split-strategy-model';
import { describeBoundaryScenario } from './suspense-boundary-model';

describe('lesson model', () => {
  it('keeps route splitting lab pointing to a concrete route', () => {
    const target = lessonLabs.find((item) => item.id === 'route-splitting');

    expect(target?.href).toBe('/route-code-splitting');
  });

  it('resolves lab id from pathname', () => {
    expect(describeLabFromPath('/progressive-loading')).toBe('progressive-loading');
    expect(describeLabFromPath('/split-strategy')).toBe('split-strategy');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('lazy loading models', () => {
  it('normalizes invalid overview focus values', () => {
    expect(parseOverviewFocus('broken')).toBe('all');
    expect(parseOverviewFocus('routes')).toBe('routes');
  });

  it('shows lazy component split paying on intent', () => {
    expect(
      describeComponentSplitScenario({
        mode: 'lazy',
        panel: 'audit-console',
        isOpen: true,
      }).bundleImpact,
    ).toBe('pay on intent');
  });

  it('describes route-level lazy pages as preserving shell', () => {
    expect(
      describeRouteSplitScenario({
        strategy: 'lazy-pages',
        target: 'analytics',
      }).shellPersistence,
    ).toContain('shell');
  });

  it('marks global suspense boundary as hiding shell', () => {
    expect(describeBoundaryScenario({ mode: 'global' }).shellVisible).toBe(false);
  });

  it('marks shell-first loading as high context retention', () => {
    expect(describeProgressiveLoading({ pattern: 'shell-first' }).contextRetention).toBe(
      'высокое',
    );
  });

  it('recommends split for heavy rare analytics with local fallback', () => {
    expect(
      evaluateSplitStrategy({
        target: 'analytics',
        payloadWeight: 'heavy',
        visitFrequency: 'rare',
        fallbackScope: 'local',
        needsInstantPaint: false,
        hasStablePlaceholder: true,
      }).verdict,
    ).toBe('Split выглядит оправданным');
  });

  it('rejects split for tiny always-visible control under global fallback', () => {
    expect(
      evaluateSplitStrategy({
        target: 'tiny-control',
        payloadWeight: 'light',
        visitFrequency: 'always',
        fallbackScope: 'global',
        needsInstantPaint: true,
        hasStablePlaceholder: false,
      }).verdict,
    ).toBe('Скорее сначала оставьте код рядом');
  });
});
