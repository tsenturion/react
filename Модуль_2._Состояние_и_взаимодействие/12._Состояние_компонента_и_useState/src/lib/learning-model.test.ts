import { describe, expect, it } from 'vitest';

import { buildBasicStateReport } from './basic-state-model';
import { buildBatchingReport } from './batching-model';
import { simulateQueuedIncrements } from './queue-model';
import { buildSnapshotNarrative } from './snapshot-model';
import { buildEnrollmentViewModel } from './state-flow-model';
import { simulateDelayedIncrements } from './stale-state-model';

describe('component state and useState lesson models', () => {
  it('describes local state basics', () => {
    const report = buildBasicStateReport({
      likes: 22,
      bookmarked: true,
      expanded: true,
    });

    expect(report.tone).toBe('success');
    expect(report.reactionLabel).toContain('Высокий');
  });

  it('builds snapshot narrative for current and next render', () => {
    const story = buildSnapshotNarrative(2, 3);

    expect(story.sameHandlerLabel).toContain('2');
    expect(story.nextRenderLabel).toContain('5');
  });

  it('shows batched event touching several state slices', () => {
    const report = buildBatchingReport();

    expect(report.touchedSlices).toBe(3);
    expect(report.visibleAfterEvent).toContain('status');
  });

  it('distinguishes direct and functional queued updates', () => {
    expect(simulateQueuedIncrements(0, 3, 'direct').finalValue).toBe(1);
    expect(simulateQueuedIncrements(0, 3, 'functional').finalValue).toBe(3);
  });

  it('shows stale delayed updates losing increments', () => {
    expect(simulateDelayedIncrements(0, 3, 'direct').finalValue).toBe(1);
    expect(simulateDelayedIncrements(0, 3, 'functional').finalValue).toBe(3);
  });

  it('derives UI labels from several state slices', () => {
    const viewModel = buildEnrollmentViewModel({
      plan: 'team',
      seats: 2,
      acceptedRules: true,
      submitted: false,
    });

    expect(viewModel.actionLabel).toContain('Можно');
    expect(viewModel.availability).toContain('2');
  });
});
