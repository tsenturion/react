export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'client'
  | 'lazy'
  | 'use-promise'
  | 'server'
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
      'Ментальная модель Suspense, client/server ожидание и потоковая сборка интерфейса.',
    href: '/suspense-overview?focus=all',
  },
  {
    id: 'client',
    label: 'Client Suspense',
    blurb:
      'Как одна и та же загрузка выглядит с одной общей границей и с разбивкой на части.',
    href: '/client-suspense',
  },
  {
    id: 'lazy',
    label: 'lazy + Suspense',
    blurb: 'Code splitting, локальные fallback и влияние границы на уже видимый UI.',
    href: '/lazy-and-suspense',
  },
  {
    id: 'use-promise',
    label: 'use(Promise)',
    blurb:
      'Resource reading, общий promise cache и отличие shared read от дублируемых ожиданий.',
    href: '/use-promise',
  },
  {
    id: 'server',
    label: 'Server Suspense',
    blurb:
      'Suspense на сервере, streaming intuition и различие между client wait и streamed HTML.',
    href: '/server-suspense-and-streaming',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Как выбирать между spinner, split boundaries, lazy, use(Promise) и server streaming.',
    href: '/suspense-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
