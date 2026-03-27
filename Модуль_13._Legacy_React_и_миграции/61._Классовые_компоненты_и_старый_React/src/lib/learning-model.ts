export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'overview' | 'state' | 'lifecycle' | 'refs' | 'pure' | 'maintenance';

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
      'Карта старого React mental model и места, где class-based код всё ещё реально встречается.',
    href: '/legacy-react-overview?focus=all',
  },
  {
    id: 'state',
    label: 'Class state',
    blurb: 'Очередь setState, object-form против updater-form и callback после commit.',
    href: '/class-state',
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle methods',
    blurb:
      'Mount, update, unmount, remount через key и guard discipline в componentDidUpdate.',
    href: '/lifecycle-methods',
  },
  {
    id: 'refs',
    label: 'createRef',
    blurb: 'Старый imperative bridge к DOM и uncontrolled input patterns через refs.',
    href: '/legacy-refs',
  },
  {
    id: 'pure',
    label: 'PureComponent',
    blurb: 'Shallow compare, лишние ререндеры и баги от мутации объектов по ссылке.',
    href: '/pure-component',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    blurb:
      'Class-based error boundaries, reset strategies и migration-first чтение legacy React.',
    href: '/maintenance-and-boundaries',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
