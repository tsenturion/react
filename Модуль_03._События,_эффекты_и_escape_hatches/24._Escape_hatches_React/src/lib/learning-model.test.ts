import { describe, expect, it } from 'vitest';

import { getEscapeRecommendation } from './escape-boundary-model';
import { simulateFlushSyncCounts } from './flush-sync-model';
import { computeTooltipPlacement } from './layering-model';
import { describeBubbleSequence } from './portal-model';
import { buildDialogBridgeReport } from './dialog-bridge-model';

describe('escape hatches learning model', () => {
  it('keeps portal bubbling sequence when propagation is allowed', () => {
    expect(describeBubbleSequence('allow')).toContain('Parent React handler');
  });

  it('simulates stale DOM read without flushSync', () => {
    const snapshot = simulateFlushSyncCounts(4);

    expect(snapshot.normalImmediateCount).toBe(4);
    expect(snapshot.flushImmediateCount).toBe(5);
  });

  it('clamps tooltip placement into viewport', () => {
    const placement = computeTooltipPlacement(
      { top: 80, left: 16, width: 60, height: 20 },
      320,
      240,
      180,
      96,
    );

    expect(placement.left).toBeGreaterThanOrEqual(12);
    expect(placement.top).toBeGreaterThanOrEqual(12);
  });

  it('recommends portal for modal layers', () => {
    expect(getEscapeRecommendation('modal-layer').recommended).toBe('createPortal');
  });

  it('keeps pure render for derived filter scenario', () => {
    expect(getEscapeRecommendation('derived-filter').recommended).toBe(
      'обычное вычисление в render',
    );
  });

  it('describes state bridge for native dialog', () => {
    expect(buildDialogBridgeReport('state').snippet).toContain('dialog.showModal()');
  });
});
