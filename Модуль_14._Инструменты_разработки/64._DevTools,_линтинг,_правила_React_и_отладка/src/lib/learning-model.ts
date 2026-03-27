export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'overview' | 'devtools' | 'lint' | 'rules' | 'debug' | 'quality';

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
      'Карта инструментов: DevTools, ESLint, Rules of React и debugging workflow как единая система.',
    href: '/tooling-overview?focus=all',
  },
  {
    id: 'devtools',
    label: 'DevTools',
    blurb:
      'Инспекция props, state, context и причин рендера через devtools-style mental model.',
    href: '/devtools-inspector',
  },
  {
    id: 'lint',
    label: 'Linting',
    blurb: 'ESLint, eslint-plugin-react-hooks и архитектурные сигналы качества проекта.',
    href: '/lint-rules',
  },
  {
    id: 'rules',
    label: 'Rules of React',
    blurb:
      'Conditional hooks, component factories, refs during render, purity и unsupported syntax.',
    href: '/rules-of-react',
  },
  {
    id: 'debug',
    label: 'Debug flow',
    blurb:
      'Как искать баги через связку DevTools, lint, profiler-style reasoning и тестов.',
    href: '/debugging-workflow',
  },
  {
    id: 'quality',
    label: 'Quality system',
    blurb:
      'Инструменты разработки как системный контур качества, а не набор независимых кнопок.',
    href: '/quality-control-system',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
