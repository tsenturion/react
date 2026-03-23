export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'protected'
  | 'roles'
  | 'session'
  | 'ux'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: '1. Auth flow basics',
    blurb: 'Как auth flow влияет на route tree, данные, редиректы и UX входа.',
    href: '/auth-flow-overview?focus=all',
  },
  {
    id: 'protected',
    label: '2. Protected branch',
    blurb: 'Защищённая ветка маршрутов с сохранением намерения и route guard loader.',
    href: '/protected-workspace/dashboard',
  },
  {
    id: 'roles',
    label: '3. Roles and access',
    blurb: 'Роли, 403-гейты и доступ на уровне конкретных экранов.',
    href: '/role-access/editor-lab',
  },
  {
    id: 'session',
    label: '4. Session lifecycle',
    blurb: 'Токены, refresh, logout, истечение сессии и audit trail.',
    href: '/session-lifecycle',
  },
  {
    id: 'ux',
    label: '5. Auth UX',
    blurb: 'Login route, redirect intent, сохранение намерения и мягкий вход.',
    href: '/auth-ux?next=/protected-workspace/dashboard',
  },
  {
    id: 'architecture',
    label: '6. Access architecture',
    blurb: 'Где должны жить auth state, route guards и role-based правила.',
    href: '/access-architecture',
  },
] as const;
