export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'execution'
  | 'async-server'
  | 'composition'
  | 'tradeoffs'
  | 'playbook';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Overview',
    blurb:
      'Что реально исполняется на сервере, что на клиенте и почему граница важнее названия компонента.',
    href: '/rsc-overview?focus=all',
  },
  {
    id: 'execution',
    label: 'Execution map',
    blurb:
      'Интерактивная карта того, какие части экрана выгодно оставить server, а какие обязаны стать client.',
    href: '/execution-boundaries',
  },
  {
    id: 'async-server',
    label: 'Async server',
    blurb:
      'Async server components, data availability до hydration и разница с client fetch после загрузки JS.',
    href: '/async-server-components',
  },
  {
    id: 'composition',
    label: 'Composition',
    blurb:
      'Как server и client слои компонуются друг с другом и где проходят реальные import boundaries.',
    href: '/server-client-composition',
  },
  {
    id: 'tradeoffs',
    label: 'Trade-offs',
    blurb:
      'Как выбор границы меняет bundle, bridge-запросы, доступность данных и давление на hydration.',
    href: '/bundle-and-data-tradeoffs',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Практический алгоритм выбора между server default, client island и смешанной композицией.',
    href: '/rsc-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
