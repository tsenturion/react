export type StreamingProfileId = 'news' | 'search' | 'product';
export type SegmentId = 'hero' | 'filters' | 'results';

export type StreamingSegment = {
  id: SegmentId;
  label: string;
  serverDelayMs: number;
  hydrateCostMs: number;
};

export type StreamingProfile = {
  id: StreamingProfileId;
  label: string;
  note: string;
  shellDelayMs: number;
  segments: readonly StreamingSegment[];
};

export type StreamingSimulation = {
  shellVisibleMs: number;
  defaultOrder: SegmentId[];
  selectiveOrder: SegmentId[];
  selectedBenefitMs: number;
  rows: {
    id: SegmentId;
    label: string;
    streamedAtMs: number;
    defaultHydratedAtMs: number;
    selectiveHydratedAtMs: number;
  }[];
  timeline: {
    atMs: number;
    phase: 'shell' | 'stream' | 'hydrate-default' | 'hydrate-selective';
    label: string;
  }[];
};

export const streamingProfiles: readonly StreamingProfile[] = [
  {
    id: 'news',
    label: 'News home',
    note: 'Главный headline нужен быстро, а связанные блоки могут приходить по мере готовности.',
    shellDelayMs: 90,
    segments: [
      { id: 'hero', label: 'Headline', serverDelayMs: 120, hydrateCostMs: 60 },
      { id: 'filters', label: 'Topic rail', serverDelayMs: 180, hydrateCostMs: 40 },
      { id: 'results', label: 'Related feed', serverDelayMs: 320, hydrateCostMs: 90 },
    ],
  },
  {
    id: 'search',
    label: 'Search results',
    note: 'Shell и фильтры должны появиться рано, а большой список может стримиться отдельно.',
    shellDelayMs: 110,
    segments: [
      { id: 'hero', label: 'Query summary', serverDelayMs: 80, hydrateCostMs: 35 },
      { id: 'filters', label: 'Facet sidebar', serverDelayMs: 150, hydrateCostMs: 55 },
      { id: 'results', label: 'Results list', serverDelayMs: 420, hydrateCostMs: 120 },
    ],
  },
  {
    id: 'product',
    label: 'Product page',
    note: 'Hero должен быть сразу, отзывы и блок сопутствующих товаров могут отставать.',
    shellDelayMs: 85,
    segments: [
      { id: 'hero', label: 'Product hero', serverDelayMs: 100, hydrateCostMs: 45 },
      { id: 'filters', label: 'Purchase panel', serverDelayMs: 140, hydrateCostMs: 65 },
      { id: 'results', label: 'Reviews', serverDelayMs: 360, hydrateCostMs: 95 },
    ],
  },
] as const;

function computeHydrationMoments(
  order: readonly SegmentId[],
  readyMap: Map<SegmentId, number>,
  costMap: Map<SegmentId, number>,
  jsBootMs: number,
): Map<SegmentId, number> {
  // Гидрация не может начаться раньше, чем приехал chunk и чем загрузился клиентский JS.
  let cursor = jsBootMs;
  const result = new Map<SegmentId, number>();

  for (const id of order) {
    cursor = Math.max(cursor, readyMap.get(id) ?? cursor);
    cursor += costMap.get(id) ?? 0;
    result.set(id, cursor);
  }

  return result;
}

export function simulateStreamingHydration(params: {
  profileId: StreamingProfileId;
  networkMs: number;
  jsBootMs: number;
  selectedSegment: SegmentId | 'none';
}): StreamingSimulation {
  const profile =
    streamingProfiles.find((item) => item.id === params.profileId) ??
    streamingProfiles[0];
  const shellVisibleMs = Math.round(params.networkMs + profile.shellDelayMs);
  const readyMap = new Map<SegmentId, number>();
  const costMap = new Map<SegmentId, number>();

  for (const segment of profile.segments) {
    readyMap.set(segment.id, shellVisibleMs + segment.serverDelayMs);
    costMap.set(segment.id, segment.hydrateCostMs);
  }

  const defaultOrder = profile.segments.map((segment) => segment.id);
  // Selective hydration здесь моделируется как перестановка приоритетов:
  // выбранный пользователем island гидратируется первым, а не ждёт механического DOM order.
  const selectiveOrder =
    params.selectedSegment === 'none'
      ? defaultOrder
      : [
          params.selectedSegment,
          ...defaultOrder.filter((id) => id !== params.selectedSegment),
        ];

  const defaultHydration = computeHydrationMoments(
    defaultOrder,
    readyMap,
    costMap,
    params.networkMs + params.jsBootMs,
  );
  const selectiveHydration = computeHydrationMoments(
    selectiveOrder,
    readyMap,
    costMap,
    params.networkMs + params.jsBootMs,
  );

  const rows = profile.segments.map((segment) => ({
    id: segment.id,
    label: segment.label,
    streamedAtMs: readyMap.get(segment.id) ?? shellVisibleMs,
    defaultHydratedAtMs: defaultHydration.get(segment.id) ?? shellVisibleMs,
    selectiveHydratedAtMs: selectiveHydration.get(segment.id) ?? shellVisibleMs,
  }));

  const selectedBenefitMs =
    params.selectedSegment === 'none'
      ? 0
      : Math.max(
          0,
          (defaultHydration.get(params.selectedSegment) ?? 0) -
            (selectiveHydration.get(params.selectedSegment) ?? 0),
        );

  const timeline = [
    { atMs: shellVisibleMs, phase: 'shell' as const, label: 'Shell HTML виден' },
    ...rows.flatMap((row) => [
      {
        atMs: row.streamedAtMs,
        phase: 'stream' as const,
        label: `${row.label} пришёл из сервера`,
      },
      {
        atMs: row.defaultHydratedAtMs,
        phase: 'hydrate-default' as const,
        label: `${row.label} гидратирован по обычному порядку`,
      },
      {
        atMs: row.selectiveHydratedAtMs,
        phase: 'hydrate-selective' as const,
        label: `${row.label} гидратирован с учётом пользовательского намерения`,
      },
    ]),
  ].sort((left, right) => left.atMs - right.atMs);

  return {
    shellVisibleMs,
    defaultOrder,
    selectiveOrder,
    selectedBenefitMs,
    rows,
    timeline,
  };
}
