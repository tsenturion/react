export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'transition-priority'
  | 'start-transition'
  | 'deferred-value'
  | 'concurrent-search'
  | 'concurrency-playbook';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Concurrent overview',
    blurb: 'Карта темы: срочные и несрочные обновления, лаг и отзывчивость.',
    href: '/concurrent-overview?focus=all',
  },
  {
    id: 'transition-priority',
    label: 'useTransition',
    blurb: 'Как отделять ввод от тяжёлой фоновой перерисовки.',
    href: '/use-transition-priority',
  },
  {
    id: 'start-transition',
    label: 'startTransition',
    blurb: 'Императивный перевод тяжёлых обновлений в несрочный приоритет.',
    href: '/start-transition-workflows',
  },
  {
    id: 'deferred-value',
    label: 'useDeferredValue',
    blurb: 'Как результат может немного отставать, сохраняя плавный ввод.',
    href: '/deferred-value-search',
  },
  {
    id: 'concurrent-search',
    label: 'Search and lists',
    blurb: 'Интегрированный поиск: deferred query, transition filters и тяжёлый список.',
    href: '/non-blocking-search',
  },
  {
    id: 'concurrency-playbook',
    label: 'Playbook',
    blurb: 'Когда concurrent APIs помогают, а когда проблема не в приоритетах.',
    href: '/concurrency-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
