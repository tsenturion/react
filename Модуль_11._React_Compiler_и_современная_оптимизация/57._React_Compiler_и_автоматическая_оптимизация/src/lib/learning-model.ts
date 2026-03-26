export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'automatic'
  | 'configuration'
  | 'bailouts'
  | 'profiling'
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
      'Mental model React Compiler: что оптимизируется автоматически и почему это не отменяет архитектурную дисциплину.',
    href: '/compiler-overview?focus=all',
  },
  {
    id: 'automatic',
    label: 'Auto memoization',
    blurb:
      'Сравнение compiler-friendly компонентов, manual memo noise и переусложнённой мемоизации.',
    href: '/automatic-memoization',
  },
  {
    id: 'configuration',
    label: 'Config & rollout',
    blurb:
      'Compiler plugin, lint-first discipline, gating и постепенное включение без резкого миграционного риска.',
    href: '/compiler-configuration-and-rollout',
  },
  {
    id: 'bailouts',
    label: 'Bailouts',
    blurb:
      'Impure render, мутации, incompatible libraries и другие случаи, где compiler пропускает оптимизацию.',
    href: '/compiler-bailouts-and-limits',
  },
  {
    id: 'profiling',
    label: 'Profiling',
    blurb:
      'Workflow анализа: Profiler, причины ререндеров, измерение выигрыша и проверка, что проблема реальна.',
    href: '/compiler-profiling-and-debugging',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Как выбирать стратегию rollout и где React Compiler помогает, а где сначала нужен архитектурный ремонт.',
    href: '/compiler-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
