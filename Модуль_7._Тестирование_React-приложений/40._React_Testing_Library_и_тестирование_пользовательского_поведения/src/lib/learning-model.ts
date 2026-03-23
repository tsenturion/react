export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'queries'
  | 'interactions'
  | 'forms'
  | 'custom-render'
  | 'anti-patterns';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'RTL overview',
    blurb: 'User-centric mindset и карта темы.',
    href: '/rtl-overview?focus=all',
  },
  {
    id: 'queries',
    label: 'Query priority',
    blurb: 'Роли, лейблы, text queries и приоритет поиска.',
    href: '/query-priority',
  },
  {
    id: 'interactions',
    label: 'User interactions',
    blurb: 'userEvent, act и видимые последствия действий.',
    href: '/user-interactions',
  },
  {
    id: 'forms',
    label: 'Forms and errors',
    blurb: 'Ввод, submit, ошибки и success-state.',
    href: '/forms-and-errors',
  },
  {
    id: 'custom-render',
    label: 'Custom render',
    blurb: 'Когда нужны helper-обёртки с provider и router.',
    href: '/custom-render',
  },
  {
    id: 'anti-patterns',
    label: 'Anti-patterns',
    blurb: 'Как не скатиться в implementation details.',
    href: '/anti-patterns',
  },
] as const;
