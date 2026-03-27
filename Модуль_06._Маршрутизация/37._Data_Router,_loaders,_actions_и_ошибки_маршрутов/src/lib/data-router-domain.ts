import type { LabId } from './learning-model';

export type DataTrack = 'all' | 'loaders' | 'actions' | 'errors';
export type PlaybookTrack = Exclude<DataTrack, 'all'>;
export type PlaybookStatus = 'draft' | 'stable' | 'risky';
export type ErrorMode = 'stable' | 'response-404' | 'response-503' | 'throw-error';

export type DataPlaybook = {
  id: string;
  title: string;
  track: PlaybookTrack;
  status: PlaybookStatus;
  summary: string;
  routeDataRole: string;
  mutationRole: string;
  errorRole: string;
  screens: readonly string[];
  pitfalls: readonly string[];
};

export type ActionTopic = {
  id: string;
  label: string;
  purpose: string;
};

export type MutationRequest = {
  id: string;
  topicId: string;
  owner: string;
  note: string;
  status: 'queued' | 'validated';
  createdAt: string;
};

export type RouteTreeNode = {
  id: string;
  label: string;
  path: string;
  children?: readonly RouteTreeNode[];
};

export const dataPlaybooks: readonly DataPlaybook[] = [
  {
    id: 'route-loaders',
    title: 'Route loaders',
    track: 'loaders',
    status: 'stable',
    summary: 'Маршрут запрашивает данные до рендера и отдаёт экрану готовый снимок.',
    routeDataRole: 'Loader определяет, что экран получает в первом рендере.',
    mutationRole: 'Action здесь не нужен, потому что сценарий только читает данные.',
    errorRole: 'Route boundary ловит проблемы загрузки до показа leaf screen.',
    screens: ['Overview screen', 'Route metrics', 'Loader timeline'],
    pitfalls: [
      'Не дублируйте те же данные потом ещё и в component effect.',
      'Не прячьте URL-зависимые запросы глубоко в leaf-компонент.',
    ],
  },
  {
    id: 'nested-branch',
    title: 'Nested loader branch',
    track: 'loaders',
    status: 'stable',
    summary: 'Parent и child routes имеют собственные loaders и делят одну route branch.',
    routeDataRole:
      'Parent loader даёт branch context, child loader даёт конкретную сущность.',
    mutationRole: 'Action можно добавить позже, не ломая parent branch.',
    errorRole: 'Child boundary изолирует сбой внутри Outlet и не рушит parent shell.',
    screens: ['Sidebar layout', 'Leaf lesson', 'Nested error boundary'],
    pitfalls: [
      'Не смешивайте parent context и child entity в один громадный loader.',
      'Не дублируйте один и тот же fetch на обоих уровнях без причины.',
    ],
  },
  {
    id: 'form-actions',
    title: 'Route actions',
    track: 'actions',
    status: 'stable',
    summary: 'Form и action связывают submit flow, validation и revalidation маршрута.',
    routeDataRole: 'Loader читает актуальную очередь заявок после мутации.',
    mutationRole:
      'Action принимает form data и решает валидацию до повторного рендера экрана.',
    errorRole: 'Action может вернуть field errors или бросить route-level error.',
    screens: ['Action form', 'Pending submit', 'Revalidated request list'],
    pitfalls: [
      'Не оборачивайте простой route form в лишний useState/useEffect orchestration.',
      'Не теряйте связь между pending submit и итоговой revalidation.',
    ],
  },
  {
    id: 'route-errors',
    title: 'Route error boundaries',
    track: 'errors',
    status: 'risky',
    summary:
      'Loader и action ошибки обрабатываются на уровне маршрута, а не только глобально.',
    routeDataRole: 'Маршрут решает, какой error boundary ловит сбой.',
    mutationRole: 'Action failures можно локализовать в пределах текущей ветки.',
    errorRole: 'errorElement отвечает за fallback UI и reset strategy branch-а.',
    screens: ['Stable mode', '404 route error', 'Thrown exception'],
    pitfalls: [
      'Не рассчитывайте, что обычный try/catch в компоненте заменит route boundary.',
      'Не делайте один глобальный error boundary для всех сценариев подряд.',
    ],
  },
  {
    id: 'component-fetch',
    title: 'Component request comparison',
    track: 'loaders',
    status: 'draft',
    summary: 'Сравнение route-level запроса и эффекта после первого рендера компонента.',
    routeDataRole: 'Loader делает данные частью navigation lifecycle.',
    mutationRole: 'Action сохраняет мутацию в той же route model.',
    errorRole: 'Ошибки маршрута имеют собственный fallback UI.',
    screens: ['First render', 'Param change', 'Submit after navigation'],
    pitfalls: [
      'Не переносите URL-зависимый fetch в useEffect просто по привычке.',
      'Не усложняйте route loader там, где достаточно локального клиентского запроса.',
    ],
  },
  {
    id: 'access-gates',
    title: 'Route access and redirects',
    track: 'errors',
    status: 'draft',
    summary:
      'Маршруты начинают управлять не только UI, но и доступом, redirect logic и branch flow.',
    routeDataRole: 'Loader может решать, пускать ли пользователя в branch.',
    mutationRole: 'Action может менять branch state и инициировать redirect.',
    errorRole: 'Failure и redirect находятся на том же маршрутизаторном уровне.',
    screens: ['Guarded branch', 'Redirect path', 'Access failure'],
    pitfalls: [
      'Не размазывайте access logic случайными if внутри разных компонент.',
      'Не делайте navigation побочным эффектом после уже невалидного рендера.',
    ],
  },
] as const;

export const actionTopics: readonly ActionTopic[] = [
  {
    id: 'loader-first',
    label: 'Перенести fetch в loader',
    purpose: 'Нужно получить данные до первого рендера экрана.',
  },
  {
    id: 'form-flow',
    label: 'Собрать route action',
    purpose: 'Нужно связать submit, validation и revalidation на уровне маршрута.',
  },
  {
    id: 'error-branch',
    label: 'Изолировать route errors',
    purpose: 'Нужно локализовать сбой внутри одной route branch.',
  },
] as const;

export const routeTree: RouteTreeNode = {
  id: 'lesson-shell',
  label: 'Lesson shell route',
  path: '/',
  children: [
    { id: 'overview', label: 'Data router basics', path: '/data-router-overview' },
    {
      id: 'loader-branch',
      label: 'Nested loaders',
      path: '/loader-tree',
      children: [
        { id: 'loader-leaf', label: ':lessonId', path: '/loader-tree/:lessonId' },
      ],
    },
    { id: 'actions', label: 'Actions lab', path: '/actions-lab' },
    {
      id: 'errors',
      label: 'Route errors',
      path: '/error-routes',
      children: [{ id: 'error-mode', label: ':mode', path: '/error-routes/:mode' }],
    },
    {
      id: 'comparison',
      label: 'Route vs component request',
      path: '/route-vs-component-data',
    },
    {
      id: 'architecture',
      label: 'Data router architecture',
      path: '/data-router-architecture',
    },
  ],
};

export function describeLabFromPath(pathname: string): LabId | null {
  if (pathname.startsWith('/data-router-overview')) {
    return 'overview';
  }

  if (pathname.startsWith('/loader-tree')) {
    return 'nested';
  }

  if (pathname.startsWith('/actions-lab')) {
    return 'actions';
  }

  if (pathname.startsWith('/error-routes')) {
    return 'errors';
  }

  if (pathname.startsWith('/route-vs-component-data')) {
    return 'comparison';
  }

  if (pathname.startsWith('/data-router-architecture')) {
    return 'architecture';
  }

  return null;
}
