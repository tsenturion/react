export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'nested'
  | 'actions'
  | 'errors'
  | 'comparison'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: '1. Data router basics',
    blurb: 'Loader читает request URL и готовит данные ещё до рендера экрана.',
    href: '/data-router-overview?track=all',
  },
  {
    id: 'nested',
    label: '2. Nested loaders',
    blurb: 'Parent и child routes получают собственные loaders и own error boundaries.',
    href: '/loader-tree/route-loaders',
  },
  {
    id: 'actions',
    label: '3. Actions',
    blurb: 'Form, action, validation и revalidation на уровне маршрута.',
    href: '/actions-lab',
  },
  {
    id: 'errors',
    label: '4. Route errors',
    blurb: 'Ошибки loader/action обрабатываются на уровне route branch.',
    href: '/error-routes/stable',
  },
  {
    id: 'comparison',
    label: '5. Route vs component data',
    blurb: 'Разница между запросом из маршрута и запросом уже после рендера компонента.',
    href: '/route-vs-component-data',
  },
  {
    id: 'architecture',
    label: '6. Data ownership',
    blurb:
      'Когда данные должны жить в loader, action, component request или plain compute.',
    href: '/data-router-architecture',
  },
] as const;
