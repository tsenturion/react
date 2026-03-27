export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'memo-boundaries'
  | 'use-memo'
  | 'use-callback'
  | 'list-optimization'
  | 'cost-tradeoffs';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Memoization overview',
    blurb: 'Карта темы, сигналы пользы и границы мемоизации.',
    href: '/memoization-overview?focus=all',
  },
  {
    id: 'memo-boundaries',
    label: 'memo and props',
    blurb: 'Как `memo` связан со стабильностью ссылок и сравнением props.',
    href: '/memo-boundaries',
  },
  {
    id: 'use-memo',
    label: 'useMemo',
    blurb: 'Когда мемоизировать вычисления и derived data, а когда нет.',
    href: '/use-memo-derived',
  },
  {
    id: 'use-callback',
    label: 'useCallback',
    blurb: 'Как стабильность обработчиков влияет на memo-child и список.',
    href: '/use-callback-handlers',
  },
  {
    id: 'list-optimization',
    label: 'List optimization',
    blurb: 'Row memoization, стабильные props и практическая цена для списка.',
    href: '/list-optimization',
  },
  {
    id: 'cost-tradeoffs',
    label: 'Cost and trade-offs',
    blurb: 'Когда мемоизация помогает, а когда только усложняет код.',
    href: '/memo-costs-and-tradeoffs',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
