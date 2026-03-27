import { describe, expect, it } from 'vitest';

import { buildBubblingReport } from './bubbling-model';
import { buildDefaultActionReport } from './default-action-model';
import {
  toggleHandled,
  buildEventFlowSnapshot,
  filterEventLessons,
} from './event-flow-model';
import { buildPitfallReport } from './event-pitfall-model';
import { createEventLessons } from './event-domain';
import { buildReactNativeReport } from './react-native-model';
import { buildHandlerPatternReport } from './synthetic-event-model';

describe('react events lesson models', () => {
  it('describes handler patterns', () => {
    const report = buildHandlerPatternReport('inline');

    expect(report.tone).toBe('success');
    expect(report.snippet).toContain('handleAction');
  });

  it('builds bubbling chain and stop propagation summary', () => {
    expect(buildBubblingReport('none').propagation).toEqual(['button', 'card', 'board']);
    expect(buildBubblingReport('button').snippet).toContain('stopPropagation');
  });

  it('describes react vs native bridge', () => {
    const report = buildReactNativeReport();

    expect(report.differences.length).toBeGreaterThan(2);
    expect(report.summary).toContain('SyntheticEvent');
  });

  it('describes preventDefault consequences', () => {
    const report = buildDefaultActionReport({
      preventLink: true,
      preventCheckbox: false,
    });

    expect(report.tone).toBe('warn');
    expect(report.consequences[0]).toContain('остановлен');
  });

  it('updates event-driven state snapshot', () => {
    const lessons = createEventLessons();
    const updated = toggleHandled(lessons, lessons[0].id);
    const visible = filterEventLessons(updated, true);
    const snapshot = buildEventFlowSnapshot({
      onlyUnhandled: true,
      selectedId: updated[0].id,
      lessons: updated,
    });

    expect(visible.length).toBeLessThanOrEqual(updated.length);
    expect(snapshot.handledCount).toBeGreaterThan(0);
  });

  it('describes typical handler pitfalls', () => {
    expect(buildPitfallReport('target-vs-currentTarget').badSnippet).toContain('target');
    expect(buildPitfallReport('invoke-during-render').goodSnippet).toContain('=>');
  });
});
