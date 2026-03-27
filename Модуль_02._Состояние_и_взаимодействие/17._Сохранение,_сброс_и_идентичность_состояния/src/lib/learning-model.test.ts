import { describe, expect, it } from 'vitest';

import { buildBranchIdentityReport } from './branch-identity-model';
import { buildKeyResetReport } from './key-reset-model';
import { analyzeListIdentity } from './list-identity-model';
import { buildPositionBindingReport } from './state-position-model';
import { buildStateStrategyReport } from './strategy-playbook-model';
import { buildTreeMoveReport } from './tree-move-model';

describe('state identity lesson models', () => {
  it('keeps state when type and slot stay the same', () => {
    const report = buildPositionBindingReport({
      sameComponentType: true,
      sameTreeSlot: true,
      keyChanged: false,
    });

    expect(report.tone).toBe('success');
    expect(report.summary).toContain('React хранит локальный state');
  });

  it('describes branch reset when component type changes', () => {
    const report = buildBranchIdentityReport('different-type');

    expect(report.tone).toBe('error');
    expect(report.snippet).toContain('AdvancedTrackPanel');
  });

  it('uses key as reset boundary', () => {
    expect(buildKeyResetReport(false).tone).toBe('warn');
    expect(buildKeyResetReport(true).snippet).toContain('key={activeProfile.id}');
  });

  it('detects list identity drift with index keys', () => {
    const stable = analyzeListIdentity('stable-id', 'reverse');
    const drifting = analyzeListIdentity('index', 'reverse');

    expect(stable.identityDriftCount).toBe(0);
    expect(drifting.identityDriftCount).toBeGreaterThan(0);
  });

  it('distinguishes layout reorder from actual tree move', () => {
    expect(buildTreeMoveReport('css-order').tone).toBe('success');
    expect(buildTreeMoveReport('tree-move').snippet).toContain('dock ===');
  });

  it('recommends strategy from preserve/reset goal', () => {
    const preserve = buildStateStrategyReport('preserve', 'reorder-list');
    const reset = buildStateStrategyReport('reset', 'switch-entity');

    expect(preserve.snippet).toContain('item.id');
    expect(reset.technique).toContain('key');
  });
});
