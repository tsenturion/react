import { describe, expect, it } from 'vitest';

import {
  buildCourseCardViewModel,
  compareCardViewModels,
  defaultFunctionalCardControls,
} from './component-props-model';
import { buildChildrenScenario } from './children-slot-model';
import { buildFlowReport, defaultFlowState } from './props-flow-model';
import {
  buildApiComparison,
  defaultBooleanSoupState,
  defaultCleanApiState,
} from './api-design-model';
import { buildMirrorReport, buildMutationReport } from './anti-pattern-model';

describe('components and props lesson models', () => {
  it('builds different props for reused cards', () => {
    const first = buildCourseCardViewModel('props-basics', defaultFunctionalCardControls);
    const second = buildCourseCardViewModel('api-design', defaultFunctionalCardControls);

    expect(compareCardViewModels(first, second)).toContain('title');
  });

  it('describes children scenarios with visible child count', () => {
    const scenario = buildChildrenScenario('split-view', true, false);

    expect(scenario.childCount).toBeGreaterThan(2);
    expect(scenario.snippet).toContain('SlotFrame');
  });

  it('marks density change as subtree-specific', () => {
    const report = buildFlowReport(defaultFlowState, 'density');

    expect(report.affectedComponents).toContain('LessonEntry');
    expect(report.visibleLessonCount).toBeGreaterThan(0);
  });

  it('warns when boolean soup has multiple active tones', () => {
    const comparison = buildApiComparison(
      { ...defaultBooleanSoupState, isInfo: true, isDanger: true },
      defaultCleanApiState,
    );

    expect(comparison.badWarnings.length).toBeGreaterThan(0);
  });

  it('detects mirror drift and mutation risk', () => {
    expect(buildMirrorReport('Новый заголовок', 'Старый заголовок').tone).toBe('warn');
    expect(buildMutationReport(2, 4).tone).toBe('error');
  });
});
