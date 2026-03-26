export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'overview' | 'props' | 'events' | 'refs' | 'states' | 'playbook';

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
      'Карта темы: component contracts, events, state, refs и устойчивость интерфейса через типы.',
    href: '/typescript-overview?focus=all',
  },
  {
    id: 'props',
    label: 'Props & children',
    blurb:
      'Как типы оформляют API компонента и делают конфликтующие варианты использования невозможными.',
    href: '/typed-props-and-children',
  },
  {
    id: 'events',
    label: 'Events & state',
    blurb:
      'ChangeEvent, FormEvent, KeyboardEvent и state union как основа предсказуемой UI-логики.',
    href: '/typed-events-and-state',
  },
  {
    id: 'refs',
    label: 'Refs & DOM',
    blurb:
      'Типизация DOM-узлов, currentTarget, таймеров и imperative сценариев внутри React-компонента.',
    href: '/typed-refs-and-dom',
  },
  {
    id: 'states',
    label: 'UI states',
    blurb:
      'Discriminated unions для loading, error, empty и ready состояний и связь типов с устойчивостью интерфейса.',
    href: '/typed-ui-states',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Как вводить TypeScript в React-проект так, чтобы типы помогали архитектуре, а не создавали шум.',
    href: '/typescript-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
