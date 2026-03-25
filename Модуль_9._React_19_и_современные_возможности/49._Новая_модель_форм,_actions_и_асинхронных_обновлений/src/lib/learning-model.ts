export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'form-action'
  | 'use-action-state'
  | 'form-action-buttons'
  | 'form-status'
  | 'workflow-playbook';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'overview',
    label: 'Actions overview',
    blurb: 'Что меняется в модели формы, когда submit описывается как action.',
    href: '/actions-overview?focus=all',
  },
  {
    id: 'form-action',
    label: 'Form action',
    blurb: 'Форма как прямой источник async action без ручного onSubmit-шума.',
    href: '/form-action-basics',
  },
  {
    id: 'use-action-state',
    label: 'useActionState',
    blurb: 'Validation, result state и pending без ручных setPending/setError цепочек.',
    href: '/use-action-state',
  },
  {
    id: 'form-action-buttons',
    label: 'formAction',
    blurb: 'Несколько submit outcomes из одной формы через отдельные action-кнопки.',
    href: '/form-action-buttons',
  },
  {
    id: 'form-status',
    label: 'useFormStatus',
    blurb: 'Pending и snapshot текущей отправки изнутри самой формы.',
    href: '/form-status-flow',
  },
  {
    id: 'workflow-playbook',
    label: 'Playbook',
    blurb: 'Когда достаточно plain action, а когда нужен useActionState или formAction.',
    href: '/workflow-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
