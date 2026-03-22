import { describe, expect, it } from 'vitest';

import { recommendStatePlacement } from './placement-advisor-model';
import { filterServerItems, summarizeServerSnapshot } from './server-state-model';
import { readQueryValue, writeQueryValue } from './url-state-model';

describe('state placement lesson models', () => {
  it('reads and validates URL state values', () => {
    expect(readQueryValue('?track=data', 'track', 'all', ['all', 'data'])).toBe('data');
    expect(readQueryValue('?track=debug', 'track', 'all', ['all', 'data'])).toBe('all');
  });

  it('writes URL state and removes fallback values', () => {
    expect(writeQueryValue('', 'track', 'data', 'all')).toBe('?track=data');
    expect(writeQueryValue('?track=data&q=cache', 'track', 'all', 'all')).toBe(
      '?q=cache',
    );
    expect(writeQueryValue('?q=cache', 'q', '', '')).toBe('');
  });

  it('filters server items by track and query', () => {
    const filtered = filterServerItems(
      [
        {
          id: '1',
          title: 'Routing cache',
          track: 'Data',
          owner: 'Platform',
          syncCost: 'medium',
          summary: 'Server data and URL state.',
        },
        {
          id: '2',
          title: 'Toolbar density',
          track: 'UI',
          owner: 'Design',
          syncCost: 'low',
          summary: 'Global preferences.',
        },
      ],
      'data',
      'server',
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe('1');
  });

  it('summarizes server snapshots by lifecycle state', () => {
    expect(
      summarizeServerSnapshot({
        status: 'loading',
        items: [],
        error: null,
        requestCount: 1,
        lastUpdated: null,
      }).tone,
    ).toBe('warn');

    expect(
      summarizeServerSnapshot({
        status: 'success',
        items: [
          {
            id: '1',
            title: 'Catalog',
            track: 'UI',
            owner: 'Core',
            syncCost: 'low',
            summary: 'Loaded from server.',
          },
        ],
        error: null,
        requestCount: 1,
        lastUpdated: Date.now(),
      }).headline,
    ).toContain('1');
  });

  it('recommends URL or local state when appropriate', () => {
    expect(
      recommendStatePlacement({
        sharedAcrossTree: false,
        shareableLink: true,
        serverOwned: false,
        remoteFreshness: false,
        affectsManyBranches: false,
        ephemeralDraft: false,
      }).primary,
    ).toBe('url');

    expect(
      recommendStatePlacement({
        sharedAcrossTree: false,
        shareableLink: false,
        serverOwned: false,
        remoteFreshness: false,
        affectsManyBranches: false,
        ephemeralDraft: true,
      }).primary,
    ).toBe('local');
  });

  it('recommends server or hybrid placement for external truth', () => {
    expect(
      recommendStatePlacement({
        sharedAcrossTree: true,
        shareableLink: false,
        serverOwned: true,
        remoteFreshness: true,
        affectsManyBranches: true,
        ephemeralDraft: false,
      }).primary,
    ).toBe('server');

    expect(
      recommendStatePlacement({
        sharedAcrossTree: true,
        shareableLink: true,
        serverOwned: true,
        remoteFreshness: true,
        affectsManyBranches: true,
        ephemeralDraft: false,
      }).primary,
    ).toBe('hybrid');
  });
});
