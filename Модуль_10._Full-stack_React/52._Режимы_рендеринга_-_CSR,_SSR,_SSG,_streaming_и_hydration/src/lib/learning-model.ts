export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'modes'
  | 'hydration'
  | 'streaming'
  | 'architecture'
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
    blurb: 'Карта CSR, SSR, SSG, streaming, hydration и реальных последствий для UX.',
    href: '/rendering-overview?focus=all',
  },
  {
    id: 'modes',
    label: 'CSR / SSR / SSG',
    blurb:
      'Сравнение того, когда появляется HTML, когда приходит interactivity и что это стоит.',
    href: '/mode-comparison',
  },
  {
    id: 'hydration',
    label: 'Hydration',
    blurb: 'Mismatch, причины расхождений между сервером и клиентом и порядок отладки.',
    href: '/hydration-debugging',
  },
  {
    id: 'streaming',
    label: 'Streaming',
    blurb:
      'Streaming SSR, Suspense boundaries и selective hydration под пользовательское намерение.',
    href: '/streaming-and-selective-hydration',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    blurb:
      'Как режим рендеринга меняет структуру проекта, кэширование, SEO и доставку данных.',
    href: '/architecture-consequences',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Как выбирать режим рендеринга по типу продукта, контента и инфраструктурных ограничений.',
    href: '/rendering-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
