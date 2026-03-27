import { describe, expect, it } from 'vitest';

import { normalizeServerTitle } from './mutation-client';
import { mutationSeedItems, toViewItems } from './mutation-domain';
import {
  clearPending,
  markPending,
  replaceTempItem,
  toggleDone,
} from './mutation-state-model';
import { recommendMutationUx } from './mutation-ux-model';

describe('mutation state model', () => {
  it('toggles done flag only for the targeted item', () => {
    const items = toViewItems(mutationSeedItems);
    const nextItems = toggleDone(items, 'item-1');

    expect(nextItems[0]?.done).toBe(true);
    expect(nextItems[1]?.done).toBe(true);
    expect(nextItems[2]?.done).toBe(false);
  });

  it('marks pending state and clears it back after confirmation', () => {
    const items = toViewItems(mutationSeedItems);
    const pendingItems = markPending(items, 'item-2', 'Ждёт сервер');
    const clearedItems = clearPending(pendingItems, 'item-2');

    expect(pendingItems[1]).toMatchObject({
      pending: true,
      pendingLabel: 'Ждёт сервер',
    });
    expect(clearedItems[1]).toMatchObject({
      pending: false,
      pendingLabel: undefined,
    });
  });

  it('replaces temporary item with server-confirmed item', () => {
    const items = [
      {
        id: 'temp-1',
        title: 'Временная запись',
        lane: 'release' as const,
        done: false,
        owner: 'Локально',
        pending: true,
        temp: true,
      },
    ];

    const nextItems = replaceTempItem(items, 'temp-1', {
      id: 'server-51',
      title: 'Подтверждённая запись',
      lane: 'release',
      done: false,
      owner: 'Сервер',
    });

    expect(nextItems[0]).toMatchObject({
      id: 'server-51',
      title: 'Подтверждённая запись',
      temp: false,
      pending: false,
    });
  });
});

describe('mutation client helpers', () => {
  it('normalizes title the way server canonicalization expects', () => {
    expect(normalizeServerTitle('   новая   версия   урока  ')).toBe(
      'Новая версия урока',
    );
  });
});

describe('mutation ux model', () => {
  it('prefers conservative UX for high-risk mutations', () => {
    expect(
      recommendMutationUx({
        reversible: true,
        destructive: false,
        serverCanonicalizes: false,
        instantFeedbackMatters: true,
        highRisk: true,
      }).approach,
    ).toBe('Conservative UX');
  });

  it('prefers hybrid UX when server can change the resulting value', () => {
    expect(
      recommendMutationUx({
        reversible: true,
        destructive: false,
        serverCanonicalizes: true,
        instantFeedbackMatters: true,
        highRisk: false,
      }).approach,
    ).toBe('Hybrid UX');
  });

  it('prefers optimistic UX for reversible low-risk actions with high feedback value', () => {
    expect(
      recommendMutationUx({
        reversible: true,
        destructive: false,
        serverCanonicalizes: false,
        instantFeedbackMatters: true,
        highRisk: false,
      }).approach,
    ).toBe('Optimistic UX');
  });
});
