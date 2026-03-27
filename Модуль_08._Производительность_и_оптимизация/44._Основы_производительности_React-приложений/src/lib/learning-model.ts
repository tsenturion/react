export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'render-causes'
  | 'state-colocation'
  | 'data-structure'
  | 'bottlenecks'
  | 'premature-optimization';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Performance overview',
    blurb: 'Карта темы, сигналы и границы оптимизации.',
    href: '/performance-overview?focus=all',
  },
  {
    id: 'render-causes',
    label: 'Render causes',
    blurb: 'Почему компонент вообще ререндерится и где это лишнее.',
    href: '/render-causes',
  },
  {
    id: 'state-colocation',
    label: 'State colocation',
    blurb: 'Как placement state влияет на ширину перерисовок.',
    href: '/state-colocation',
  },
  {
    id: 'data-structure',
    label: 'Data structure',
    blurb: 'Как shape данных меняет стоимость вычислений.',
    href: '/data-structure',
  },
  {
    id: 'bottlenecks',
    label: 'Bottlenecks',
    blurb: 'Как находить настоящее узкое место вместо догадок.',
    href: '/bottlenecks',
  },
  {
    id: 'premature-optimization',
    label: 'Premature optimization',
    blurb: 'Когда оптимизировать, а когда сначала измерять.',
    href: '/premature-optimization',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
