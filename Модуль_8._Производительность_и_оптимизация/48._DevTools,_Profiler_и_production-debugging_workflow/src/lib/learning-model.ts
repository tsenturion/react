export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'component-tree'
  | 'react-profiler'
  | 'performance-tracks'
  | 'production-debug'
  | 'workflow-playbook';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Tooling overview',
    blurb:
      'Где заканчиваются догадки и начинается нормальное profiling-driven расследование.',
    href: '/tooling-overview?focus=all',
  },
  {
    id: 'component-tree',
    label: 'Component tree',
    blurb: 'Как читать дерево компонентов, видеть лишние ререндеры и искать их источник.',
    href: '/component-tree-analysis',
  },
  {
    id: 'react-profiler',
    label: 'React Profiler',
    blurb: 'Commit timing, actual/base duration и hotspot внутри React tree.',
    href: '/react-profiler-analysis',
  },
  {
    id: 'performance-tracks',
    label: 'Performance tools',
    blurb: 'Browser Performance, marks/measures и tracks для реального interaction flow.',
    href: '/performance-tracks',
  },
  {
    id: 'production-debug',
    label: 'Production debug',
    blurb: 'Интегрированный сценарий: симптом, evidence, измерение и narrowing down.',
    href: '/production-debug-workflow',
  },
  {
    id: 'workflow-playbook',
    label: 'Playbook',
    blurb: 'Как выбирать DevTools, Profiler или browser trace под конкретную проблему.',
    href: '/workflow-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
