import { describe, expect, it } from 'vitest';

import { compareFrameworkSuitability } from './framework-comparison-model';
import { compareFrameworkFlows } from './framework-flow-model';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
} from './framework-overview-domain';
import { chooseFrameworkStrategy } from './framework-playbook-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { planRenderingStrategy } from './rendering-family-model';
import { planRouteStructure } from './route-structure-model';

describe('lesson route model', () => {
  it('keeps all lesson 56 labs in route map', () => {
    expect(lessonLabs.map((item) => item.id)).toEqual([
      'overview',
      'frameworks',
      'routes',
      'data',
      'rendering',
      'playbook',
    ]);
  });

  it('maps pathname to matching lab id', () => {
    expect(describeLabFromPath('/framework-choice')).toBe('frameworks');
    expect(describeLabFromPath('/route-modules-and-structure')).toBe('routes');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('overview model', () => {
  it('parses URL focus safely', () => {
    expect(parseOverviewFocus('rendering')).toBe('rendering');
    expect(parseOverviewFocus('x')).toBe('all');
  });

  it('filters cards by focus', () => {
    expect(filterOverviewCardsByFocus('routes')).toHaveLength(1);
    expect(filterOverviewCardsByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('framework comparison model', () => {
  it('puts Next or React Router ahead of DIY for full-stack requirements', () => {
    const reports = compareFrameworkSuitability({
      needsSsr: true,
      needsServerMutations: true,
      wantsFileRoutes: true,
      wantsStrongConventions: false,
      teamSize: 7,
      caresAboutPprDirection: true,
      prefersIncrementalAdoption: false,
    });

    expect(reports[0].id).not.toBe('vite-diy');
    expect(reports[2].id).toBe('vite-diy');
  });
});

describe('route structure model', () => {
  it('builds actions file for Next mutation route', () => {
    const report = planRouteStructure({
      framework: 'next-app-router',
      scenario: 'marketing-plus-app',
      hasProtectedArea: true,
      hasMutations: true,
      usesStreaming: true,
      coLocateData: true,
    });

    expect(report.tree).toContain('  dashboard/actions.ts');
    expect(report.serverOwnedFiles).toBeGreaterThan(2);
  });
});

describe('framework flow model', () => {
  it('keeps manual glue lowest for Next and highest for DIY', () => {
    expect(
      compareFrameworkFlows({
        framework: 'next-app-router',
        screenKind: 'mixed',
        needsAuth: true,
        seoCritical: true,
      }).manualGlue,
    ).toBeLessThan(
      compareFrameworkFlows({
        framework: 'vite-diy',
        screenKind: 'mixed',
        needsAuth: true,
        seoCritical: true,
      }).manualGlue,
    );
  });
});

describe('rendering family model', () => {
  it('marks static long-tail page as PPR eligible', () => {
    expect(
      planRenderingStrategy({
        framework: 'next-app-router',
        seoCritical: true,
        personalizedShell: false,
        longTailStatic: true,
        dataLatency: 'high',
        interactionDepth: 'medium',
      }).pprEligible,
    ).toBe(true);
  });
});

describe('framework playbook model', () => {
  it('recommends Next for integrated full-stack and stable PPR story', () => {
    expect(
      chooseFrameworkStrategy({
        needsIntegratedFullStack: true,
        wantsFileConventions: true,
        needsNestedDataRouters: true,
        teamValuesFlexibility: false,
        needsStablePprStory: true,
        appMostlyInteractiveInternal: false,
      }).primaryStrategy,
    ).toBe('next-primary');
  });

  it('recommends staying on SPA for mostly internal interactive app without full-stack needs', () => {
    expect(
      chooseFrameworkStrategy({
        needsIntegratedFullStack: false,
        wantsFileConventions: false,
        needsNestedDataRouters: false,
        teamValuesFlexibility: true,
        needsStablePprStory: false,
        appMostlyInteractiveInternal: true,
      }).primaryStrategy,
    ).toBe('stay-spa-for-now');
  });
});
