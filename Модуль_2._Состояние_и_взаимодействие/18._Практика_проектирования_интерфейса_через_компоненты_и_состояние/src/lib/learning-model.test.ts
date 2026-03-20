import { describe, expect, it } from 'vitest';

import { buildBlueprintPlan } from './blueprint-model';
import { buildDataFlowReport } from './data-flow-model';
import { buildDecompositionPlan } from './decomposition-model';
import { buildFlowEntry } from './interaction-flow-model';
import { buildSourceTruthReport } from './source-truth-model';
import { buildWorkbenchSummary, filterLessons, toggleFavorite } from './workbench-model';
import { createLessonCatalog } from './interface-practice-domain';

describe('interface architecture lesson models', () => {
  it('builds a balanced decomposition plan', () => {
    const plan = buildDecompositionPlan('balanced');

    expect(plan.componentCount).toBeGreaterThan(4);
    expect(plan.snippet).toContain('WorkbenchToolbar');
  });

  it('scores duplicated source of truth as risky', () => {
    const report = buildSourceTruthReport('duplicated-selection');

    expect(report.tone).toBe('error');
    expect(report.score).toBeLessThan(50);
  });

  it('marks stored derived values as duplicated state', () => {
    const report = buildDataFlowReport({
      filteredInState: true,
      summaryInState: true,
      selectedObjectInState: false,
    });

    expect(report.riskCount).toBe(2);
    expect(report.tone).toBe('error');
  });

  it('maps a blueprint preset to architecture parts', () => {
    const plan = buildBlueprintPlan('course-console');

    expect(plan.components).toContain('CourseWorkbench');
    expect(plan.state).toContain('selectedId');
  });

  it('filters lessons and recomputes summary', () => {
    const lessons = createLessonCatalog();
    const filtered = filterLessons(lessons, 'state', 'all');
    const updated = toggleFavorite(lessons, lessons[1].id);
    const summary = buildWorkbenchSummary(updated, filtered, filtered[0].id);

    expect(filtered.length).toBeGreaterThan(0);
    expect(summary.favoriteCount).toBeGreaterThanOrEqual(2);
  });

  it('describes the action to render cycle', () => {
    const entry = buildFlowEntry('select', {
      query: '',
      activeTrack: 'all',
      selectedTitle: 'Архитектура состояния',
      visibleCount: 4,
      favoriteCount: 2,
      draftLength: 58,
    });

    expect(entry.actionLine).toContain('выбран');
    expect(entry.renderLine).toContain('Render');
  });
});
