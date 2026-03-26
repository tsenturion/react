import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока сразу раскладывает тему на execution, async server, composition, trade-offs и playbook.',
      },
      {
        path: 'src/lib/rsc-overview-domain.ts',
        note: 'Карточки overview и URL-driven focus для обзорной страницы.',
      },
      {
        path: 'src/server/rsc-runtime.ts',
        note: 'Flight-like runtime report, который показывает mixed tree уже на уровне серверной модели.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Маршруты урока выражают не UI-меню, а архитектурные лаборатории про server/client boundaries.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/rsc-overview?focus=all' },
  { id: 'execution', href: '/execution-boundaries' },
  { id: 'async-server', href: '/async-server-components' },
  { id: 'composition', href: '/server-client-composition' },
  { id: 'tradeoffs', href: '/bundle-and-data-tradeoffs' },
  { id: 'playbook', href: '/rsc-playbook' },
] as const;`,
      },
      {
        label: 'Overview focus parsing',
        note: 'Фокус обзорной страницы хранится в URL и позволяет смотреть тему по архитектурным аспектам.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'execution' ||
    value === 'async' ||
    value === 'composition' ||
    value === 'bundle' ||
    value === 'mindset'
  ) {
    return value;
  }

  return 'all';
}`,
      },
    ],
  },
  execution: {
    files: [
      {
        path: 'src/components/rsc-labs/ExecutionBoundaryLab.tsx',
        note: 'Свободная карта server/client placement для шести узлов экрана.',
      },
      {
        path: 'src/lib/rsc-boundary-model.ts',
        note: 'Предметная модель узлов, presets и расчёт bundle/hydration/bridge-стоимости.',
      },
      {
        path: 'src/lib/rsc-tradeoff-model.ts',
        note: 'Сравнение preset-архитектур на основе общей boundary модели.',
      },
    ],
    snippets: [
      {
        label: 'Boundary analysis',
        note: 'Один и тот же узел оценивается не только по названию слоя, но и по последствиям этого выбора.',
        code: `if (layer === 'client') {
  clientBundleKb += node.clientBundleKb;
  hydrationUnits += 1;

  if (node.needsServerBridgeWhenClient) {
    bridgeCount += 1;
  }
}

if (layer === 'server' && node.needsClientHooks) {
  invalidCount += 1;
}`,
      },
      {
        label: 'Preset workspace',
        note: 'Урок хранит готовые архитектурные presets как явные boundary maps, а не как неявную логику в UI.',
        code: `workspace: {
  'page-shell': 'server',
  'lesson-metrics': 'server',
  'filter-form': 'client',
  'live-search': 'client',
  'bookmark-toggle': 'client',
  'recommendation-grid': 'server',
},`,
      },
    ],
  },
  'async-server': {
    files: [
      {
        path: 'src/components/rsc-labs/AsyncServerComponentsLab.tsx',
        note: 'Интерактивное сравнение async server component, split boundary и client fetch.',
      },
      {
        path: 'src/lib/async-server-model.ts',
        note: 'Тайминги HTML, data-ready и interactive для разных async-стратегий.',
      },
      {
        path: 'src/server/rsc-runtime.ts',
        note: 'Серверная модель, где async server nodes попадают в flight-like report.',
      },
    ],
    snippets: [
      {
        label: 'Strategy comparison',
        note: 'Модель сравнивает не абстрактные “плюсы/минусы”, а конкретные временные точки для каждой стратегии.',
        code: `return [
  {
    id: 'server-component',
    htmlShellMs: input.networkMs + scenario.serverWorkMs,
    dataReadyMs: input.networkMs + scenario.serverWorkMs,
    interactiveMs: input.networkMs + scenario.serverWorkMs + input.jsBootMs,
  },
  {
    id: 'client-fetch',
    dataReadyMs: input.networkMs + input.jsBootMs + scenario.clientFetchMs,
  },
];`,
      },
      {
        label: 'Flight-like runtime row',
        note: 'Async server узел попадает в отчёт после ожидания, а client узел превращается в island с bundle-стоимостью.',
        code: `if (node.layer === 'server' && node.asyncMs) {
  await wait(node.asyncMs);
}

rows.push({
  id: node.id,
  layer: node.layer,
  readyAtMs: Date.now() - startedAt,
});`,
      },
    ],
  },
  composition: {
    files: [
      {
        path: 'src/components/rsc-labs/CompositionBoundaryLab.tsx',
        note: 'Sandbox для import/slot-композиции между server и client слоями.',
      },
      {
        path: 'src/lib/rsc-composition-model.ts',
        note: 'Правила допустимой и недопустимой mixed composition.',
      },
      {
        path: 'src/router.tsx',
        note: 'Shell проекта сам подчёркивает идею mixed tree и boundary contract.',
      },
    ],
    snippets: [
      {
        label: 'Invalid client import',
        note: 'Главная архитектурная ошибка RSC — прямой import server child из client host.',
        code: `if (hostLayer === 'client' && childLayer === 'server' && linkMode === 'import') {
  tone = 'error';
  headline = 'Client component не может импортировать server component';
}`,
      },
      {
        label: 'Slot composition',
        note: 'Server parent может собрать server child заранее и передать его client host как children.',
        code: `if (hostLayer === 'client' && childLayer === 'server' && linkMode === 'slot') {
  tone = 'success';
  headline = 'Это допустимая mixed composition';
}`,
      },
    ],
  },
  tradeoffs: {
    files: [
      {
        path: 'src/components/rsc-labs/BundleTradeoffLab.tsx',
        note: 'Сравнение server-first, balanced islands и client-heavy как готовых архитектур.',
      },
      {
        path: 'src/lib/rsc-tradeoff-model.ts',
        note: 'Сравнение preset-профилей и объяснение давления на bundle.',
      },
      {
        path: 'src/lib/rsc-boundary-model.ts',
        note: 'Общий источник правды для оценки каждого preset.',
      },
    ],
    snippets: [
      {
        label: 'Preset comparison',
        note: 'Trade-off страница работает не на отдельных цифрах, а на сравнении законченных архитектурных профилей.',
        code: `return (Object.keys(boundaryPresets) as BoundaryPresetId[]).map((presetId) => {
  const preset = boundaryPresets[presetId];
  const report = analyzeBoundaryWorkspace(preset.workspace);

  return {
    presetId,
    clientBundleKb: report.clientBundleKb,
    hydrationUnits: report.hydrationUnits,
  };
});`,
      },
      {
        label: 'Bundle pressure text',
        note: 'Пороговые уровни помогают читать стоимость архитектуры не как “много/мало”, а как конкретную фазу деградации.',
        code: `if (clientBundleKb <= 40) {
  return 'Bundle остаётся узким';
}

if (clientBundleKb <= 80) {
  return 'Bundle ещё контролируем';
}

return 'Bundle стал тяжёлым';`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/rsc-labs/RscPlaybookLab.tsx',
        note: 'Интерактивный playbook по выбору boundary strategy.',
      },
      {
        path: 'src/lib/rsc-playbook-model.ts',
        note: 'Правила выбора между server default, client island, slot composition и client-heavy subtree.',
      },
      {
        path: 'src/server/rsc-runtime.ts',
        note: 'Серверный runtime напоминает, что mixed tree нужно подтверждать не только UI-логикой, но и server-side моделью.',
      },
    ],
    snippets: [
      {
        label: 'Playbook branch',
        note: 'Если нужны browser APIs или live typing, playbook оставляет shell server и выносит только interactive зону в island.',
        code: `if (input.requiresBrowserApi || input.needsLiveTyping) {
  if (input.parentMostlyStatic) {
    return {
      primaryPattern: 'client-island',
      title: 'Оставьте parent server, а interactive зону вынесите в узкий client island',
    };
  }
}`,
      },
      {
        label: 'Server-default branch',
        note: 'Приватные данные плюс желание отправить минимум JS ведут к server-default стратегии.',
        code: `if (input.readsPrivateData && input.wantsMinimalBundle) {
  return {
    primaryPattern: 'server-default',
    title: 'Держите блок на сервере по умолчанию',
  };
}`,
      },
    ],
  },
};
