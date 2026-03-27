export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'transitions'
  | 'deferred-value'
  | 'effect-event'
  | 'activity'
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
      'Карта urgent и non-urgent обновлений, deferred reading и управления поддеревьями.',
    href: '/priority-overview?focus=all',
  },
  {
    id: 'transitions',
    label: 'Transitions',
    blurb:
      'useTransition и startTransition для разделения срочных и несрочных обновлений.',
    href: '/transitions',
  },
  {
    id: 'deferred-value',
    label: 'useDeferredValue',
    blurb:
      'Отстающее представление для тяжёлой фильтрации и современного responsive search UX.',
    href: '/deferred-value',
  },
  {
    id: 'effect-event',
    label: 'useEffectEvent',
    blurb: 'Effect-local logic с доступом к актуальным значениям без лишних resubscribe.',
    href: '/effect-event',
  },
  {
    id: 'activity',
    label: 'Activity',
    blurb: 'Управление видимостью поддеревьев и сохранением их локального состояния.',
    href: '/activity-visibility',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Как выбирать между обычным state, transitions, deferred value, effect event и Activity.',
    href: '/priority-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
