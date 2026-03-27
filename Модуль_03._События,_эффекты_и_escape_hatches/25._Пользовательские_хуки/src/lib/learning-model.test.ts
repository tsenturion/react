import { describe, expect, it } from 'vitest';

import { buildCatalogSummary, filterCourses } from './catalog-filter-model';
import { summarizeChecklist } from './checklist-model';
import { boundaryPresets, courseCatalog, initialChecklist } from './custom-hooks-domain';
import { buildFeedbackPreview, validateFeedbackDraft } from './feedback-model';
import { assessHookBoundary } from './hook-boundary-model';

describe('custom hooks lesson models', () => {
  it('filters courses by query, level and featured flag', () => {
    const result = filterCourses(courseCatalog, {
      query: 'smaller',
      level: 'Продвинутый',
      featuredOnly: true,
    });

    expect(result.map((item) => item.id)).toEqual(['workspace-composition']);
  });

  it('builds empty-state summary when nothing is visible', () => {
    const summary = buildCatalogSummary(6, 0, {
      query: 'x',
      level: 'Все',
      featuredOnly: false,
    });

    expect(summary.tone).toBe('error');
    expect(summary.headline).toContain('Ничего');
  });

  it('summarizes checklist progress and next pending item', () => {
    const summary = summarizeChecklist(initialChecklist);

    expect(summary.progressLabel).toBe('1/4');
    expect(summary.nextPending).toBe('Вывести наружу команды');
  });

  it('validates feedback and builds readable preview', () => {
    const invalid = validateFeedbackDraft({
      name: 'A',
      channel: 'slack',
      message: 'short',
      includeCode: true,
    });
    const preview = buildFeedbackPreview({
      name: 'Архитектор UI',
      channel: 'issue',
      message: 'Форма смешивает валидацию и отображение в одном компоненте.',
      includeCode: false,
    });

    expect(invalid.name).not.toBeNull();
    expect(invalid.message).not.toBeNull();
    expect(preview).toContain('issue tracker');
    expect(preview).toContain('без кодовых фрагментов');
  });

  it('recommends extracting a hook for repeated sync-heavy workflow', () => {
    const decision = assessHookBoundary(boundaryPresets[1]);

    expect(decision.decision).toBe('extract-hook');
    expect(decision.tone).toBe('success');
  });

  it('recommends helper for pure derived logic without state', () => {
    const decision = assessHookBoundary(boundaryPresets[2]);

    expect(decision.decision).toBe('prefer-helper');
    expect(decision.label).toContain('helper');
  });
});
