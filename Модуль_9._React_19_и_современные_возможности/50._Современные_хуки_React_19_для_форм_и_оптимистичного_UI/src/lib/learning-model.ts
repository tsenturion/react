export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'use-action-state'
  | 'use-form-status'
  | 'use-optimistic'
  | 'pending-error-result'
  | 'hooks-playbook';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Hooks overview',
    blurb:
      'Как React 19 меняет модель формы через returned state, form status и optimistic overlay.',
    href: '/hooks-overview?focus=all',
  },
  {
    id: 'use-action-state',
    label: 'useActionState',
    blurb: 'Returned state, validation и result UX рядом с самой формой.',
    href: '/use-action-state',
  },
  {
    id: 'use-form-status',
    label: 'useFormStatus',
    blurb: 'Pending и payload snapshot внутри ближайшей формы без props drilling.',
    href: '/use-form-status',
  },
  {
    id: 'use-optimistic',
    label: 'useOptimistic',
    blurb: 'Мгновенный отклик UI до server confirmation и откат при отказе.',
    href: '/use-optimistic',
  },
  {
    id: 'pending-error-result',
    label: 'Full workflow',
    blurb: 'Как pending, error, result и optimistic UI складываются в один поток.',
    href: '/pending-error-result',
  },
  {
    id: 'hooks-playbook',
    label: 'Playbook',
    blurb: 'Когда нужен один hook, а когда форма требует связки нескольких API.',
    href: '/hooks-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
