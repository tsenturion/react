import { describe, expect, it } from 'vitest';

import { buildColocationReport } from './colocated-state-model';
import {
  createDuplicatedDirectory,
  createLessonRecords,
  createNormalizedDirectory,
  createPlacementScenario,
  createPlanningTasks,
  createPricingLines,
  createSectionCards,
} from './state-architecture-domain';
import {
  buildDerivedStateReport,
  createBadPricingState,
  incrementBadPricingWithoutSync,
} from './derived-state-model';
import {
  buildDuplicateStateReport,
  createBadSelectionState,
  createGoodSelectionState,
  renameLesson,
} from './duplicate-state-model';
import { buildMinimalStateReport } from './minimal-state-model';
import {
  buildNormalizationArchitectureReport,
  renameTeacherInDuplicatedDirectory,
  renameTeacherInNormalizedDirectory,
} from './normalization-architecture-model';
import { buildPlacementDecision } from './placement-model';

describe('state architecture lesson models', () => {
  it('derives planner metrics from minimal state', () => {
    const report = buildMinimalStateReport(createPlanningTasks(), '', false);

    expect(report.total).toBe(3);
    expect(report.completed).toBe(1);
  });

  it('detects mismatch when derived values are stored separately', () => {
    const badState = incrementBadPricingWithoutSync(
      createBadPricingState(createPricingLines()),
      'line-1',
    );

    expect(buildDerivedStateReport(badState).mismatch).toBe(true);
  });

  it('shows drift when selected entity is duplicated', () => {
    const lessons = renameLesson(createLessonRecords(), 'lesson-1');
    const badState = {
      ...createBadSelectionState(lessons),
      selectedTitle: 'Минимальный state',
    };
    const goodState = createGoodSelectionState(lessons);
    const report = buildDuplicateStateReport(badState, goodState);

    expect(report.badLabel).toBe('drift');
    expect(report.goodLabel).toContain('+');
  });

  it('recommends colocated state when parent summary is not needed', () => {
    const report = buildColocationReport(createSectionCards(), 'local', false, 0);

    expect(report.rootStateSize).toBe(0);
    expect(report.summaryLabel).toBe('local is enough');
  });

  it('recommends derived state when value depends on other state', () => {
    const scenario = createPlacementScenario();
    scenario.derivedFromOtherState = true;

    expect(buildPlacementDecision(scenario).target).toBe('derive');
  });

  it('keeps normalized entity sync when duplicated copies drift', () => {
    const duplicated = renameTeacherInDuplicatedDirectory(
      createDuplicatedDirectory(),
      'teacher-1',
    );
    const normalized = renameTeacherInNormalizedDirectory(
      createNormalizedDirectory(),
      'teacher-1',
    );

    expect(
      buildNormalizationArchitectureReport(duplicated, normalized).duplicatedConsistency,
    ).toBe('drift');
  });
});
