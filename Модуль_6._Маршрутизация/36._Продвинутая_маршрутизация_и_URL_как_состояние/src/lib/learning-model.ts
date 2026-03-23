export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'nested'
  | 'layouts'
  | 'search'
  | 'url-state'
  | 'entities'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'nested',
    label: '1. Nested routes',
    blurb: 'Route tree разбивается на parent route и leaf screens.',
    href: '/nested-routes/module-6',
  },
  {
    id: 'layouts',
    label: '2. Layout routes',
    blurb: 'Общий layout route сохраняет своё состояние, пока меняется child branch.',
    href: '/layout-routes/overview',
  },
  {
    id: 'search',
    label: '3. Search params',
    blurb: 'Фильтры, сортировка и view mode управляются через query string.',
    href: '/search-params?level=all&sort=popular&view=cards',
  },
  {
    id: 'url-state',
    label: '4. URL as state',
    blurb: 'Tabs, statuses и screen mode могут быть частью одного устойчивого URL.',
    href: '/url-state?tab=outline&status=all&sort=progress',
  },
  {
    id: 'entities',
    label: '5. Selected entity',
    blurb: 'Path param хранит сущность, query string уточняет режим экрана.',
    href: '/entities/module-6?tab=overview&panel=summary',
  },
  {
    id: 'architecture',
    label: '6. Navigation design',
    blurb: 'Когда нужны nested routes, search params, path params или local state.',
    href: '/navigation-architecture',
  },
] as const;
