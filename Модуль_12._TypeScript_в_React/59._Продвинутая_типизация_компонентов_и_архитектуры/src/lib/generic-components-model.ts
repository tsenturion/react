export type EndpointRecord = {
  id: string;
  path: string;
  latencyMs: number;
  owner: string;
  auth: 'required' | 'optional';
};

export type TokenRecord = {
  id: string;
  name: string;
  value: string;
  category: 'color' | 'space' | 'radius';
  status: 'stable' | 'beta';
};

export type ScenarioDescriptor<T> = {
  id: string;
  title: string;
  blurb: string;
  items: readonly T[];
  emptyMessage: string;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getMeta: (item: T) => string;
  matches: (item: T, query: string) => boolean;
  inspect: (item: T) => readonly { label: string; value: string }[];
};

export const endpointScenario: ScenarioDescriptor<EndpointRecord> = {
  id: 'endpoints',
  title: 'API endpoints',
  blurb: 'Generic list работает с route-like сущностями и typed inspection панели.',
  items: [
    {
      id: 'endpoint-1',
      path: '/api/reviews',
      latencyMs: 142,
      owner: 'Platform',
      auth: 'required',
    },
    {
      id: 'endpoint-2',
      path: '/api/catalog',
      latencyMs: 88,
      owner: 'Commerce',
      auth: 'optional',
    },
    {
      id: 'endpoint-3',
      path: '/api/releases',
      latencyMs: 215,
      owner: 'Release',
      auth: 'required',
    },
  ],
  emptyMessage: 'По этому фильтру endpoints не нашлось.',
  getId: (item) => item.id,
  getLabel: (item) => item.path,
  getMeta: (item) => `${item.owner} · ${item.latencyMs}ms`,
  matches: (item, query) =>
    `${item.path} ${item.owner} ${item.auth}`.toLowerCase().includes(query.toLowerCase()),
  inspect: (item) => [
    { label: 'Owner', value: item.owner },
    { label: 'Latency', value: `${item.latencyMs} ms` },
    { label: 'Auth', value: item.auth },
  ],
};

export const tokenScenario: ScenarioDescriptor<TokenRecord> = {
  id: 'tokens',
  title: 'Design tokens',
  blurb:
    'Тот же generic list работает и с tokens, где уже другой shape и другой detail view.',
  items: [
    {
      id: 'token-1',
      name: 'surface.brand',
      value: '#0f62fe',
      category: 'color',
      status: 'stable',
    },
    {
      id: 'token-2',
      name: 'space.6',
      value: '24px',
      category: 'space',
      status: 'stable',
    },
    {
      id: 'token-3',
      name: 'radius.card',
      value: '28px',
      category: 'radius',
      status: 'beta',
    },
  ],
  emptyMessage: 'Подходящих tokens не найдено.',
  getId: (item) => item.id,
  getLabel: (item) => item.name,
  getMeta: (item) => `${item.category} · ${item.status}`,
  matches: (item, query) =>
    `${item.name} ${item.value} ${item.category} ${item.status}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  inspect: (item) => [
    { label: 'Value', value: item.value },
    { label: 'Category', value: item.category },
    { label: 'Status', value: item.status },
  ],
};

export const genericScenarioIds = ['endpoints', 'tokens'] as const;
export type GenericScenarioId = (typeof genericScenarioIds)[number];

export function parseGenericScenarioId(value: string | null): GenericScenarioId {
  return value === 'tokens' ? 'tokens' : 'endpoints';
}

export function filterCollection<T>(
  items: readonly T[],
  query: string,
  matcher: (item: T, normalizedQuery: string) => boolean,
): readonly T[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => matcher(item, normalizedQuery));
}

export function resolveSelection<T>(
  items: readonly T[],
  selectedId: string | null,
  getId: (item: T) => string,
): T | null {
  if (!items.length) {
    return null;
  }

  if (!selectedId) {
    return items[0];
  }

  return items.find((item) => getId(item) === selectedId) ?? items[0];
}

export const genericListSnippet = `type ExplorerListProps<T> = {
  items: readonly T[];
  getId: (item: T) => string;
  renderPrimary: (item: T) => ReactNode;
  renderMeta: (item: T) => ReactNode;
  onSelect: (item: T) => void;
};`;

export const genericScenarioSnippet = `const endpointScenario: ScenarioDescriptor<EndpointRecord> = {
  getId: (item) => item.id,
  getLabel: (item) => item.path,
  getMeta: (item) => \`\${item.owner} · \${item.latencyMs}ms\`,
};`;
