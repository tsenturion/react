import { describe, expect, it } from 'vitest';

import { describeLabFromPath, filterGuidesByFocus } from './testing-domain';
import { lessonLabs } from './learning-model';
import {
  assessReleasePlan,
  parseFocus,
  recommendE2EScope,
  recommendTestingArchitecture,
  recommendUnitStrategy,
} from './testing-runtime';

describe('lesson model', () => {
  it('keeps unit lab pointing to a concrete route', () => {
    const unitLab = lessonLabs.find((item) => item.id === 'unit');

    expect(unitLab?.href).toBe('/unit-strategy');
  });
});

describe('testing domain', () => {
  it('resolves lab id from pathname', () => {
    expect(describeLabFromPath('/component-behavior')).toBe('component');
    expect(describeLabFromPath('/testing-architecture')).toBe('architecture');
    expect(describeLabFromPath('/unknown')).toBeNull();
  });

  it('filters guides by focus', () => {
    expect(
      filterGuidesByFocus('component').every((item) => item.focus === 'component'),
    ).toBe(true);
    expect(filterGuidesByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('testing runtime', () => {
  it('normalizes invalid focus values', () => {
    expect(parseFocus('broken')).toBe('all');
    expect(parseFocus('e2e')).toBe('e2e');
  });

  it('recommends unit-first for pure deterministic logic', () => {
    expect(
      recommendUnitStrategy({
        pureLogic: true,
        branching: true,
        deterministic: true,
        uiFree: true,
        expensiveSetup: false,
        crossBrowser: false,
      }).model,
    ).toBe('Unit-first');
  });

  it('assesses release plan and finds missing checks', () => {
    const plan = assessReleasePlan({
      scope: 'critical',
      selectedChecks: ['unit', 'component'],
      hasUserVisibleRisk: true,
      usesNetwork: true,
    });

    expect(plan.verdict).toBe('incomplete');
    expect(plan.missingChecks).toEqual(['integration', 'e2e']);
  });

  it('recommends targeted e2e for route and network sensitive path', () => {
    expect(
      recommendE2EScope({
        touchesRouter: true,
        touchesNetwork: true,
        touchesBrowserApi: false,
        criticality: 'high',
      }).model,
    ).toBe('Targeted E2E');
  });

  it('recommends layered architecture for critical browser-dependent app', () => {
    expect(
      recommendTestingArchitecture({
        criticalFlows: true,
        denseUiStates: false,
        sharedState: false,
        browserDependent: true,
        teamGrowing: true,
        flakeBudgetLow: true,
      }).model,
    ).toBe('Layered strategy with targeted E2E');
  });
});
