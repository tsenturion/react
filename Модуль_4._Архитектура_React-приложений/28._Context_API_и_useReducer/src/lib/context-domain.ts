export type DeliveryTrack = 'state' | 'effects' | 'architecture';
export type ReviewTrack = 'all' | 'core' | 'state' | 'effects' | 'architecture';
export type Priority = 'low' | 'medium' | 'high';

export type ReviewItem = {
  id: string;
  title: string;
  track: Exclude<ReviewTrack, 'all'>;
  owner: string;
  resolved: boolean;
  priority: Priority;
  note: string;
};

export const deliveryTracks: readonly {
  id: DeliveryTrack;
  label: string;
  summary: string;
}[] = [
  {
    id: 'state',
    label: 'State flows',
    summary: 'Где хранить состояние и как оно переходит между ветками дерева.',
  },
  {
    id: 'effects',
    label: 'Effects sync',
    summary: 'Как события и побочные эффекты связаны с архитектурой обновлений.',
  },
  {
    id: 'architecture',
    label: 'App architecture',
    summary: 'Как провайдеры и reducer-слой влияют на масштабирование интерфейса.',
  },
] as const;

export const reviewBoardSeed: readonly ReviewItem[] = [
  {
    id: 'ctx-1',
    title: 'Разнести delivery layer и reducer layer',
    track: 'architecture',
    owner: 'Mira',
    resolved: false,
    priority: 'high',
    note: 'Toolbar должен доставлять actions, а не бизнес-логику.',
  },
  {
    id: 'ctx-2',
    title: 'Убрать лишний prop drilling в review tree',
    track: 'core',
    owner: 'Oleg',
    resolved: false,
    priority: 'medium',
    note: 'Context нужен только после того, как drilling реально начинает мешать.',
  },
  {
    id: 'ctx-3',
    title: 'Оставить локальный draft рядом с editor panel',
    track: 'state',
    owner: 'Dana',
    resolved: true,
    priority: 'low',
    note: 'Не выносить временный input в общий provider без причины.',
  },
  {
    id: 'ctx-4',
    title: 'Синхронизировать panel filter и inspector',
    track: 'effects',
    owner: 'Ilya',
    resolved: false,
    priority: 'medium',
    note: 'Обновления должны читаться как actions, а не как случайный setState во многих местах.',
  },
] as const;

export const releaseBoardSeed: readonly ReviewItem[] = [
  {
    id: 'rel-1',
    title: 'Собрать release notes для архитектурного блока',
    track: 'architecture',
    owner: 'Nina',
    resolved: false,
    priority: 'high',
    note: 'Нужен отдельный scoped provider для release workspace.',
  },
  {
    id: 'rel-2',
    title: 'Проверить контекстные зависимости в sidebar',
    track: 'core',
    owner: 'Leo',
    resolved: true,
    priority: 'medium',
    note: 'Sidebar не должен знать про draft формы редактора.',
  },
  {
    id: 'rel-3',
    title: 'Подчистить actions у review board',
    track: 'state',
    owner: 'Sara',
    resolved: false,
    priority: 'low',
    note: 'Action names должны объяснять намерение, а не повторять setSomething.',
  },
] as const;

export const nestedSandboxSeed: readonly ReviewItem[] = [
  {
    id: 'nested-1',
    title: 'Изолированный training sandbox',
    track: 'architecture',
    owner: 'You',
    resolved: false,
    priority: 'medium',
    note: 'Этот provider живёт внутри внешнего scope и не трогает его состояние.',
  },
  {
    id: 'nested-2',
    title: 'Проверить reset ближайшего провайдера',
    track: 'core',
    owner: 'You',
    resolved: false,
    priority: 'low',
    note: 'Nearest provider wins: внутренний scope перекрывает внешний.',
  },
] as const;

