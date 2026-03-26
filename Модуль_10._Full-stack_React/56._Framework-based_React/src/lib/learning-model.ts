export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'frameworks'
  | 'routes'
  | 'data'
  | 'rendering'
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
      'Framework-first mental model: Next.js, React Router framework mode и современное направление full-stack React.',
    href: '/framework-overview?focus=all',
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    blurb:
      'Сравнение Next.js, React Router framework mode и ручного SPA/DIY пути по встроенным возможностям.',
    href: '/framework-choice',
  },
  {
    id: 'routes',
    label: 'Route modules',
    blurb:
      'Файловая структура, layouts, route modules и то, как framework организует full-stack код вокруг экранов.',
    href: '/route-modules-and-structure',
  },
  {
    id: 'data',
    label: 'Data flow',
    blurb:
      'Как framework управляет data loading, server mutations и запросами без ручной инфраструктуры вокруг каждого экрана.',
    href: '/full-stack-data-flow',
  },
  {
    id: 'rendering',
    label: 'Rendering',
    blurb:
      'SSR, streaming, partial prerendering и направление resume/prerender family APIs в framework-first мире.',
    href: '/rendering-strategies-and-direction',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Когда нужен полноценный React framework, когда хватит SPA, и как выбирать между Next.js и React Router.',
    href: '/framework-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
