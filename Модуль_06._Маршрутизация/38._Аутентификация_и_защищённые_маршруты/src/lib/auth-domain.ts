import type { LabId } from './learning-model';

export type AuthFocus = 'all' | 'routing' | 'roles' | 'session' | 'ux';
export type AuthRole = 'member' | 'editor' | 'admin';

export type AuthPersona = {
  id: string;
  displayName: string;
  role: AuthRole;
  summary: string;
  defaultNext: string;
};

export type AuthSession = {
  userId: string;
  displayName: string;
  role: AuthRole;
  accessToken: string;
  refreshToken: string;
  issuedAt: number;
  expiresAt: number;
  lastRefreshAt: number;
  source: 'login' | 'refresh';
};

export type AuthPlaybook = {
  id: string;
  title: string;
  focus: Exclude<AuthFocus, 'all'>;
  summary: string;
  routeConcern: string;
  uxConcern: string;
  pitfalls: readonly string[];
};

export type ScreenSpec = {
  id: string;
  title: string;
  requiredRole: AuthRole;
  summary: string;
  whyProtected: string;
  allowedRoles: readonly AuthRole[];
  pitfalls: readonly string[];
};

export const authPersonas: readonly AuthPersona[] = [
  {
    id: 'irina-member',
    displayName: 'Ирина',
    role: 'member',
    summary: 'Обычный участник, которому доступны базовые защищённые экраны.',
    defaultNext: '/protected-workspace/dashboard',
  },
  {
    id: 'roman-editor',
    displayName: 'Роман',
    role: 'editor',
    summary: 'Редактор с доступом к editorial screens и review workflows.',
    defaultNext: '/role-access/editor-lab',
  },
  {
    id: 'elena-admin',
    displayName: 'Елена',
    role: 'admin',
    summary: 'Администратор с доступом к admin panel и audit room.',
    defaultNext: '/role-access/admin-panel',
  },
] as const;

export const authPlaybooks: readonly AuthPlaybook[] = [
  {
    id: 'route-guards',
    title: 'Route guards',
    focus: 'routing',
    summary:
      'Loader или guard route решает, пускать ли пользователя в экран до рендера protected branch.',
    routeConcern:
      'Маршрут должен знать, нужен ли redirect на login и куда вернуть пользователя после входа.',
    uxConcern:
      'Пользователь не должен видеть полусломанный экран, который уже начал рендериться без доступа.',
    pitfalls: [
      'Не откладывайте проверку доступа до эффекта после рендера.',
      'Не теряйте intended destination при redirect на login.',
    ],
  },
  {
    id: 'role-matrix',
    title: 'Role-based access',
    focus: 'roles',
    summary:
      'Одна auth session не означает доступ ко всем маршрутам: role gates работают поверх базовой аутентификации.',
    routeConcern:
      '403 и redirect должны происходить на уровне branch-а или экрана, а не случайного child widget.',
    uxConcern:
      'Нужно чётко показывать, что доступ ограничен ролью, а не неизвестной ошибкой загрузки.',
    pitfalls: [
      'Не превращайте все ограничения в один глобальный admin-only switch.',
      'Не подменяйте 403 простым скрытием кнопки без реальной проверки маршрута.',
    ],
  },
  {
    id: 'session-refresh',
    title: 'Session refresh',
    focus: 'session',
    summary:
      'Токен может устареть в момент навигации, поэтому защищённый маршрут должен понимать refresh и logout сценарии.',
    routeConcern:
      'Loader должен отличать просроченную сессию, удачный refresh и реальный redirect на login.',
    uxConcern:
      'Нужен мягкий переход: либо продолжение пути после refresh, либо честный возврат на вход.',
    pitfalls: [
      'Не считайте, что access token всегда валиден до следующего клика.',
      'Не держите refresh-логику размазанной по нескольким компонентам.',
    ],
  },
  {
    id: 'login-intent',
    title: 'Preserved intent',
    focus: 'ux',
    summary:
      'После входа пользователь должен попасть туда, куда шёл, а не на случайную домашнюю страницу.',
    routeConcern:
      'Маршрутизатор должен хранить safe next path и защищать redirect от произвольных внешних адресов.',
    uxConcern:
      'Хороший auth UX сокращает трение: вход выглядит как продолжение сценария, а не как потеря контекста.',
    pitfalls: [
      'Не теряйте `next` при повторном открытии login screen.',
      'Не редиректите на неподтверждённый внешний URL.',
    ],
  },
  {
    id: 'logout-reset',
    title: 'Logout and reset',
    focus: 'session',
    summary:
      'Logout должен очищать защищённый доступ, session snapshot и устаревшее намерение, если оно уже неактуально.',
    routeConcern:
      'После logout защищённые ветки больше не должны оставаться доступными через cached UI.',
    uxConcern:
      'Пользователь должен видеть понятное состояние после выхода, а не подвисший protected screen.',
    pitfalls: [
      'Не оставляйте старый токен и старую ветку в памяти после logout.',
      'Не смешивайте logout и refresh в одну неразличимую кнопку.',
    ],
  },
  {
    id: 'access-architecture',
    title: 'Access architecture',
    focus: 'routing',
    summary:
      'Где живут auth state, route guards, role checks и UX редиректы, определяет устойчивость всей навигации приложения.',
    routeConcern:
      'Архитектура должна отделять публичные, защищённые и role-sensitive branch-и.',
    uxConcern:
      'Когда слои доступа разложены правильно, экран не мигает и не теряет контекст пользователя.',
    pitfalls: [
      'Не делайте один глобальный контейнер, который знает про все access decisions сразу.',
      'Не прячьте route-critical доступ в локальный component state.',
    ],
  },
] as const;

