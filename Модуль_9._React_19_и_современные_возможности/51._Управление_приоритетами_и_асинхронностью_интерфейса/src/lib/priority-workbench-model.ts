export type Domain = 'all' | 'forms' | 'server' | 'routing' | 'compiler';
export type FocusPreset = 'forms' | 'server' | 'compiler';

export type WorkbenchItem = {
  id: string;
  title: string;
  domain: Exclude<Domain, 'all'>;
  summary: string;
  tags: readonly string[];
};

export const workbenchItems: readonly WorkbenchItem[] = [
  {
    id: 'forms-transition',
    title: 'Split urgent input from heavy validation preview',
    domain: 'forms',
    summary:
      'Держите echo ввода срочным, а expensive preview переносите в background update.',
    tags: ['forms', 'pending', 'validation'],
  },
  {
    id: 'forms-status',
    title: 'Preserve typing responsiveness in multi-step forms',
    domain: 'forms',
    summary: 'Вторичные calculations не должны блокировать текстовый ввод и курсор.',
    tags: ['forms', 'typing', 'priority'],
  },
  {
    id: 'server-search',
    title: 'Filter cached server state without freezing search box',
    domain: 'server',
    summary: 'Список может лагать, но input и фильтры должны оставаться управляемыми.',
    tags: ['server', 'search', 'deferred'],
  },
  {
    id: 'server-queue',
    title: 'Re-sort mutation queue in background',
    domain: 'server',
    summary:
      'Перестройка secondary view может быть non-urgent относительно пользовательского ввода.',
    tags: ['server', 'queue', 'transition'],
  },
  {
    id: 'routing-tabs',
    title: 'Keep sidebar controls urgent while route-adjacent preview changes',
    domain: 'routing',
    summary: 'Вкладки и локальные фильтры могут жить разным приоритетом.',
    tags: ['routing', 'tabs', 'sidebar'],
  },
  {
    id: 'routing-tree',
    title: 'Hide nested inspector without losing local draft',
    domain: 'routing',
    summary:
      'Visibility management важен, когда вложенный экран должен вернуться в прежнем состоянии.',
    tags: ['routing', 'visibility', 'activity'],
  },
  {
    id: 'compiler-profiler',
    title: 'Profile non-urgent analysis separately from input echo',
    domain: 'compiler',
    summary: 'Тяжёлая аналитика не должна притворяться urgent update.',
    tags: ['compiler', 'analysis', 'transition'],
  },
  {
    id: 'compiler-stream',
    title: 'Keep external stream subscription stable while theme changes',
    domain: 'compiler',
    summary:
      'useEffectEvent полезен там, где внешний listener не должен пересоздаваться ради оформления.',
    tags: ['compiler', 'subscription', 'effect-event'],
  },
] as const;

export const focusPresets: readonly {
  id: FocusPreset;
  label: string;
  query: string;
  domain: Domain;
}[] = [
  { id: 'forms', label: 'Forms', query: 'forms', domain: 'forms' },
  { id: 'server', label: 'Server', query: 'queue', domain: 'server' },
  { id: 'compiler', label: 'Compiler', query: 'stream', domain: 'compiler' },
] as const;

function scoreText(title: string, summary: string, query: string) {
  if (!query.trim()) {
    return 1;
  }

  const source = `${title} ${summary}`.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  let score = source.includes(normalizedQuery) ? 16 : 0;

  for (let index = 0; index < source.length; index += 1) {
    score += source.charCodeAt(index) % 5;
  }

  for (let step = 0; step < 220; step += 1) {
    score = (score * 7 + normalizedQuery.length + step) % 997;
  }

  return score;
}

export function filterWorkbenchItems(query: string, domain: Domain) {
  return workbenchItems
    .filter((item) => domain === 'all' || item.domain === domain)
    .map((item) => ({
      item,
      score: scoreText(item.title, item.summary, query),
    }))
    .filter(({ item, score }) => {
      if (!query.trim()) {
        return true;
      }

      const haystack =
        `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase();
      return haystack.includes(query.toLowerCase()) || score > 200;
    })
    .sort((left, right) => right.score - left.score)
    .map(({ item }) => item);
}

export function summarizeDeferredState(query: string, deferredQuery: string) {
  if (!query.trim() && !deferredQuery.trim()) {
    return 'idle';
  }

  return query === deferredQuery ? 'fresh' : 'lagging';
}
