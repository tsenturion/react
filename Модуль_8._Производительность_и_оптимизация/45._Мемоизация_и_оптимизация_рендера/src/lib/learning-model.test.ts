import { describe, expect, it } from 'vitest';

import { describeLabFromPath, lessonLabs } from './learning-model';
import { describeListOptimization } from './list-optimization-model';
import { evaluateMemoizationNeed } from './memo-cost-model';
import { describeMemoBoundary } from './memo-boundary-model';
import { parseOverviewFocus } from './memoization-domain';
import { describeCallbackScenario } from './use-callback-model';
import { describeUseMemoScenario } from './use-memo-model';

describe('lesson model', () => {
  it('keeps memo boundaries lab pointing to a concrete route', () => {
    const target = lessonLabs.find((item) => item.id === 'memo-boundaries');

    expect(target?.href).toBe('/memo-boundaries');
  });

  it('resolves lesson lab id from pathname', () => {
    expect(describeLabFromPath('/use-callback-handlers')).toBe('use-callback');
    expect(describeLabFromPath('/memo-costs-and-tradeoffs')).toBe('cost-tradeoffs');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('memoization models', () => {
  it('normalizes invalid overview focus values', () => {
    expect(parseOverviewFocus('broken')).toBe('all');
    expect(parseOverviewFocus('lists')).toBe('lists');
  });

  it('shows memo boundary holding on unrelated shell updates with stable props', () => {
    expect(
      describeMemoBoundary({
        usesMemoBoundary: true,
        unstableObjectProp: false,
        action: 'shell-note',
      }).childShouldRerender,
    ).toBe(false);
  });

  it('flags unstable object props as avoidable rerender cause', () => {
    expect(
      describeMemoBoundary({
        usesMemoBoundary: true,
        unstableObjectProp: true,
        action: 'shell-note',
      }).avoidable,
    ).toBe(true);
  });

  it('shows useMemo keeping derived projection stable on unrelated parent render', () => {
    expect(
      describeUseMemoScenario({
        usesMemoForProjection: true,
        unrelatedStateChanged: true,
      }).projectionShouldChange,
    ).toBe(false);
  });

  it('shows unstable callbacks touching all rows', () => {
    expect(
      describeCallbackScenario({
        usesStableCallback: false,
        action: 'shell-note',
      }).affectedRows,
    ).toBe('all-rows');
  });

  it('shows optimized list keeping zero touched rows on shell note updates', () => {
    expect(
      describeListOptimization({
        memoRows: true,
        stableCallbacks: true,
        memoizedVisibleIds: true,
        action: 'shell-note',
        visibleCount: 6,
      }).touchedRows,
    ).toBe(0);
  });

  it('does not recommend memoization for trivial and unmeasured case', () => {
    expect(
      evaluateMemoizationNeed({
        lagSeverity: 'none',
        computationCost: 'trivial',
        childBreadth: 'single',
        unstableProps: false,
        dependencyRisk: false,
        alreadyMeasured: false,
      }).verdict,
    ).toBe('Цена мемоизации выше ожидаемой пользы');
  });

  it('recommends measured memoization for heavy list bottleneck', () => {
    expect(
      evaluateMemoizationNeed({
        lagSeverity: 'high',
        computationCost: 'heavy',
        childBreadth: 'list',
        unstableProps: true,
        dependencyRisk: false,
        alreadyMeasured: true,
      }).verdict,
    ).toBe('Мемоизация выглядит оправданной');
  });
});