export type StrategyScenario = {
  treeDepth: number;
  distantConsumers: boolean;
  logicComplexity: 'simple' | 'complex';
  sharedScope: 'branch' | 'section' | 'app';
  updates: 'rare' | 'frequent';
  providerEverywhere: boolean;
};

export const strategyPresets: readonly (StrategyScenario & {
  id: string;
  title: string;
})[] = [
  {
    id: 'modal-toggle',
    title: 'Небольшой toggle внутри одной ветки',
    treeDepth: 1,
    distantConsumers: false,
    logicComplexity: 'simple',
    sharedScope: 'branch',
    updates: 'rare',
    providerEverywhere: false,
  },
  {
    id: 'section-filter',
    title: 'Фильтр нужен toolbar и двум далёким секциям',
    treeDepth: 4,
    distantConsumers: true,
    logicComplexity: 'simple',
    sharedScope: 'section',
    updates: 'frequent',
    providerEverywhere: false,
  },
  {
    id: 'workspace-board',
    title: 'Сложная доска с множеством actions и глубокой иерархией',
    treeDepth: 5,
    distantConsumers: true,
    logicComplexity: 'complex',
    sharedScope: 'section',
    updates: 'frequent',
    providerEverywhere: false,
  },
  {
    id: 'global-overkill',
    title: 'Попытка завернуть всё приложение в один provider',
    treeDepth: 5,
    distantConsumers: true,
    logicComplexity: 'complex',
    sharedScope: 'branch',
    updates: 'frequent',
    providerEverywhere: true,
  },
] as const;

export type ContainerFeatureId =
  | 'theme'
  | 'session'
  | 'workspace'
  | 'draft'
  | 'tooltip'
  | 'dialog'
  | 'catalogData'
  | 'hoverState';

export const containerFeatures: readonly {
  id: ContainerFeatureId;
  label: string;
  recommendedOwner: 'context' | 'local' | 'server' | 'scoped-context';
  summary: string;
}[] = [
  {
    id: 'theme',
    label: 'Theme',
    recommendedOwner: 'context',
    summary: 'Глобальная визуальная настройка, которая нужна многим веткам.',
  },
  {
    id: 'session',
    label: 'Session',
    recommendedOwner: 'context',
    summary:
      'Информация о текущем workspace или пользователе подходит для shared delivery.',
  },
  {
    id: 'workspace',
    label: 'Workspace mode',
    recommendedOwner: 'context',
    summary: 'Общий режим аналитики или review scope может жить в context.',
  },
  {
    id: 'dialog',
    label: 'Dialog control',
    recommendedOwner: 'scoped-context',
    summary: 'Чаще нужен отдельный scoped provider, а не общий AppContext для всего.',
  },
  {
    id: 'draft',
    label: 'Inline draft',
    recommendedOwner: 'local',
    summary: 'Временный незавершённый ввод лучше держать рядом с формой.',
  },
  {
    id: 'tooltip',
    label: 'Tooltip position',
    recommendedOwner: 'local',
    summary: 'Координаты и hover-детали почти всегда должны оставаться локальными.',
  },
  {
    id: 'hoverState',
    label: 'Hover state',
    recommendedOwner: 'local',
    summary: 'Эфемерное состояние pointer interaction не стоит поднимать глобально.',
  },
  {
    id: 'catalogData',
    label: 'Server catalog',
    recommendedOwner: 'server',
    summary:
      'Данные из внешнего источника должны жить в server/data layer, а не в контекстном контейнере.',
  },
] as const;

export const consumerProfiles: readonly {
  id: string;
  title: string;
  needs: readonly ContainerFeatureId[];
}[] = [
  {
    id: 'toolbar',
    title: 'Toolbar branch',
    needs: ['theme', 'workspace'],
  },
  {
    id: 'editor',
    title: 'Inline editor',
    needs: ['draft', 'dialog'],
  },
  {
    id: 'catalog',
    title: 'Catalog screen',
    needs: ['theme', 'catalogData', 'workspace'],
  },
] as const;
