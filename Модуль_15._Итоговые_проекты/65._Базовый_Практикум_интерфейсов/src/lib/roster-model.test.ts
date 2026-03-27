import { describe, expect, it } from 'vitest';

import { rosterMembers } from './roster-data';
import {
  createRosterFilters,
  describeSelection,
  filterRoster,
  summarizeRoster,
} from './roster-model';

describe('roster model', () => {
  it('filters rows by search, track and readiness', () => {
    const filters = {
      ...createRosterFilters(),
      query: 'валидация',
      track: 'forms' as const,
      onlyReady: true,
    };

    const rows = filterRoster(rosterMembers, filters);

    expect(rows.map((row) => row.id)).toEqual(['alisa-kopeva']);
  });

  it('describes when the selected row is hidden by active filters', () => {
    const filters = {
      ...createRosterFilters(),
      track: 'forms' as const,
    };
    const visibleRows = filterRoster(rosterMembers, filters);
    const selection = describeSelection('nina-litvinova', rosterMembers, visibleRows);

    expect(selection.state).toBe('hidden-by-filter');
    expect(selection.member?.name).toBe('Нина Литвинова');
  });

  it('builds summary metrics from visible rows only', () => {
    const summary = summarizeRoster(filterRoster(rosterMembers, createRosterFilters()));

    expect(summary).toEqual({
      visibleCount: 6,
      readyCount: 3,
      reviewCount: 2,
      blockedCount: 1,
      averageProgress: 76,
      accessibilityFocusCount: 4,
    });
  });
});
