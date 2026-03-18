import type { StatusTone } from './common';

export type EntryFlowConfig = {
  htmlHasRoot: boolean;
  rootIdMatches: boolean;
  scriptLoads: boolean;
  useCreateRoot: boolean;
  wrapsStrictMode: boolean;
};

export type EntryStage = {
  id: string;
  label: string;
  detail: string;
  status: 'done' | 'warn' | 'error';
};

export function analyzeEntryFlow(config: EntryFlowConfig) {
  const stages: EntryStage[] = [
    {
      id: 'html',
      label: 'index.html',
      detail: config.htmlHasRoot
        ? 'HTML-страница содержит mount container для React Root.'
        : 'В HTML нет контейнера, в который React может смонтироваться.',
      status: config.htmlHasRoot ? 'done' : 'error',
    },
    {
      id: 'script',
      label: 'type="module" script',
      detail: config.scriptLoads
        ? 'Браузер выполняет `src/main.tsx` как входной модуль.'
        : 'Входной модуль не исполняется, значит React вообще не стартует.',
      status: config.scriptLoads ? 'done' : 'error',
    },
    {
      id: 'lookup',
      label: 'document.getElementById',
      detail:
        config.htmlHasRoot && config.rootIdMatches
          ? 'Поиск контейнера возвращает DOM-узел.'
          : 'ID контейнера не совпадает, поэтому `getElementById` вернёт `null`.',
      status: config.htmlHasRoot && config.rootIdMatches ? 'done' : 'error',
    },
    {
      id: 'create-root',
      label: 'createRoot(container)',
      detail: config.useCreateRoot
        ? 'React создаёт отдельный React Root поверх выбранного DOM-контейнера.'
        : 'Без `createRoot` современное React-приложение на клиенте не монтируется.',
      status: config.useCreateRoot ? 'done' : 'error',
    },
    {
      id: 'render',
      label: 'root.render(...)',
      detail:
        config.htmlHasRoot &&
        config.rootIdMatches &&
        config.scriptLoads &&
        config.useCreateRoot
          ? config.wrapsStrictMode
            ? 'Поддерево рендерится и одновременно получает dev-only проверки StrictMode.'
            : 'Поддерево рендерится, но без дополнительных StrictMode-проверок в development.'
          : 'До финального рендера цепочка не доходит, потому что один из ранних этапов уже сломан.',
      status:
        config.htmlHasRoot &&
        config.rootIdMatches &&
        config.scriptLoads &&
        config.useCreateRoot
          ? config.wrapsStrictMode
            ? 'done'
            : 'warn'
          : 'error',
    },
  ];

  const blockers = [
    ...(!config.htmlHasRoot ? ['В `index.html` отсутствует контейнер `#root`.'] : []),
    ...(config.htmlHasRoot && !config.rootIdMatches
      ? ['ID контейнера в HTML и `getElementById(...)` не совпадают.']
      : []),
    ...(!config.scriptLoads
      ? ['Браузер не исполняет входной модуль `src/main.tsx`.']
      : []),
    ...(!config.useCreateRoot
      ? ['Клиентский React Root не создаётся, значит `root.render(...)` вызвать некуда.']
      : []),
  ];

  const visibleResult =
    blockers.length > 0
      ? 'Экран не доходит до React-приложения: цепочка обрывается до монтирования.'
      : config.wrapsStrictMode
        ? 'Приложение входит в HTML-страницу через React Root и получает StrictMode-проверки в development.'
        : 'Приложение входит в HTML-страницу через React Root, но без StrictMode dev-checks.';

  const tone: StatusTone =
    blockers.length > 0 ? 'error' : config.wrapsStrictMode ? 'success' : 'warn';

  return {
    tone,
    stages,
    blockers,
    successfulStages: stages.filter((stage) => stage.status === 'done').length,
    warnings: stages.filter((stage) => stage.status === 'warn').length,
    visibleResult,
    mistakes: [
      'Пытаться монтировать React без контейнера в `index.html`.',
      'Считать, что `App.tsx` сам по себе попадает в браузер без `main.tsx` и `createRoot(...)`.',
      'Забывать, что `StrictMode` влияет только на development-checks и не является production-обязательным шагом.',
    ],
  };
}
