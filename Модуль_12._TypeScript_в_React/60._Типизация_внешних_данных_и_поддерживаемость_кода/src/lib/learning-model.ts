export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'schemas'
  | 'requests'
  | 'mutations'
  | 'routes'
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
      'Где заканчивается статическая типизация и почему внешние payload требуют runtime validation.',
    href: '/external-data-overview?focus=all',
  },
  {
    id: 'schemas',
    label: 'Schema boundary',
    blurb: 'Zod как граница доверия между unknown-данными и дальнейшим TypeScript-кодом.',
    href: '/schema-boundaries',
  },
  {
    id: 'requests',
    label: 'Validated requests',
    blurb:
      'Envelope parsing, schema-aware loading/error/empty branches и устойчивый fetch flow.',
    href: '/validated-requests',
  },
  {
    id: 'mutations',
    label: 'Mutations & forms',
    blurb:
      'Form payload, submit response и mutation lifecycle через одну runtime schema discipline.',
    href: '/validated-mutations',
  },
  {
    id: 'routes',
    label: 'Route contracts',
    blurb:
      'Где parse выгоднее: в loader boundary, внутри компонента или вообще не должен пропускаться в UI.',
    href: '/route-contracts',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Как внедрять runtime validation точечно и поддерживаемо, а не превращать её в шум.',
    href: '/external-data-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
