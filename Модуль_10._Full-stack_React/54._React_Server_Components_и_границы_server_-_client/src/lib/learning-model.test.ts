import { describe, expect, it } from 'vitest';

import { compareAsyncStrategies, getAsyncScenario } from './async-server-model';
import { analyzeBoundaryWorkspace, getBoundaryPreset } from './rsc-boundary-model';
import { describeCompositionChoice } from './rsc-composition-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { filterOverviewCardsByFocus, parseOverviewFocus } from './rsc-overview-domain';
import { chooseBoundaryStrategy } from './rsc-playbook-model';
import { compareArchitecturePresets, describeBundlePressure } from './rsc-tradeoff-model';

describe('lesson route model', () => {
  it('keeps all lesson 54 labs in route map', () => {
    expect(lessonLabs.map((item) => item.id)).toEqual([
      'overview',
      'execution',
      'async-server',
      'composition',
      'tradeoffs',
      'playbook',
    ]);
  });

  it('maps pathname to matching lab id', () => {
    expect(describeLabFromPath('/server-client-composition')).toBe('composition');
    expect(describeLabFromPath('/bundle-and-data-tradeoffs')).toBe('tradeoffs');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('overview model', () => {
  it('parses URL focus safely', () => {
    expect(parseOverviewFocus('bundle')).toBe('bundle');
    expect(parseOverviewFocus('x')).toBe('all');
  });

  it('filters cards by focus', () => {
    expect(filterOverviewCardsByFocus('composition')).toHaveLength(1);
    expect(filterOverviewCardsByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('boundary model', () => {
  it('analyzes balanced preset without invalid nodes', () => {
    const report = analyzeBoundaryWorkspace(getBoundaryPreset('balanced-islands'));

    expect(report.invalidCount).toBe(0);
    expect(report.clientBundleKb).toBe(44);
    expect(report.bridgeCount).toBe(1);
  });
});

describe('async server model', () => {
  it('builds async strategy comparison', () => {
    const reports = compareAsyncStrategies({
      scenarioId: 'catalog',
      networkMs: 90,
      jsBootMs: 180,
    });

    expect(reports).toHaveLength(3);
    expect(getAsyncScenario('account').label).toContain('Account');
    expect(reports[0].dataReadyMs).toBeLessThan(reports[2].dataReadyMs);
  });
});

describe('composition model', () => {
  it('marks client-importing-server as invalid and slot as valid', () => {
    expect(
      describeCompositionChoice({
        hostLayer: 'client',
        childLayer: 'server',
        linkMode: 'import',
      }).tone,
    ).toBe('error');

    expect(
      describeCompositionChoice({
        hostLayer: 'client',
        childLayer: 'server',
        linkMode: 'slot',
      }).tone,
    ).toBe('success');
  });
});

describe('tradeoff model', () => {
  it('compares presets and explains bundle pressure', () => {
    expect(compareArchitecturePresets()).toHaveLength(3);
    expect(describeBundlePressure(90)).toContain('тяжёлым');
  });
});

describe('playbook model', () => {
  it('recommends client island for live typing inside static parent', () => {
    expect(
      chooseBoundaryStrategy({
        needsLiveTyping: true,
        readsPrivateData: false,
        wantsMinimalBundle: true,
        requiresBrowserApi: false,
        parentMostlyStatic: true,
        sharesLargeLocalState: false,
      }).primaryPattern,
    ).toBe('client-island');
  });

  it('recommends server default for private data and minimum JS', () => {
    expect(
      chooseBoundaryStrategy({
        needsLiveTyping: false,
        readsPrivateData: true,
        wantsMinimalBundle: true,
        requiresBrowserApi: false,
        parentMostlyStatic: false,
        sharesLargeLocalState: false,
      }).primaryPattern,
    ).toBe('server-default');
  });
});
