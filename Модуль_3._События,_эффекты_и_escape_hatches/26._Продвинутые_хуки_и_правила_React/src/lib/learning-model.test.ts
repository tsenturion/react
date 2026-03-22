import { describe, expect, it } from 'vitest';

import {
  buildDiagnosticsSummary,
  formatDiagnosticsDebugValue,
} from './debug-value-model';
import { compareHookOrders } from './hook-rules-model';
import { evaluateLintDiscipline } from './lint-discipline-model';
import { evaluatePurityState } from './purity-model';
import { initialRuleStoreSnapshot, summarizeRuleStore } from './rule-store';

describe('advanced hooks lesson models', () => {
  it('formats useDebugValue summary into compact label', () => {
    const summary = buildDiagnosticsSummary({
      stableOrder: true,
      pureRender: true,
      completeDeps: false,
      safeRefs: true,
      externalStore: false,
    });

    expect(summary.tone).toBe('error');
    expect(formatDiagnosticsDebugValue(summary)).toBe('3/5 safe • 2 blockers');
  });

  it('summarizes external store health', () => {
    const summary = summarizeRuleStore({
      ...initialRuleStoreSnapshot,
      syncSnapshot: true,
    });

    expect(summary.enabledCount).toBe(5);
    expect(summary.tone).toBe('success');
  });

  it('detects shifted hook slots when conditional hook appears', () => {
    const comparison = compareHookOrders(
      ['useState(filter)', 'useEffect(sync)'],
      ['useState(filter)', 'useDebugValue(audit)', 'useEffect(sync)'],
    );

    expect(comparison.changedSlots.length).toBeGreaterThan(0);
    expect(comparison.tone).toBe('error');
  });

  it('treats stable top-level order as safe', () => {
    const comparison = compareHookOrders(
      ['useState(filter)', 'useMemo(summary)', 'useEffect(sync)'],
      ['useState(filter)', 'useMemo(summary)', 'useEffect(sync)'],
    );

    expect(comparison.changedSlots).toHaveLength(0);
    expect(comparison.tone).toBe('success');
  });

  it('flags ref mutation during render as purity issue', () => {
    const summary = evaluatePurityState({
      readsRandomInRender: false,
      mutatesRefInRender: true,
      setsStateInRender: false,
      derivesInRender: true,
    });

    expect(summary.tone).toBe('warn');
    expect(summary.issues[0]).toContain('ref');
  });

  it('shows that recommended-latest catches more issues than recommended', () => {
    const recommended = evaluateLintDiscipline('recommended', 'lint-first', [
      'hook-in-condition',
      'impure-render',
      'ref-mutation-in-render',
    ]);
    const latest = evaluateLintDiscipline('recommended-latest', 'lint-first', [
      'hook-in-condition',
      'impure-render',
      'ref-mutation-in-render',
    ]);

    expect(recommended.blocked).toEqual(['hook-in-condition']);
    expect(latest.blocked).toEqual([
      'hook-in-condition',
      'impure-render',
      'ref-mutation-in-render',
    ]);
  });
});
