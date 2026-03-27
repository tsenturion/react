export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'overview' | 'children' | 'clone' | 'create' | 'refs' | 'context';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Overview',
    blurb: 'Карта legacy React API и их связи с современными альтернативами.',
    href: '/legacy-api-overview?focus=all',
  },
  {
    id: 'children',
    label: 'Children API',
    blurb: 'Opaque children, Children.map/toArray/only и проверка через isValidElement.',
    href: '/children-api',
  },
  {
    id: 'clone',
    label: 'cloneElement',
    blurb:
      'Неявное внедрение props, композиция обработчиков и хрупкие точки clone-based patterns.',
    href: '/clone-element',
  },
  {
    id: 'create',
    label: 'createElement',
    blurb: 'Динамическая фабрика элементов и связь JSX с низкоуровневым React API.',
    href: '/create-element',
  },
  {
    id: 'refs',
    label: 'Refs migration',
    blurb: 'createRef, forwardRef и React 19 ref-as-prop как migration path.',
    href: '/ref-migration',
  },
  {
    id: 'context',
    label: 'Legacy context',
    blurb:
      'contextType, Consumer, исторический legacy context API и migration discipline.',
    href: '/legacy-context',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
