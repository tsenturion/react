export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'component-splitting'
  | 'route-splitting'
  | 'suspense-boundaries'
  | 'progressive-loading'
  | 'split-strategy';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Lazy loading overview',
    blurb: 'Карта темы: split points, Suspense и цена fallback-границ.',
    href: '/lazy-loading-overview?focus=all',
  },
  {
    id: 'component-splitting',
    label: 'Component splitting',
    blurb: 'React.lazy для тяжёлых panel, editor и analytics виджетов.',
    href: '/component-lazy-loading',
  },
  {
    id: 'route-splitting',
    label: 'Route splitting',
    blurb: 'Code splitting на уровне маршрутов и устойчивый shell приложения.',
    href: '/route-code-splitting',
  },
  {
    id: 'suspense-boundaries',
    label: 'Suspense boundaries',
    blurb: 'Где ставить fallback, чтобы не блокировать весь экран без причины.',
    href: '/suspense-boundaries',
  },
  {
    id: 'progressive-loading',
    label: 'Progressive loading',
    blurb: 'Как строить ощущение отзывчивости, а не просто крутить spinner.',
    href: '/progressive-loading',
  },
  {
    id: 'split-strategy',
    label: 'Split strategy',
    blurb: 'Когда split полезен, а когда превращается в лишнюю сетевую дробность.',
    href: '/split-strategy',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
