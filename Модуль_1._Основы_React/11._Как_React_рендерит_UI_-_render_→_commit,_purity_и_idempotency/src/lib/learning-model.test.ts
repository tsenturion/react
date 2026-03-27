import { describe, expect, it } from 'vitest';

import { buildIdempotencyReport } from './idempotency-model';
import { buildPurityReport } from './purity-model';
import { buildReconciliationReport } from './reconciliation-model';
import { buildRenderCommitReport } from './render-commit-model';
import { buildRenderCostReport } from './render-cost-model';
import { buildRenderTriggerReport } from './rerender-trigger-model';

describe('lesson 11 learning models', () => {
  it('builds render/commit signature from current controls', () => {
    const report = buildRenderCommitReport({
      screen: 'catalog',
      density: 'comfortable',
      showSidebar: true,
      revision: 3,
    });

    expect(report.signature).toBe('catalog:comfortable:sidebar:3');
    expect(report.visibleNodeCount).toBeGreaterThan(0);
  });

  it('counts affected and changed nodes for rerender triggers', () => {
    const report = buildRenderTriggerReport('parent-state');

    expect(report.affectedCount).toBeGreaterThanOrEqual(report.changedOutputCount);
    expect(report.tree.label).toBe('AppShell');
  });

  it('marks purity violations as risky when registry keeps growing', () => {
    const report = buildPurityReport(3, 1);

    expect(report.tone).toBe('error');
    expect(report.summary).toMatch(/Impure/i);
  });

  it('keeps idempotent output derived only from topic', () => {
    const report = buildIdempotencyReport('react');

    expect(report.stableOutput).toContain('REACT');
    expect(report.impureOutput).toContain('random()');
  });

  it('reports changed reconciliation branches', () => {
    const report = buildReconciliationReport(
      {
        screen: 'catalog',
        showFilters: true,
        showSidebar: true,
        compact: false,
      },
      {
        screen: 'lesson',
        showFilters: false,
        showSidebar: true,
        compact: true,
      },
    );

    expect(report.changedBranches).toContain('main-screen');
    expect(report.changedBranches).toContain('filters');
    expect(report.changedBranches).toContain('density');
  });

  it('multiplies render cost by extra passes', () => {
    const report = buildRenderCostReport({
      items: 10,
      workPerItem: 4,
      extraPasses: 2,
      sideEffectsInRender: true,
    });

    expect(report.estimatedOperations).toBe(120);
    expect(report.duplicatedSideEffects).toBe(3);
  });
});
