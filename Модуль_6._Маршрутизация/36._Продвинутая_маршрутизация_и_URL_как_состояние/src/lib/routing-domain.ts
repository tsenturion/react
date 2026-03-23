import type { LabId } from './learning-model';

export type RouteTreeNode = {
  id: string;
  label: string;
  path: string;
  children?: readonly RouteTreeNode[];
};

export type ModuleLevel = 'base' | 'advanced';
export type ModuleStatus = 'todo' | 'in-progress' | 'done';

export type RoutingModule = {
  id: string;
  title: string;
  level: ModuleLevel;
  status: ModuleStatus;
  popularity: number;
  progress: number;
  focus: string;
  screens: readonly string[];
  routingNotes: readonly string[];
  pitfallNotes: readonly string[];
};

export const routingModules: readonly RoutingModule[] = [
  {
    id: 'module-6',
    title: 'Каталог экранов маршрутизации',
    level: 'base',
    status: 'in-progress',
    popularity: 94,
    progress: 42,
    focus: 'Базовая ветка, через которую видно nested route и route param.',
    screens: ['Список уроков', 'Карточка модуля', 'Подробности выбранного урока'],
    routingNotes: [
      'Path segment `:moduleId` определяет leaf screen.',
      'Parent route хранит общий sidebar и не размонтируется при смене leaf.',
      'Ссылки между модулями сохраняют общий контекст ветки.',
    ],
    pitfallNotes: [
      'Не превращайте вложенный экран в local toggle, если адрес действительно имеет значение.',
      'Не дублируйте один и тот же selected entity и в path, и в local state.',
    ],
  },
  {
    id: 'search-sync',
    title: 'URL-поиск и фильтрация',
    level: 'base',
    status: 'done',
    popularity: 88,
    progress: 76,
    focus: 'Query string как источник фильтров, сортировки и режима отображения.',
    screens: ['Лента результатов', 'Toolbar с фильтрами', 'Пустое состояние'],
    routingNotes: [
      '`useSearchParams` даёт shareable state без отдельного эффекта синхронизации.',
      'Один и тот же путь может описывать много под-состояний экрана через query string.',
      'Refresh и copy link сохраняют текущую конфигурацию.',
    ],
    pitfallNotes: [
      'Не храните ту же сортировку одновременно в `useState` и в URL.',
      'Не записывайте в URL шум, который не нужен пользователю вне текущего кадра.',
    ],
  },
  {
    id: 'tabbed-workspace',
    title: 'Вкладки, статусы и устойчивые deep links',
    level: 'advanced',
    status: 'todo',
    popularity: 82,
    progress: 31,
    focus: 'Tab, status и panel mode как часть текущего адреса.',
    screens: ['Outline view', 'Activity tab', 'Notes tab'],
    routingNotes: [
      'URL отражает текущее состояние экрана без ручной сериализации side effects.',
      'Один screen может иметь много устойчивых под-состояний.',
      'Back/forward меняют не только path, но и query-driven state.',
    ],
    pitfallNotes: [
      'Не делайте query string заменой для каждого локального hover или draft input.',
      'Не смешивайте URL state с derived state, который можно посчитать на лету.',
    ],
  },
  {
    id: 'entity-review',
    title: 'Выбранная сущность и архитектура deep link',
    level: 'advanced',
    status: 'in-progress',
    popularity: 79,
    progress: 58,
    focus: 'Path param держит сущность, query string уточняет режим просмотра.',
    screens: ['Entity overview', 'Routing tab', 'Pitfalls panel'],
    routingNotes: [
      'Path чаще всего хранит саму сущность, если у неё есть собственная identity.',
      'Query string уточняет tab, panel и другие режимы внутри этого экрана.',
      'Иерархия адреса остаётся читаемой даже при большом количестве UI-state.',
    ],
    pitfallNotes: [
      'Если и сущность, и tab, и фильтры спрятаны в local state, адрес теряет смысл.',
      'Если path начинает хранить всё подряд, route tree становится шумным и хрупким.',
    ],
  },
] as const;

export const advancedRouteTree: RouteTreeNode = {
  id: 'root',
  label: 'Lesson shell layout',
  path: '/',
  children: [
    {
      id: 'nested',
      label: 'Nested routes',
      path: '/nested-routes',
      children: [
        {
          id: 'nested-module',
          label: ':moduleId',
          path: '/nested-routes/:moduleId',
        },
      ],
    },
    {
      id: 'layouts',
      label: 'Layout routes',
      path: '/layout-routes',
      children: [
        { id: 'layout-overview', label: 'overview', path: '/layout-routes/overview' },
        { id: 'layout-checklist', label: 'checklist', path: '/layout-routes/checklist' },
        { id: 'layout-activity', label: 'activity', path: '/layout-routes/activity' },
      ],
    },
    {
      id: 'search',
      label: 'Search params',
      path: '/search-params',
    },
    {
      id: 'url-state',
      label: 'URL as state',
      path: '/url-state',
    },
    {
      id: 'entities',
      label: 'Selected entity',
      path: '/entities',
      children: [
        {
          id: 'entity-id',
          label: ':entityId',
          path: '/entities/:entityId',
        },
      ],
    },
    {
      id: 'architecture',
      label: 'Navigation architecture',
      path: '/navigation-architecture',
    },
  ],
};

export function findRoutingModule(moduleId: string) {
  return routingModules.find((item) => item.id === moduleId) ?? null;
}

export function describeLabFromPath(pathname: string): LabId | null {
  if (pathname.startsWith('/nested-routes')) {
    return 'nested';
  }

  if (pathname.startsWith('/layout-routes')) {
    return 'layouts';
  }

  if (pathname.startsWith('/search-params')) {
    return 'search';
  }

  if (pathname.startsWith('/url-state')) {
    return 'url-state';
  }

  if (pathname.startsWith('/entities')) {
    return 'entities';
  }

  if (pathname.startsWith('/navigation-architecture')) {
    return 'architecture';
  }

  return null;
}
