import { describe, expect, it } from 'vitest';

import { inspectChildContract } from './children-api-model';
import { describeHocScenario } from './hoc-pattern-model';
import { evaluatePatternCosts } from './pattern-cost-model';
import { recommendCompositionPattern } from './pattern-recommendation-model';

describe('lesson 30 models', () => {
  it('recommends compound components for shared subparts under one surface', () => {
    const report = recommendCompositionPattern({
      sharedSubparts: true,
      callerControlsMarkup: false,
      logicReuseOnly: false,
      needInjectIntoChildren: false,
      legacyInterop: false,
      strongTypingPriority: true,
    });

    expect(report.primary).toBe('compound components');
    expect(report.tone).toBe('success');
  });

  it('recommends render props when caller must own the final markup', () => {
    const report = recommendCompositionPattern({
      sharedSubparts: false,
      callerControlsMarkup: true,
      logicReuseOnly: false,
      needInjectIntoChildren: false,
      legacyInterop: false,
      strongTypingPriority: false,
    });

    expect(report.primary).toBe('render props');
  });

  it('prefers custom hooks when only behaviour reuse is needed', () => {
    const report = recommendCompositionPattern({
      sharedSubparts: false,
      callerControlsMarkup: false,
      logicReuseOnly: true,
      needInjectIntoChildren: false,
      legacyInterop: false,
      strongTypingPriority: true,
    });

    expect(report.primary).toBe('custom hook + explicit slots');
  });

  it('marks wrapped children as fragile in cloneElement scenarios', () => {
    const report = inspectChildContract('wrapped');

    expect(report.tone).toBe('warn');
    expect(report.directChildSafety).toBe('fragile');
  });

  it('treats non-legacy local HOC usage as over-abstracted', () => {
    const report = describeHocScenario({
      consumers: 1,
      crossCutting: false,
      legacyInterop: false,
    });

    expect(report.tone).toBe('error');
    expect(report.statusLabel).toBe('Over-abstracted');
  });

  it('flags high-risk cloneElement scenarios with external children and hidden contracts', () => {
    const report = evaluatePatternCosts({
      pattern: 'cloneElement + Children API',
      thirdPartyChildren: true,
      wrapperLayers: 2,
      implicitContract: true,
      typingPressure: 'high',
      teamDiscoverability: 'low',
    });

    expect(report.tone).toBe('error');
    expect(report.score).toBeGreaterThan(7);
  });
});
