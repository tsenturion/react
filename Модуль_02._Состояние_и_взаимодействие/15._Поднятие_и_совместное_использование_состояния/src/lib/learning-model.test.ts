import { describe, expect, it } from 'vitest';

import { buildDashboardSummary } from './shared-dashboard-model';
import {
  buildLiftingReport,
  calculateNetPrice,
  updateNetPrice,
} from './lifting-state-model';
import { buildOwnerDecision } from './owner-model';
import { buildPropDrillingReport } from './prop-drilling-model';
import {
  createCatalogItems,
  createDiscountState,
  createOwnerScenario,
  createSelectionItems,
} from './shared-state-domain';
import { buildSiblingSyncReport } from './sibling-sync-model';
import { buildBookingViewModel } from './upward-flow-model';

describe('lifting and shared state lesson models', () => {
  it('keeps percent and net price linked through shared state', () => {
    const state = updateNetPrice(createDiscountState(), 1800);

    expect(calculateNetPrice(state)).toBe(1800);
    expect(buildLiftingReport(state).tone).toBe('success');
  });

  it('builds shared dashboard summary from one filter state', () => {
    const summary = buildDashboardSummary(createCatalogItems(), {
      query: 'state',
      track: 'all',
    });

    expect(summary.visibleCount).toBe(1);
    expect(summary.totalDuration).toBe(25);
  });

  it('detects drift when siblings keep separate local selections', () => {
    const report = buildSiblingSyncReport(
      createSelectionItems(),
      'alpha',
      'beta',
      'alpha',
    );

    expect(report.badLabel).toBe('drift');
    expect(report.goodLabel).toContain('alpha');
  });

  it('builds booking summary from parent-owned state', () => {
    const view = buildBookingViewModel({
      seats: 3,
      tier: 'team',
      acceptedRules: true,
    });

    expect(view.totalPrice).toBe(270);
    expect(view.actionLabel).toContain('Можно');
  });

  it('counts forwarded props across drilling chain', () => {
    const report = buildPropDrillingReport(3, ['selectedTrack', 'onTrackChange']);

    expect(report.forwardedProps).toBe(6);
  });

  it('chooses shared parent when siblings need the same state', () => {
    const scenario = createOwnerScenario();
    scenario.usedBySiblings = true;
    scenario.usedByOneLeaf = false;

    expect(buildOwnerDecision(scenario).target).toBe('shared-parent');
  });
});
