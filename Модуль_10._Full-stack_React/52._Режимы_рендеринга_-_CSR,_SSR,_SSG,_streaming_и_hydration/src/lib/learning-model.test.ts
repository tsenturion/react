import { describe, expect, it } from 'vitest';

import {
  buildArchitectureMatrix,
  getArchitectureScenario,
} from './architecture-consequences-model';
import { buildHydrationSnapshot } from './hydration-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { chooseRecommendedMode, compareRenderingModes } from './render-mode-model';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
} from './rendering-overview-domain';
import { chooseRenderingStrategy } from './rendering-playbook-model';
import { simulateStreamingHydration } from './streaming-model';

describe('lesson route model', () => {
  it('keeps all lesson 52 labs in route map', () => {
    expect(lessonLabs.map((item) => item.id)).toEqual([
      'overview',
      'modes',
      'hydration',
      'streaming',
      'architecture',
      'playbook',
    ]);
  });

  it('maps pathname to matching lab id', () => {
    expect(describeLabFromPath('/mode-comparison')).toBe('modes');
    expect(describeLabFromPath('/streaming-and-selective-hydration')).toBe('streaming');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('overview model', () => {
  it('parses URL focus safely', () => {
    expect(parseOverviewFocus('streaming')).toBe('streaming');
    expect(parseOverviewFocus('x')).toBe('all');
  });

  it('filters overview cards by selected focus', () => {
    expect(filterOverviewCardsByFocus('hydration')).toHaveLength(1);
    expect(filterOverviewCardsByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('render mode comparison', () => {
  it('builds reports for all rendering modes', () => {
    const reports = compareRenderingModes({
      pageIntent: 'marketing',
      networkMs: 120,
      serverMs: 180,
      dataMs: 140,
      jsBootMs: 260,
      hydrationMs: 90,
    });

    expect(reports).toHaveLength(4);
    expect(chooseRecommendedMode(reports).mode).toBe('ssg');
  });
});

describe('hydration mismatch model', () => {
  it('detects mismatch for unstable initial render', () => {
    const snapshot = buildHydrationSnapshot({
      serverLocale: 'ru-RU',
      clientLocale: 'en-US',
      timeDependentText: true,
      randomDependentText: false,
      localeDependentText: true,
      browserOnlyBranch: true,
      orderCount: 12500,
    });

    expect(snapshot.mismatch).toBe(true);
    expect(snapshot.issues.map((item) => item.id)).toContain('time');
    expect(snapshot.issues.map((item) => item.id)).toContain('browser');
  });
});

describe('streaming model', () => {
  it('moves selected segment earlier during selective hydration', () => {
    const simulation = simulateStreamingHydration({
      profileId: 'product',
      networkMs: 90,
      jsBootMs: 220,
      selectedSegment: 'filters',
    });

    expect(simulation.selectiveOrder[0]).toBe('filters');
    expect(simulation.selectedBenefitMs).toBeGreaterThan(0);
  });
});

describe('architecture model', () => {
  it('describes scenario and matrix', () => {
    expect(getArchitectureScenario('commerce-listing').recommendedMode).toBe('streaming');
    expect(buildArchitectureMatrix('analytics-workspace').length).toBeGreaterThan(1);
  });
});

describe('rendering playbook', () => {
  it('recommends streaming for fast shell plus dynamic server content', () => {
    expect(
      chooseRenderingStrategy({
        seoCritical: true,
        pageMostlyStatic: false,
        contentChangesPerRequest: true,
        personalizedAboveFold: true,
        fastShellMatters: true,
        heavyInteractiveWidgets: false,
        serverCanStream: true,
      }).primaryMode,
    ).toBe('streaming');
  });

  it('recommends csr for client-heavy workspace without SEO pressure', () => {
    expect(
      chooseRenderingStrategy({
        seoCritical: false,
        pageMostlyStatic: false,
        contentChangesPerRequest: false,
        personalizedAboveFold: false,
        fastShellMatters: false,
        heavyInteractiveWidgets: true,
        serverCanStream: false,
      }).primaryMode,
    ).toBe('csr');
  });
});
