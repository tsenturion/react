export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'labels'
  | 'keyboard'
  | 'semantics'
  | 'testing'
  | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: '1. Accessibility overview',
    blurb: 'Как доступность проходит через shell, формы, навигацию и тесты.',
    href: '/a11y-overview?focus=all',
  },
  {
    id: 'labels',
    label: '2. Labels and names',
    blurb: 'Подписи, accessible names, helper text и ошибки формы.',
    href: '/labels-and-names',
  },
  {
    id: 'keyboard',
    label: '3. Keyboard and focus',
    blurb: 'Focus order, диалоги, Escape и возврат к триггеру.',
    href: '/keyboard-and-focus',
  },
  {
    id: 'semantics',
    label: '4. Semantics and roles',
    blurb: 'Native HTML, landmarks и ARIA only when needed.',
    href: '/semantics-and-roles',
  },
  {
    id: 'testing',
    label: '5. Testing and audits',
    blurb: 'Проверка ролей, keyboard flow и доступных имён в тестах.',
    href: '/testing-and-audits',
  },
  {
    id: 'architecture',
    label: '6. A11y architecture',
    blurb: 'Как доступность влияет на компоненты, маршруты и стратегию качества.',
    href: '/a11y-architecture',
  },
] as const;
