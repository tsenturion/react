export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'waiting'
  | 'http-mocks'
  | 'providers'
  | 'environment'
  | 'anti-fragility';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Async overview',
    blurb: 'Карта async UI, mocks и test environment.',
    href: '/async-overview?focus=all',
  },
  {
    id: 'waiting',
    label: 'Loading and waiting',
    blurb: 'Loading, error, empty и ожидание видимого результата.',
    href: '/loading-and-waiting',
  },
  {
    id: 'http-mocks',
    label: 'Mocked HTTP',
    blurb: 'fetch, моки запросов, retries и повторные загрузки.',
    href: '/mocked-http',
  },
  {
    id: 'providers',
    label: 'Providers and context',
    blurb: 'custom render, context, router и test harness.',
    href: '/providers-and-context',
  },
  {
    id: 'environment',
    label: 'Test environment',
    blurb: 'Vitest setup, fake timers, cleanup и reset strategy.',
    href: '/test-environment',
  },
  {
    id: 'anti-fragility',
    label: 'Anti-fragility',
    blurb: 'Sleep, утечки и ложные async-срабатывания.',
    href: '/anti-fragility',
  },
] as const;
