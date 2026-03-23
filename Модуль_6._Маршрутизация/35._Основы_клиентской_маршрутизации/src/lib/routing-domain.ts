import type { LabId } from './learning-model';

export type RouteLesson = {
  id: string;
  title: string;
  module: string;
  focus: string;
};

export type RouteTreeNode = {
  id: string;
  label: string;
  path: string;
  children?: RouteTreeNode[];
};

export type RoutePlacementInput = {
  hasShareableUrl: boolean;
  representsScreen: boolean;
  needsBrowserHistory: boolean;
  deepLinkingMatters: boolean;
  onlyTogglesUiFragment: boolean;
};

export const routeParamLessons: readonly RouteLesson[] = [
  {
    id: 'module-6',
    title: 'Основы клиентской маршрутизации',
    module: 'Модуль 6',
    focus: 'Базовые client-side переходы и route params.',
  },
  {
    id: 'profile-editor',
    title: 'Экран редактирования профиля',
    module: 'Feature demo',
    focus: 'Один и тот же компонент читает параметр из URL и меняет данные экрана.',
  },
  {
    id: 'catalog-archive',
    title: 'Архив маршрутов',
    module: 'Navigation lab',
    focus: 'URL определяет, какую сущность вы открыли и можно ли поделиться ссылкой.',
  },
] as const;

export const routeTree: RouteTreeNode = {
  id: 'root',
  label: 'Shell layout',
  path: '/',
  children: [
    { id: 'basics', label: 'Client-side routing', path: '/client-routing' },
    { id: 'tree', label: 'Route tree', path: '/route-tree' },
    { id: 'navigation', label: 'Navigation', path: '/navigation' },
    {
      id: 'params',
      label: 'Route params',
      path: '/params',
      children: [
        {
          id: 'params-id',
          label: ':lessonId',
          path: '/params/:lessonId',
        },
      ],
    },
    { id: 'spa', label: 'SPA mental model', path: '/spa-mental-model' },
    {
      id: 'architecture',
      label: 'Routing architecture',
      path: '/routing-architecture',
    },
  ],
};

export function findRouteLesson(lessonId: string) {
  return routeParamLessons.find((item) => item.id === lessonId) ?? null;
}

export function describeLabFromPath(pathname: string): LabId | null {
  if (pathname.startsWith('/client-routing')) {
    return 'basics';
  }

  if (pathname.startsWith('/route-tree')) {
    return 'tree';
  }

  if (pathname.startsWith('/navigation')) {
    return 'navigation';
  }

  if (pathname.startsWith('/params')) {
    return 'params';
  }

  if (pathname.startsWith('/spa-mental-model')) {
    return 'spa';
  }

  if (pathname.startsWith('/routing-architecture')) {
    return 'architecture';
  }

  return null;
}

export function recommendRoutePlacement(input: RoutePlacementInput) {
  if (
    input.representsScreen &&
    (input.hasShareableUrl || input.needsBrowserHistory || input.deepLinkingMatters)
  ) {
    return {
      approach: 'Route',
      rationale: [
        'Экран достоин собственного URL, потому что им можно делиться и к нему можно возвращаться через history.',
        'Browser navigation становится частью UX, а не побочным эффектом.',
        'Состояние экрана должно переживать reload и открытие ссылки в новой вкладке.',
      ],
      antiPattern:
        'Не прячьте полноценный экран в локальный toggle, если пользователь ожидает адрес, back/forward и deep link.',
      score: 90,
    };
  }

  if (
    input.onlyTogglesUiFragment &&
    !input.hasShareableUrl &&
    !input.deepLinkingMatters
  ) {
    return {
      approach: 'Local UI state',
      rationale: [
        'Это фрагмент текущего экрана, а не самостоятельный пользовательский сценарий.',
        'URL только усложнит модель и начнёт шуметь лишними маршрутами.',
        'Локальное состояние лучше отражает краткоживущий визуальный toggle.',
      ],
      antiPattern:
        'Не создавайте отдельный маршрут для каждого accordion, modal toggle или маленькой локальной панели.',
      score: 38,
    };
  }

  return {
    approach: 'Depends on scenario',
    rationale: [
      'Здесь нет автоматического ответа: часть признаков тянет в route, часть остаётся в локальном состоянии.',
      'Нужно смотреть, является ли это самостоятельным экраном и важен ли shareable URL.',
      'Пограничные случаи часто требуют сочетания route и локального UI-state внутри экрана.',
    ],
    antiPattern:
      'Не принимайте решение по привычке. Сначала определите, это экран, адресуемое состояние или просто визуальный режим.',
    score: 62,
  };
}
