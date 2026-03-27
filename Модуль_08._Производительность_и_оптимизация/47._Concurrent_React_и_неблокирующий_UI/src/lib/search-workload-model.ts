export type SearchTrack = 'all' | 'render' | 'data' | 'routing' | 'forms';
export type SearchSort = 'relevance' | 'sessions' | 'complexity';

export type SearchItem = {
  id: string;
  title: string;
  track: Exclude<SearchTrack, 'all'>;
  complexity: number;
  sessions: number;
  tags: readonly string[];
};

export const concurrentCatalog: readonly SearchItem[] = [
  {
    id: 'render-lanes',
    title: 'Render lanes and priorities',
    track: 'render',
    complexity: 5,
    sessions: 3,
    tags: ['priority', 'scheduler'],
  },
  {
    id: 'transition-search',
    title: 'Transition-based search',
    track: 'render',
    complexity: 4,
    sessions: 2,
    tags: ['search', 'transition'],
  },
  {
    id: 'deferred-grid',
    title: 'Deferred analytics grid',
    track: 'render',
    complexity: 4,
    sessions: 4,
    tags: ['deferred', 'grid'],
  },
  {
    id: 'event-lag',
    title: 'Avoiding input lag',
    track: 'render',
    complexity: 3,
    sessions: 2,
    tags: ['input', 'typing'],
  },
  {
    id: 'server-cache',
    title: 'Server cache stability',
    track: 'data',
    complexity: 4,
    sessions: 3,
    tags: ['cache', 'query'],
  },
  {
    id: 'optimistic-flow',
    title: 'Optimistic mutation flow',
    track: 'data',
    complexity: 5,
    sessions: 4,
    tags: ['mutation', 'ui'],
  },
  {
    id: 'search-index',
    title: 'Search index projection',
    track: 'data',
    complexity: 4,
    sessions: 2,
    tags: ['search', 'projection'],
  },
  {
    id: 'request-backpressure',
    title: 'Request backpressure',
    track: 'data',
    complexity: 5,
    sessions: 3,
    tags: ['network', 'load'],
  },
  {
    id: 'route-shell',
    title: 'Route shell persistence',
    track: 'routing',
    complexity: 3,
    sessions: 2,
    tags: ['router', 'shell'],
  },
  {
    id: 'data-router-actions',
    title: 'Data router actions',
    track: 'routing',
    complexity: 4,
    sessions: 3,
    tags: ['forms', 'actions'],
  },
  {
    id: 'nested-stream',
    title: 'Nested screen transitions',
    track: 'routing',
    complexity: 4,
    sessions: 2,
    tags: ['nested', 'transitions'],
  },
  {
    id: 'auth-redirect',
    title: 'Auth redirect continuity',
    track: 'routing',
    complexity: 3,
    sessions: 2,
    tags: ['auth', 'redirect'],
  },
  {
    id: 'field-validation',
    title: 'Field validation cadence',
    track: 'forms',
    complexity: 3,
    sessions: 2,
    tags: ['validation', 'input'],
  },
  {
    id: 'draft-presence',
    title: 'Draft presence indicators',
    track: 'forms',
    complexity: 4,
    sessions: 2,
    tags: ['draft', 'feedback'],
  },
  {
    id: 'submit-feedback',
    title: 'Submit feedback loops',
    track: 'forms',
    complexity: 4,
    sessions: 3,
    tags: ['submit', 'ux'],
  },
  {
    id: 'wizard-steps',
    title: 'Wizard step orchestration',
    track: 'forms',
    complexity: 5,
    sessions: 4,
    tags: ['wizard', 'navigation'],
  },
  {
    id: 'list-windowing',
    title: 'List windowing heuristics',
    track: 'render',
    complexity: 5,
    sessions: 3,
    tags: ['list', 'heavy'],
  },
  {
    id: 'selector-budget',
    title: 'Selector budget management',
    track: 'data',
    complexity: 4,
    sessions: 2,
    tags: ['selector', 'state'],
  },
  {
    id: 'prefetch-journeys',
    title: 'Prefetch user journeys',
    track: 'routing',
    complexity: 3,
    sessions: 2,
    tags: ['prefetch', 'navigation'],
  },
  {
    id: 'autosave-signals',
    title: 'Autosave background signals',
    track: 'forms',
    complexity: 5,
    sessions: 3,
    tags: ['autosave', 'background'],
  },
];

function expensiveScore(item: SearchItem, intensity: number) {
  let score = 0;

  for (let spin = 0; spin < intensity * 1200; spin += 1) {
    score += (item.complexity * ((spin % 7) + 1) + item.sessions) % 11;
  }

  return score;
}

export function projectSearchResults(input: {
  query: string;
  track: SearchTrack;
  sort: SearchSort;
  intensity: number;
}) {
  const normalizedQuery = input.query.trim().toLowerCase();
  let operations = 0;

  const enriched = concurrentCatalog
    .filter((item) => input.track === 'all' || item.track === input.track)
    .map((item) => {
      operations += input.intensity * 1200;
      const syntheticScore = expensiveScore(item, input.intensity);
      const haystack = `${item.title} ${item.track} ${item.tags.join(' ')}`.toLowerCase();
      const matches = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

      return {
        item,
        matches,
        syntheticScore,
      };
    })
    .filter((entry) => entry.matches);

  const sorted = [...enriched].sort((left, right) => {
    if (input.sort === 'sessions') {
      return right.item.sessions - left.item.sessions;
    }

    if (input.sort === 'complexity') {
      return right.item.complexity - left.item.complexity;
    }

    return right.syntheticScore - left.syntheticScore;
  });

  const visibleItems = sorted.map((entry) => entry.item);
  const totalSessions = visibleItems.reduce((sum, item) => sum + item.sessions, 0);

  return {
    visibleItems,
    operations,
    totalSessions,
    summary: `${visibleItems.length} items / ${totalSessions} sessions`,
  };
}
