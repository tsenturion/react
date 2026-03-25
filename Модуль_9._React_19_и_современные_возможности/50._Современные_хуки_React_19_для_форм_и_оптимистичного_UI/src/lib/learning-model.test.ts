import { describe, expect, it } from 'vitest';

import {
  buildFailureState,
  buildSuccessState,
  buildValidationState,
  initialHookActionState,
} from './action-hooks-state-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import {
  buildReceipt,
  formatChannel,
  readAnnouncementPayload,
  validateAnnouncementPayload,
} from './modern-form-hooks-domain';
import { chooseHookStrategy, type HookScenario } from './modern-hooks-playbook-model';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
} from './modern-hooks-overview-domain';

describe('lesson route model', () => {
  it('keeps all lesson 50 labs in route map', () => {
    expect(lessonLabs.map((item) => item.id)).toEqual([
      'overview',
      'use-action-state',
      'use-form-status',
      'use-optimistic',
      'pending-error-result',
      'hooks-playbook',
    ]);
  });

  it('maps pathname to matching lab id', () => {
    expect(describeLabFromPath('/use-optimistic')).toBe('use-optimistic');
    expect(describeLabFromPath('/pending-error-result')).toBe('pending-error-result');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('overview model', () => {
  it('parses URL focus safely', () => {
    expect(parseOverviewFocus('optimistic')).toBe('optimistic');
    expect(parseOverviewFocus('something-else')).toBe('all');
  });

  it('filters cards by focus', () => {
    expect(filterOverviewCardsByFocus('status')).toHaveLength(1);
    expect(filterOverviewCardsByFocus('all').length).toBeGreaterThan(3);
  });
});

describe('form hooks domain', () => {
  it('reads FormData into payload', () => {
    const formData = new FormData();
    formData.set('title', ' Hooks ');
    formData.set('summary', ' Summary for testing ');
    formData.set('channel', 'public');
    formData.set('note', ' Public note for testing ');

    expect(readAnnouncementPayload(formData)).toEqual({
      title: 'Hooks',
      summary: 'Summary for testing',
      channel: 'public',
      note: 'Public note for testing',
    });
  });

  it('validates payload with public release note rule', () => {
    expect(
      validateAnnouncementPayload({
        title: 'Go',
        summary: 'short',
        channel: 'public',
        note: 'tiny',
      }),
    ).toHaveLength(3);
  });

  it('builds receipt with channel label', () => {
    const receipt = buildReceipt({
      title: 'Launch',
      summary: 'Long enough summary',
      channel: 'beta',
      note: 'A proper note for beta users',
    });

    expect(receipt.channelLabel).toBe(formatChannel('beta'));
    expect(receipt.ticket.startsWith('BETA-')).toBe(true);
  });
});

describe('action state builders', () => {
  const payload = {
    title: 'Release board',
    summary: 'Summary long enough for action-state tests',
    channel: 'team' as const,
    note: 'Internal note',
  };

  it('builds validation snapshot', () => {
    const state = buildValidationState(initialHookActionState, payload, ['Issue']);
    expect(state.status).toBe('error');
    expect(state.receipt).toBeNull();
    expect(state.issues).toEqual(['Issue']);
  });

  it('builds failure snapshot', () => {
    const state = buildFailureState(initialHookActionState, payload);
    expect(state.status).toBe('error');
    expect(state.receipt).toBeNull();
    expect(state.lastSubmittedTitle).toBe('Release board');
  });

  it('builds success snapshot', () => {
    const state = buildSuccessState(initialHookActionState, payload);
    expect(state.status).toBe('success');
    expect(state.receipt?.headline).toContain('Release board');
  });
});

describe('playbook model', () => {
  it('recommends combined hooks for complex async form', () => {
    const scenario: HookScenario = {
      isRealForm: true,
      needsReturnedState: true,
      needsNestedPending: true,
      needsInstantFeedback: true,
      canFailAfterOptimistic: true,
    };

    expect(chooseHookStrategy(scenario).primaryPattern).toBe('combined-hooks');
  });

  it('recommends manual handler outside real form lifecycle', () => {
    const scenario: HookScenario = {
      isRealForm: false,
      needsReturnedState: false,
      needsNestedPending: false,
      needsInstantFeedback: false,
      canFailAfterOptimistic: false,
    };

    expect(chooseHookStrategy(scenario).primaryPattern).toBe('manual-handler');
  });
});
