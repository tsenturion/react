import type { LabId } from './learning-model';

export type ReviewTrack = 'all' | 'core' | 'state' | 'effects' | 'architecture';
export type Priority = 'low' | 'medium' | 'high';

export type BoardItem = {
  id: string;
  title: string;
  track: Exclude<ReviewTrack, 'all'>;
  owner: string;
  resolved: boolean;
  priority: Priority;
  note: string;
};

export const reviewBoardSeed: readonly BoardItem[] = [
  {
    id: 'redux-1',
    title: 'Разделить selectors для toolbar и inspector',
    track: 'architecture',
    owner: 'Mira',
    resolved: false,
    priority: 'high',
    note: 'Selectors должны отражать срезы состояния, а не отдавать весь store подряд.',
  },
  {
    id: 'redux-2',
    title: 'Свести действия к понятным intent names',
    track: 'core',
    owner: 'Oleg',
    resolved: false,
    priority: 'medium',
    note: 'Action type должен описывать намерение, а не копировать setSomething.',
  },
  {
    id: 'redux-3',
    title: 'Проверить flow update для filter → list → inspector',
    track: 'state',
    owner: 'Dana',
    resolved: true,
    priority: 'low',
    note: 'Один action должен давать предсказуемое обновление всех зависимых веток.',
  },
  {
    id: 'redux-4',
    title: 'Сделать app-level data flow читаемым по коду',
    track: 'effects',
    owner: 'Ilya',
    resolved: false,
    priority: 'medium',
    note: 'Главный плюс Redux не в магии store, а в явном однонаправленном потоке.',
  },
] as const;

export const actionPresets: readonly {
  id: string;
  label: string;
  actionType: string;
  uiEvent: string;
  reducerEffect: string;
  selectorEffect: string;
  result: string;
}[] = [
  {
    id: 'resolve-item',
    label: 'Resolve item',
    actionType: 'reviewBoard/itemResolvedToggled',
    uiEvent: 'Клик по кнопке Resolve в строке списка',
    reducerEffect:
      'Slice меняет resolved у конкретной записи и обновляет telemetry поля.',
    selectorEffect:
      'selectVisibleItems и selectBoardSummary получают следующее состояние и пересчитывают derived data.',
    result: 'List, counters и inspector показывают новое согласованное состояние.',
  },
  {
    id: 'change-filter',
    label: 'Change filter',
    actionType: 'reviewBoard/filterSet',
    uiEvent: 'Выбор track filter в toolbar',
    reducerEffect: 'Store фиксирует новый filter как единый источник истины для экрана.',
    selectorEffect:
      'Селекторы отдают новый список и summary, не дублируя filter в каждой ветке отдельно.',
    result: 'Все view-ветки синхронно читают один и тот же filter state.',
  },
  {
    id: 'apply-draft',
    label: 'Apply draft note',
    actionType: 'reviewBoard/draftApplied',
    uiEvent: 'Кнопка Apply в inspector',
    reducerEffect:
      'Reducer переносит draft в выбранную запись и инкрементирует actionCount.',
    selectorEffect:
      'Inspector и list получают одно и то же обновлённое поле note из store.',
    result: 'Редактирование остаётся централизованным и не расходится между ветками.',
  },
] as const;

export type StrategyScenario = {
  treeDepth: number;
  sharedScope: 'branch' | 'section' | 'app';
  consumerSpread: 'near' | 'distant';
  transitions: 'simple' | 'complex';
  crossFeature: boolean;
  debugNeed: boolean;
};

export const strategyPresets: readonly (StrategyScenario & {
  id: string;
  title: string;
})[] = [
  {
    id: 'small-panel',
    title: 'Небольшая панель внутри одной секции',
    treeDepth: 2,
    sharedScope: 'branch',
    consumerSpread: 'near',
    transitions: 'simple',
    crossFeature: false,
    debugNeed: false,
  },
  {
    id: 'deep-shared-filter',
    title: 'Фильтр нужен toolbar, list и inspector в одной глубокой секции',
    treeDepth: 5,
    sharedScope: 'section',
    consumerSpread: 'distant',
    transitions: 'simple',
    crossFeature: false,
    debugNeed: false,
  },
  {
    id: 'app-coordination',
    title: 'Несколько feature-модулей делят один набор данных и actions',
    treeDepth: 5,
    sharedScope: 'app',
    consumerSpread: 'distant',
    transitions: 'complex',
    crossFeature: true,
    debugNeed: true,
  },
  {
    id: 'global-overkill',
    title: 'Есть соблазн вынести в store даже локальный draft и hover state',
    treeDepth: 3,
    sharedScope: 'branch',
    consumerSpread: 'near',
    transitions: 'simple',
    crossFeature: false,
    debugNeed: true,
  },
] as const;

export type StoreConcernId =
  | 'theme'
  | 'auth'
  | 'reviewBoard'
  | 'hoverState'
  | 'inlineDraft'
  | 'routeFilter'
  | 'serverCatalog'
  | 'notifications';

