import { describe, expect, it } from 'vitest';

import { buildInjectedThemeCss } from './insertion-effect-model';
import { buildLayoutHookSequence, computePopoverPlacement } from './layout-timing-model';
import { getScenarioRecommendation } from './overengineering-model';
import { computeIndicatorBox } from './positioning-model';
import { describeWidgetSyncMode } from './widget-integration-model';

describe('advanced DOM hooks learning model', () => {
  it('places popover inside stage bounds', () => {
    const placement = computePopoverPlacement(
      { top: 120, left: 240, width: 80, height: 40 },
      { top: 40, left: 100, width: 320, height: 260 },
      180,
      72,
    );

    expect(placement.top).toBeGreaterThanOrEqual(12);
    expect(placement.left).toBeLessThanOrEqual(128);
  });

  it('describes layout hook before paint', () => {
    expect(buildLayoutHookSequence('layout')).toEqual([
      'render',
      'commit DOM',
      'useLayoutEffect',
      'paint',
      'useEffect',
    ]);
  });

  it('builds scoped CSS for insertion effect lesson', () => {
    const css = buildInjectedThemeCss('scope-demo', 'ocean');

    expect(css).toContain('.scope-demo .theme-shell');
    expect(css).toContain('background');
  });

  it('computes relative underline geometry', () => {
    expect(
      computeIndicatorBox({ left: 210, width: 96 }, { left: 150, width: 400 }),
    ).toEqual({
      left: 60,
      width: 96,
    });
  });

  it('recommends render-time derivation for derived filter scenario', () => {
    expect(getScenarioRecommendation('derived-filter').recommended).toBe(
      'Вычислить в render',
    );
  });

  it('keeps layout sync for widget bridge explanation', () => {
    expect(describeWidgetSyncMode('layout').summary).toContain('геометрию');
  });
});