export const protectedScreens: readonly ScreenSpec[] = [
  {
    id: 'dashboard',
    title: 'Protected dashboard',
    requiredRole: 'member',
    summary: 'Базовый защищённый экран, который доступен любой валидной auth session.',
    whyProtected:
      'Экран зависит от персональных данных и не должен рендериться для гостя.',
    allowedRoles: ['member', 'editor', 'admin'],
    pitfalls: [
      'Нельзя проверять auth только визуально внутри дочерней карточки.',
      'Redirect на login должен произойти до leaf render.',
    ],
  },
  {
    id: 'roadmap',
    title: 'Learning roadmap',
    requiredRole: 'member',
    summary: 'Ветка с персональной учебной картой и состоянием пользователя.',
    whyProtected:
      'Здесь уже есть user-specific данные, поэтому screen contract начинается с access check.',
    allowedRoles: ['member', 'editor', 'admin'],
    pitfalls: [
      'Не держите user-specific screen открытым после logout.',
      'Не полагайтесь только на скрытие nav link.',
    ],
  },
  {
    id: 'billing',
    title: 'Billing snapshot',
    requiredRole: 'member',
    summary:
      'Пример экрана, где redirect на login важнее, чем пустая заглушка без данных.',
    whyProtected: 'Тут критично не показывать даже часть UI до подтверждения session.',
    allowedRoles: ['member', 'editor', 'admin'],
    pitfalls: [
      'Не запускайте billing fetch после первого рендера гостя.',
      'Не теряйте путь возврата после входа.',
    ],
  },
] as const;

export const roleScreens: readonly ScreenSpec[] = [
  {
    id: 'editor-lab',
    title: 'Editorial workspace',
    requiredRole: 'editor',
    summary: 'Здесь начинается role-based доступ поверх уже валидной auth session.',
    whyProtected:
      'Обычный member не должен попадать в экран модерации и редакторских действий.',
    allowedRoles: ['editor', 'admin'],
    pitfalls: [
      '403 не равен logout: сессия может быть валидной, но роль недостаточной.',
      'Не превращайте role gate в случайный if внутри компонента.',
    ],
  },
  {
    id: 'admin-panel',
    title: 'Admin panel',
    requiredRole: 'admin',
    summary:
      'Классический admin-only экран, который должен падать в локальный 403 boundary.',
    whyProtected:
      'Доступ к настройкам и управлению ролями нельзя смешивать с общей member-веткой.',
    allowedRoles: ['admin'],
    pitfalls: [
      'Не считайте editor почти-admin и не пускайте его по умолчанию.',
      'Не используйте один общий fallback для 403 и 404.',
    ],
  },
  {
    id: 'audit-room',
    title: 'Audit room',
    requiredRole: 'admin',
    summary: 'Экран для проверки access log и чувствительных audit записей.',
    whyProtected:
      'Архитектура доступа должна ограничивать самые чувствительные ветки максимально явно.',
    allowedRoles: ['admin'],
    pitfalls: [
      'Не прячьте audit trail за обычным UI toggle без маршрутизаторной проверки.',
      'Не держите audit branch в одном контейнере с публичным screen data.',
    ],
  },
] as const;

export const sessionPolicies = [
  'Protected loader сначала смотрит на current session snapshot, а затем решает refresh или redirect.',
  'Refresh не должен быть скрытой магией без audit trail и без понятного результата.',
  'Logout должен сбрасывать защищённые данные и не оставлять старую ветку доступной.',
  'Intent path нужно нормализовать, иначе redirect после входа легко ломает UX и безопасность.',
] as const;

const roleRank: Record<AuthRole, number> = {
  member: 1,
  editor: 2,
  admin: 3,
};

export function canAccessRole(role: AuthRole, requiredRole: AuthRole) {
  return roleRank[role] >= roleRank[requiredRole];
}

export function findProtectedScreen(screenId: string) {
  return protectedScreens.find((item) => item.id === screenId) ?? null;
}

export function findRoleScreen(screenId: string) {
  return roleScreens.find((item) => item.id === screenId) ?? null;
}

export function filterAuthPlaybooksByFocus(focus: AuthFocus) {
  return focus === 'all'
    ? [...authPlaybooks]
    : authPlaybooks.filter((item) => item.focus === focus);
}

export function describeLabFromPath(pathname: string): LabId | null {
  if (pathname.startsWith('/auth-flow-overview')) {
    return 'overview';
  }

  if (pathname.startsWith('/protected-workspace')) {
    return 'protected';
  }

  if (pathname.startsWith('/role-access')) {
    return 'roles';
  }

  if (pathname.startsWith('/session-lifecycle')) {
    return 'session';
  }

  if (pathname.startsWith('/auth-ux')) {
    return 'ux';
  }

  if (pathname.startsWith('/access-architecture')) {
    return 'architecture';
  }

  return null;
}
