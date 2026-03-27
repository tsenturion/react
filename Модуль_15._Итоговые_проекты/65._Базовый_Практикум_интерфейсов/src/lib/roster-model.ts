import type { RosterMember, RosterStatus, RosterTrack } from './roster-data';

export type RosterSort = 'progress' | 'name';

export type RosterFilters = {
  query: string;
  track: 'all' | RosterTrack;
  onlyReady: boolean;
  sortBy: RosterSort;
};

export type RosterSummary = {
  visibleCount: number;
  readyCount: number;
  reviewCount: number;
  blockedCount: number;
  averageProgress: number;
  accessibilityFocusCount: number;
};

export type SelectionState = 'none' | 'visible' | 'hidden-by-filter' | 'missing';

export type SelectionInfo = {
  state: SelectionState;
  member: RosterMember | null;
  message: string;
};

export function createRosterFilters(): RosterFilters {
  return {
    query: '',
    track: 'all',
    onlyReady: false,
    sortBy: 'progress',
  };
}

function matchesQuery(row: RosterMember, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    row.name,
    row.city,
    row.email,
    row.mentor,
    row.project,
    row.track,
    row.teamName,
    row.bio,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export function filterRoster(
  rows: readonly RosterMember[],
  filters: RosterFilters,
): RosterMember[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    if (filters.track !== 'all' && row.track !== filters.track) {
      return false;
    }

    if (filters.onlyReady && row.status !== 'ready') {
      return false;
    }

    return matchesQuery(row, normalizedQuery);
  });

  return [...filteredRows].sort((left, right) => {
    if (filters.sortBy === 'name') {
      return left.name.localeCompare(right.name, 'ru');
    }

    return right.progress - left.progress;
  });
}

export function summarizeRoster(rows: readonly RosterMember[]): RosterSummary {
  const visibleCount = rows.length;
  const readyCount = rows.filter((row) => row.status === 'ready').length;
  const reviewCount = rows.filter((row) => row.status === 'review').length;
  const blockedCount = rows.filter((row) => row.status === 'blocked').length;
  const accessibilityFocusCount = rows.filter((row) => row.accessibilityFocus).length;
  const averageProgress =
    visibleCount === 0
      ? 0
      : Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / visibleCount);

  return {
    visibleCount,
    readyCount,
    reviewCount,
    blockedCount,
    averageProgress,
    accessibilityFocusCount,
  };
}

export function describeSelection(
  selectedId: string | null,
  allRows: readonly RosterMember[],
  visibleRows: readonly RosterMember[],
): SelectionInfo {
  if (selectedId === null) {
    return {
      state: 'none',
      member: null,
      message:
        'Участник не выбран. Выберите строку в таблице, чтобы увидеть подробности и назначить слот.',
    };
  }

  const member = allRows.find((row) => row.id === selectedId) ?? null;

  if (!member) {
    return {
      state: 'missing',
      member: null,
      message: 'Выбранный участник больше не доступен в реестре.',
    };
  }

  const isVisible = visibleRows.some((row) => row.id === selectedId);

  if (isVisible) {
    return {
      state: 'visible',
      member,
      message: 'Карточка показывает актуальные данные выбранного участника.',
    };
  }

  return {
    state: 'hidden-by-filter',
    member,
    message: 'Участник всё ещё выбран, но скрыт текущими фильтрами.',
  };
}

export function getStatusTone(status: RosterStatus) {
  if (status === 'ready') {
    return 'success' as const;
  }

  if (status === 'review') {
    return 'warning' as const;
  }

  return 'danger' as const;
}
