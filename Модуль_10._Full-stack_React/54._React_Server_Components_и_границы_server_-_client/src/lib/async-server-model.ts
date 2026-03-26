export type AsyncScenarioId = 'catalog' | 'workspace' | 'account';
export type AsyncStrategyId = 'server-component' | 'split-boundary' | 'client-fetch';

export type AsyncScenario = {
  id: AsyncScenarioId;
  label: string;
  serverWorkMs: number;
  clientFetchMs: number;
  privateDataNote: string;
};

export const asyncScenarios: readonly AsyncScenario[] = [
  {
    id: 'catalog',
    label: 'Catalog page',
    serverWorkMs: 180,
    clientFetchMs: 260,
    privateDataNote:
      'Цены, остатки и персональные рекомендации удобнее читать рядом с серверным кэшем.',
  },
  {
    id: 'workspace',
    label: 'Authoring workspace',
    serverWorkMs: 140,
    clientFetchMs: 210,
    privateDataNote:
      'Черновики и права доступа лучше собирать до hydration, а editor islands гидрировать отдельно.',
  },
  {
    id: 'account',
    label: 'Account overview',
    serverWorkMs: 160,
    clientFetchMs: 230,
    privateDataNote:
      'Профиль, квоты и billing summary относятся к приватным данным и редко выигрывают от client fetch как стартовой стратегии.',
  },
] as const;

export function getAsyncScenario(id: AsyncScenarioId): AsyncScenario {
  return asyncScenarios.find((scenario) => scenario.id === id) ?? asyncScenarios[0];
}

export function compareAsyncStrategies(input: {
  scenarioId: AsyncScenarioId;
  networkMs: number;
  jsBootMs: number;
}) {
  const scenario = getAsyncScenario(input.scenarioId);

  return [
    {
      id: 'server-component' as const,
      label: 'Async server component',
      htmlShellMs: input.networkMs + scenario.serverWorkMs,
      dataReadyMs: input.networkMs + scenario.serverWorkMs,
      interactiveMs: input.networkMs + scenario.serverWorkMs + input.jsBootMs,
      clientBundleKb: 18,
      waterfall: 'request -> server data read -> HTML with content -> hydrate islands',
      why: 'Данные появляются вместе с первым meaningful HTML. Клиент гидрирует только islands, которым реально нужна интерактивность.',
    },
    {
      id: 'split-boundary' as const,
      label: 'Server page + client island',
      htmlShellMs: input.networkMs + Math.round(scenario.serverWorkMs * 0.7),
      dataReadyMs: input.networkMs + Math.round(scenario.serverWorkMs * 0.7),
      interactiveMs:
        input.networkMs + Math.round(scenario.serverWorkMs * 0.7) + input.jsBootMs,
      clientBundleKb: 26,
      waterfall:
        'request -> server shell and data blocks -> HTML -> hydrate only client island',
      why: 'Основная data-heavy часть остаётся server, а локальная интерактивность живёт в узком client boundary.',
    },
    {
      id: 'client-fetch' as const,
      label: 'Client fetch after hydrate',
      htmlShellMs: input.networkMs + 20,
      dataReadyMs: input.networkMs + input.jsBootMs + scenario.clientFetchMs,
      interactiveMs: input.networkMs + input.jsBootMs,
      clientBundleKb: 44,
      waterfall: 'request -> HTML shell -> JS boot -> client fetch -> render data',
      why: 'Подходит только там, где данные по-настоящему зависят от client state. Иначе появляется лишний fetch waterfall и более тяжёлый bundle.',
    },
  ] as const;
}
