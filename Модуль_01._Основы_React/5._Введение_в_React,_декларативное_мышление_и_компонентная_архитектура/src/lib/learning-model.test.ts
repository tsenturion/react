import { describe, expect, it } from 'vitest';

import { deriveCatalogView } from './catalog-domain';
import { analyzeComponentArchitecture } from './component-architecture-model';
import { buildComponentTreeScenario } from './component-tree-model';
import { describeCompositionScenario } from './data-composition-model';
import { buildDeclarativeComparison } from './declarative-model';
import { evaluateReactValue } from './react-value-model';
import { compareJsAndReact } from './react-vs-js-model';

describe('react intro learning model', () => {
  it('filters catalog view from one source of truth', () => {
    const view = deriveCatalogView({
      query: 'state',
      category: 'all',
      onlyStable: true,
      sortMode: 'priority',
      focusTag: 'all',
    });

    expect(view.visibleCount).toBeGreaterThan(0);
    expect(view.items.every((item) => item.stable)).toBe(true);
  });

  it('shows when React value becomes noticeable', () => {
    const smallScreen = evaluateReactValue('static', 'single', false);
    const growingScreen = evaluateReactValue('scaling', 'system', true);

    expect(smallScreen.tone).toBe('warn');
    expect(growingScreen.tone).toBe('success');
  });

  it('keeps declarative rule count smaller than imperative DOM steps', () => {
    const comparison = buildDeclarativeComparison({
      query: 'react',
      category: 'Практика',
      onlyStable: false,
      sortMode: 'alphabetical',
      focusTag: 'all',
    });

    expect(Number(comparison.imperativeCount)).toBeGreaterThan(
      Number(comparison.declarativeCount),
    );
  });

  it('prefers balanced component boundaries over oversplitting', () => {
    const balanced = analyzeComponentArchitecture('catalog', 'balanced');
    const overSplit = analyzeComponentArchitecture('catalog', 'over-split');

    expect(balanced.tone).toBe('success');
    expect(overSplit.tone).toBe('error');
  });

  it('marks section-level owner as too low for shared screen state', () => {
    const scenario = buildComponentTreeScenario('section', 'catalog-card');

    expect(scenario.tone).toBe('error');
    expect(scenario.risks.length).toBeGreaterThan(0);
  });

  it('estimates more imperative operations than react rules', () => {
    const view = deriveCatalogView({
      query: '',
      category: 'all',
      onlyStable: false,
      sortMode: 'priority',
      focusTag: 'all',
    });
    const comparison = compareJsAndReact(view, view.items[0]?.id ?? null);

    expect(Number(comparison.domOperationEstimate)).toBeGreaterThan(
      Number(comparison.reactRuleCount),
    );
  });

  it('composition dependencies shrink when optional blocks are hidden', () => {
    const fullScenario = describeCompositionScenario({
      query: '',
      category: 'all',
      onlyStable: false,
      sortMode: 'priority',
      focusTag: 'composition',
      layoutMode: 'split',
      showSummary: true,
      showAside: true,
    });
    const minimalScenario = describeCompositionScenario({
      query: '',
      category: 'all',
      onlyStable: false,
      sortMode: 'priority',
      focusTag: 'composition',
      layoutMode: 'stacked',
      showSummary: false,
      showAside: false,
    });

    expect(fullScenario.dependencies.length).toBeGreaterThan(
      minimalScenario.dependencies.length,
    );
  });
});
