import { describe, expect, it } from 'vitest';

import {
  buildCatalogIndex,
  createCatalog,
  projectIndexed,
  projectNested,
} from './data-structure-model';
import { diagnoseBottleneckScenario } from './bottleneck-model';
import { describeLabFromPath } from './learning-model';
import { evaluateOptimizationNeed } from './performance-advisor-model';
import { describeRenderReaction } from './render-performance-model';
import { describeStatePlacement } from './state-colocation-model';

describe('learning model', () => {
  it('maps pathname to active lab id', () => {
    expect(describeLabFromPath('/render-causes')).toBe('render-causes');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });

  it('detects avoidable rerender from unstable object prop', () => {
    expect(
      describeRenderReaction({
        action: 'parent-note',
        unstableObjectProp: true,
      }).avoidable,
    ).toBe(true);

    expect(
      describeRenderReaction({
        action: 'parent-note',
        unstableObjectProp: false,
      }).avoidable,
    ).toBe(false);
  });

  it('distinguishes wide and contained state placement', () => {
    expect(
      describeStatePlacement({
        mode: 'lifted',
        shellCommits: 4,
        listCommits: 4,
        hasUnappliedDraft: false,
      }).blastRadius,
    ).toBe('wide');

    expect(
      describeStatePlacement({
        mode: 'colocated',
        shellCommits: 1,
        listCommits: 1,
        hasUnappliedDraft: true,
      }).blastRadius,
    ).toBe('contained');
  });

  it('keeps visible results while reducing operations with indexed projection', () => {
    const catalog = createCatalog(8, 10);
    const index = buildCatalogIndex(catalog);
    const filters = {
      query: 'react',
      track: 'data' as const,
      level: 'practice' as const,
      sort: 'title' as const,
    };

    const nested = projectNested(catalog, filters);
    const indexed = projectIndexed(index, filters);

    expect(indexed.visibleCount).toBe(nested.visibleCount);
    expect(indexed.sampleTitles).toEqual(nested.sampleTitles);
    expect(indexed.operations).toBeLessThan(nested.operations);
  });

  it('recognizes wide rerender bottleneck', () => {
    expect(
      diagnoseBottleneckScenario({
        isolatedControls: false,
        rowCount: 36,
        cost: 'heavy',
        lastInteraction: 'toggle-inspector',
      }).bottleneck,
    ).toBe('wide-rerender');
  });

  it('recommends state placement before fancy optimizations', () => {
    expect(
      evaluateOptimizationNeed({
        lagSeverity: 'obvious',
        frequency: 'constant',
        scope: 'screen',
        suspectedCause: 'wide-rerender',
        measurement: 'measured',
      }).verdict,
    ).toContain('state placement');
  });
});
