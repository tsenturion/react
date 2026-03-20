import { describe, expect, it } from 'vitest';

import {
  buildConditionalViewModel,
  defaultConditionalControls,
} from './conditional-model';
import { buildFragmentReport } from './fragment-model';
import { buildKeyBugReport } from './key-bug-model';
import { buildListSurface, defaultListState } from './list-model';
import { analyzeReconciliation } from './reconciliation-model';

describe('conditional rendering, lists, keys and fragments lesson models', () => {
  it('switches to loading branch through early return', () => {
    const report = buildConditionalViewModel({
      ...defaultConditionalControls,
      isLoading: true,
    });

    expect(report.visibleBlocks).toEqual(['skeleton']);
    expect(report.snippet).toContain('LoadingCard');
  });

  it('filters and sorts the rendered list', () => {
    const surface = buildListSurface({
      ...defaultListState,
      query: 'key',
      sort: 'duration',
    });

    expect(surface.items.length).toBe(1);
    expect(surface.items[0].id).toBe('stable-keys');
  });

  it('detects identity drift for index keys after reverse', () => {
    const report = analyzeReconciliation('index', 'reverse');

    expect(report.identityDriftCount).toBeGreaterThan(0);
    expect(report.reusedCount).toBeGreaterThan(0);
  });

  it('keeps identity stable for stable-id keys after reverse', () => {
    const report = analyzeReconciliation('stable-id', 'reverse');

    expect(report.identityDriftCount).toBe(0);
    expect(report.reusedCount).toBe(report.after.length);
  });

  it('marks wrapper mode as structurally wrong for table rows', () => {
    const report = buildFragmentReport('wrapper', 3);

    expect(report.tone).toBe('error');
    expect(report.extraNodeCount).toBe(3);
  });

  it('treats random keys as full remount risk', () => {
    const report = buildKeyBugReport('random', 'prepend');

    expect(report.tone).toBe('error');
    expect(report.note).toContain('сбрасывается');
  });
});
