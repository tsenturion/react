import { describe, expect, it } from 'vitest';

import {
  buildComparisonReport,
  getComparisonScenario,
} from './compiler-comparison-model';
import { getLimitationCase } from './compiler-limitations-model';
import { filterOverviewCardsByFocus } from './compiler-overview-domain';
import { buildCompilerPlaybook } from './compiler-playbook-model';
import { buildProfilingReport } from './compiler-profiler-model';
import { buildRolloutPlan } from './compiler-rollout-model';

describe('compiler lesson models', () => {
  it('filters overview cards by requested focus', () => {
    const cards = filterOverviewCardsByFocus('profiling');

    expect(cards).toHaveLength(1);
    expect(cards[0]?.focus).toBe('profiling');
  });

  it('marks compiler-friendly strategy as recommended in comparison report', () => {
    const report = buildComparisonReport({
      scenarioId: 'dashboard-filter',
      dataSize: 'medium',
      parentChurn: 'medium',
    });

    expect(report.find((item) => item.id === 'compiler-ready')?.recommendation).toBe(
      'recommended',
    );
    expect(getComparisonScenario('dashboard-filter').manualMemoStillUseful.length).toBe(
      2,
    );
  });

  it('builds stricter rollout tone for high library risk', () => {
    const plan = buildRolloutPlan({
      buildTool: 'vite',
      compilationMode: 'annotation',
      teamReadiness: 'exploring',
      libraryRisk: 'high',
      perfPain: 'medium',
    });

    expect(plan.rolloutTone).toBe('error');
    expect(plan.compilerConfigSnippet).toContain("compilationMode: 'annotation'");
  });

  it('keeps architecture gap outside compiler help', () => {
    const current = getLimitationCase('architecture-gap');

    expect(current.helpLevel).toBe('none');
    expect(current.compilerOutcome).toContain('не исправит');
  });

  it('shows profiling improvement when compiler is enabled', () => {
    const off = buildProfilingReport({
      scenarioId: 'filter-workbench',
      dataSize: 'medium',
      compilerEnabled: false,
      manualMemoKept: false,
    });
    const on = buildProfilingReport({
      scenarioId: 'filter-workbench',
      dataSize: 'medium',
      compilerEnabled: true,
      manualMemoKept: false,
    });

    expect(on.afterCommitMs).toBeLessThan(off.afterCommitMs);
    expect(on.afterRerenders).toBeLessThan(off.afterRerenders);
  });

  it('returns warning playbook for low confidence rollout', () => {
    const result = buildCompilerPlaybook({
      appShape: 'dashboard',
      perfPain: 'recurring',
      compilerConfidence: 'low',
      adoptionRisk: 'medium',
    });

    expect(result.tone).toBe('warn');
    expect(result.title).toContain('постепенный rollout');
  });
});
