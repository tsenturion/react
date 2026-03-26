export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'reducers'
  | 'generics'
  | 'polymorphic'
  | 'design-system'
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
      'Карта advanced typing: reducer unions, generics, polymorphism, design tokens и rollout.',
    href: '/advanced-types-overview?focus=all',
  },
  {
    id: 'reducers',
    label: 'Reducers & unions',
    blurb:
      'Типизация сложной логики через `useReducer`, discriminated unions и exhaustive actions.',
    href: '/typed-reducers-and-unions',
  },
  {
    id: 'generics',
    label: 'Generic APIs',
    blurb:
      'Generic components и reusable helpers без потери выразительности и конкретного смысла.',
    href: '/generic-components-and-apis',
  },
  {
    id: 'polymorphic',
    label: 'Polymorphic',
    blurb: 'Typed `as`-pattern, смена семантики и границы polymorphic components.',
    href: '/polymorphic-components',
  },
  {
    id: 'design-system',
    label: 'Design system',
    blurb:
      'Token maps, variant recipes и typed primitives как часть архитектуры design-system слоя.',
    href: '/design-system-typing',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Как вводить advanced typing точечно и не превратить кодовую базу в витрину utility types.',
    href: '/advanced-typing-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
