export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'overview' | 'routes' | 'auth' | 'forms' | 'data' | 'boundaries';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: '1. E2E overview',
    blurb: 'Что системный сценарий подтверждает лучше других слоёв.',
    href: '/e2e-overview?focus=all',
  },
  {
    id: 'routes',
    label: '2. Route journeys',
    blurb: 'Навигация, экраны и URL как часть E2E-пути.',
    href: '/route-journeys',
  },
  {
    id: 'auth',
    label: '3. Auth journeys',
    blurb: 'Protected route, redirect и сохранение пользовательского намерения.',
    href: '/auth-journeys',
  },
  {
    id: 'forms',
    label: '4. Form journeys',
    blurb: 'Валидация, submit и переход на review screen как один путь.',
    href: '/form-journeys',
  },
  {
    id: 'data',
    label: '5. Data journeys',
    blurb: 'Loading, retry, error и восстановление сценария целиком.',
    href: '/data-journeys',
  },
  {
    id: 'boundaries',
    label: '6. Boundaries',
    blurb: 'Когда E2E действительно нужен, а когда это уже слишком дорого.',
    href: '/e2e-boundaries',
  },
] as const;
