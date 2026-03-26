export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'overview'
  | 'directives'
  | 'invocation'
  | 'forms'
  | 'constraints'
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
      'Mental model server functions, границы `use client` и `use server`, формы и прямая серверная логика.',
    href: '/server-functions-overview?focus=all',
  },
  {
    id: 'directives',
    label: 'Directives',
    blurb:
      'Что реально должно остаться client, а что выгодно держать рядом с серверной логикой.',
    href: '/directives-and-boundaries',
  },
  {
    id: 'invocation',
    label: 'Invocation',
    blurb:
      'Сравнение manual API, server functions и прямого full-stack flow без лишней ручной обвязки.',
    href: '/server-function-invocation',
  },
  {
    id: 'forms',
    label: 'Forms',
    blurb:
      'Формы с серверной логикой, pending/error/result UX и отправка через серверную границу.',
    href: '/forms-with-server-logic',
  },
  {
    id: 'constraints',
    label: 'Constraints',
    blurb:
      'Ограничения, правила и типичные ошибки при работе с `use server`, сериализацией и browser APIs.',
    href: '/server-function-constraints',
  },
  {
    id: 'playbook',
    label: 'Playbook',
    blurb:
      'Когда server function действительно упрощает full-stack React, а когда нужен другой паттерн.',
    href: '/server-functions-playbook',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId {
  const match = lessonLabs.find((item) => pathname.startsWith(item.href.split('?')[0]));

  return match?.id ?? 'overview';
}
