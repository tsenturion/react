export type ServerScenarioId = 'article' | 'workspace' | 'catalog';
export type StrategyId = 'client-only' | 'server-suspense' | 'streaming';

type Boundary = {
  id: string;
  label: string;
  dataDelayMs: number;
  hydrateMs: number;
};

type Scenario = {
  id: ServerScenarioId;
  label: string;
  note: string;
  shellDelayMs: number;
  boundaries: readonly Boundary[];
};

export type StrategyReport = {
  strategy: StrategyId;
  label: string;
  htmlVisibleMs: number;
  firstUsefulMs: number;
  interactiveMs: number;
  waitingModel: string;
  rows: {
    id: string;
    label: string;
    serverVisibleMs: number;
    interactiveMs: number;
  }[];
};

export const serverScenarios: readonly Scenario[] = [
  {
    id: 'article',
    label: 'Editorial article',
    note: 'Hero и body должны приехать рано, related block может догонять.',
    shellDelayMs: 90,
    boundaries: [
      { id: 'hero', label: 'Hero', dataDelayMs: 60, hydrateMs: 35 },
      { id: 'body', label: 'Body', dataDelayMs: 180, hydrateMs: 60 },
      { id: 'related', label: 'Related', dataDelayMs: 360, hydrateMs: 80 },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    note: 'Shell и навигация нужны рано, аналитические виджеты могут отставать.',
    shellDelayMs: 110,
    boundaries: [
      { id: 'nav', label: 'Navigation', dataDelayMs: 40, hydrateMs: 30 },
      { id: 'summary', label: 'Summary', dataDelayMs: 150, hydrateMs: 55 },
      { id: 'insights', label: 'Insights', dataDelayMs: 420, hydrateMs: 110 },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    note: 'Query summary и фильтры важны сразу, тяжёлый список может стримиться позже.',
    shellDelayMs: 95,
    boundaries: [
      { id: 'summary', label: 'Query summary', dataDelayMs: 70, hydrateMs: 30 },
      { id: 'filters', label: 'Filters', dataDelayMs: 130, hydrateMs: 50 },
      { id: 'results', label: 'Results', dataDelayMs: 390, hydrateMs: 120 },
    ],
  },
] as const;

export function getServerScenario(id: ServerScenarioId): Scenario {
  return serverScenarios.find((item) => item.id === id) ?? serverScenarios[0];
}

export function compareServerSuspenseStrategies(params: {
  scenarioId: ServerScenarioId;
  networkMs: number;
  jsBootMs: number;
  serverMs: number;
}): StrategyReport[] {
  const scenario = getServerScenario(params.scenarioId);
  const slowestData = Math.max(...scenario.boundaries.map((item) => item.dataDelayMs));
  const slowestHydrate = Math.max(...scenario.boundaries.map((item) => item.hydrateMs));
  const shellVisibleMs = params.networkMs + scenario.shellDelayMs;

  const reports: StrategyReport[] = [
    {
      strategy: 'client-only',
      label: 'Client wait',
      htmlVisibleMs: params.networkMs + params.jsBootMs + slowestData,
      firstUsefulMs: params.networkMs + params.jsBootMs + slowestData,
      interactiveMs: params.networkMs + params.jsBootMs + slowestData + slowestHydrate,
      waitingModel:
        'До загрузки JS и данных полезный HTML почти не виден: клиент строит экран после старта приложения.',
      rows: scenario.boundaries.map((boundary) => ({
        id: boundary.id,
        label: boundary.label,
        serverVisibleMs: params.networkMs + params.jsBootMs + boundary.dataDelayMs,
        interactiveMs:
          params.networkMs + params.jsBootMs + boundary.dataDelayMs + boundary.hydrateMs,
      })),
    },
    {
      strategy: 'server-suspense',
      label: 'SSR + fallback',
      htmlVisibleMs: params.networkMs + params.serverMs,
      firstUsefulMs: params.networkMs + params.serverMs,
      interactiveMs:
        params.networkMs + params.serverMs + params.jsBootMs + slowestHydrate,
      waitingModel:
        'Сервер отдаёт shell и fallback сразу, но сами boundaries доезжают уже после готовности данных.',
      rows: scenario.boundaries.map((boundary) => ({
        id: boundary.id,
        label: boundary.label,
        serverVisibleMs: params.networkMs + params.serverMs + boundary.dataDelayMs,
        interactiveMs:
          params.networkMs + params.serverMs + params.jsBootMs + boundary.hydrateMs,
      })),
    },
    {
      strategy: 'streaming',
      label: 'Streaming SSR',
      htmlVisibleMs: shellVisibleMs,
      firstUsefulMs: shellVisibleMs,
      interactiveMs: shellVisibleMs + params.jsBootMs + slowestHydrate,
      waitingModel:
        'Shell flush-ится раньше, а отдельные boundaries раскрываются по готовности без ожидания самого медленного блока.',
      rows: scenario.boundaries.map((boundary) => ({
        id: boundary.id,
        label: boundary.label,
        serverVisibleMs: shellVisibleMs + boundary.dataDelayMs,
        interactiveMs: shellVisibleMs + params.jsBootMs + boundary.hydrateMs,
      })),
    },
  ];

  return reports;
}