export const storeConcerns: readonly {
  id: StoreConcernId;
  label: string;
  recommendedOwner: 'redux' | 'local' | 'url' | 'server' | 'context';
  summary: string;
}[] = [
  {
    id: 'theme',
    label: 'Theme',
    recommendedOwner: 'context',
    summary: 'Обычно это shared preference, но не обязательно Redux.',
  },
  {
    id: 'auth',
    label: 'Auth session',
    recommendedOwner: 'redux',
    summary:
      'App-wide session и связанные actions могут хорошо жить в centralized store.',
  },
  {
    id: 'reviewBoard',
    label: 'Review board',
    recommendedOwner: 'redux',
    summary: 'Связанная feature-модель с несколькими view-ветками подходит для Redux.',
  },
  {
    id: 'hoverState',
    label: 'Hover state',
    recommendedOwner: 'local',
    summary: 'Эфемерное pointer-состояние редко выигрывает от глобального store.',
  },
  {
    id: 'inlineDraft',
    label: 'Inline draft',
    recommendedOwner: 'local',
    summary: 'Незавершённый ввод обычно должен оставаться рядом с формой.',
  },
  {
    id: 'routeFilter',
    label: 'Route filter',
    recommendedOwner: 'url',
    summary: 'Если состояние должно жить в ссылке, Redux не лучший первый владелец.',
  },
  {
    id: 'serverCatalog',
    label: 'Server catalog',
    recommendedOwner: 'server',
    summary: 'Внешние данные лучше держать в data layer, а не в ручном глобальном store.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    recommendedOwner: 'redux',
    summary: 'Глобальный event-driven поток уведомлений часто хорошо ложится на Redux.',
  },
] as const;

export const consumerProfiles: readonly {
  id: string;
  title: string;
  needs: readonly StoreConcernId[];
}[] = [
  {
    id: 'toolbar',
    title: 'Toolbar branch',
    needs: ['theme', 'reviewBoard'],
  },
  {
    id: 'inspector',
    title: 'Inspector branch',
    needs: ['reviewBoard', 'inlineDraft'],
  },
  {
    id: 'app-shell',
    title: 'App shell',
    needs: ['auth', 'notifications', 'theme'],
  },
] as const;

export const architectureModes: readonly {
  id: 'local' | 'redux';
  label: string;
  headline: string;
  bullets: readonly string[];
}[] = [
  {
    id: 'local',
    label: 'Component-local model',
    headline: 'Состояние и callbacks живут рядом с компонентами',
    bullets: [
      'Каждый кусок UI хранит свой state отдельно.',
      'Согласование между удалёнными ветками требует lifting state up и prop drilling.',
      'Логика переходов легко размазывается по множеству обработчиков.',
    ],
  },
  {
    id: 'redux',
    label: 'Centralized app model',
    headline: 'Store, actions, reducers и selectors становятся отдельным слоем',
    bullets: [
      'Компоненты dispatch-ят intent, а не меняют shared state напрямую.',
      'Reducers собирают transitions в одном месте.',
      'Selectors формируют derived data для разных view-веток без дублирования логики.',
    ],
  },
] as const;

export const architectureCodeMap: Record<
  LabId,
  readonly { label: string; path: string; note: string }[]
> = {
  flux: [
    {
      label: 'Flux timeline',
      path: 'src/lib/flux-loop-model.ts',
      note: 'Чистая модель разворачивает одно пользовательское действие в action → store → reducer → selector → view.',
    },
    {
      label: 'Flux lab',
      path: 'src/components/redux-architecture/FluxCycleLab.tsx',
      note: 'UI показывает цикл Flux на интерактивных сценариях и связывает его с реальными action types проекта.',
    },
  ],
  store: [
    {
      label: 'Redux slice',
      path: 'src/store/reviewBoardSlice.ts',
      note: 'Feature slice описывает state shape, reducers и actions для одной общей domain-модели.',
    },
    {
      label: 'Selectors',
      path: 'src/store/selectors.ts',
      note: 'Selectors отделяют derived data от компонентов и делают код view-веток чище.',
    },
  ],
  flow: [
    {
      label: 'Store config',
      path: 'src/store/store.ts',
      note: 'Root store фиксирует app-level one-way data flow через единый reducer tree.',
    },
    {
      label: 'Flow lab',
      path: 'src/components/redux-architecture/UnidirectionalFlowLab.tsx',
      note: 'Лаборатория dispatch-ит реальные actions и показывает, как один action меняет несколько view-веток.',
    },
  ],
  compare: [
    {
      label: 'Strategy model',
      path: 'src/lib/redux-strategy-model.ts',
      note: 'Pure-model слой сравнивает local/context/redux по сигналам сценария.',
    },
    {
      label: 'Compare lab',
      path: 'src/components/redux-architecture/ContextVsReduxLab.tsx',
      note: 'UI редактирует сценарий и показывает архитектурное решение без хардкода в JSX.',
    },
  ],
  tradeoffs: [
    {
      label: 'Store surface model',
      path: 'src/lib/redux-strategy-model.ts',
      note: 'Модель считает, какие concerns не стоит складывать в один Redux store.',
    },
    {
      label: 'Overkill lab',
      path: 'src/components/redux-architecture/ReduxOverkillLab.tsx',
      note: 'Лаборатория показывает, когда централизованный store начинает собирать лишние локальные и серверные данные.',
    },
  ],
  architecture: [
    {
      label: 'Mental model data',
      path: 'src/lib/redux-domain.ts',
      note: 'Здесь зафиксирована разница между component-local и centralized app model.',
    },
    {
      label: 'Architecture lab',
      path: 'src/components/redux-architecture/ArchitectureShiftLab.tsx',
      note: 'Интерактивная карта показывает, как меняется структура кода и мыслительный фокус при переходе к Redux.',
    },
  ],
};
