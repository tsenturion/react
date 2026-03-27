export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'basics' | 'tree' | 'navigation' | 'params' | 'spa' | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'basics',
    label: '1. Client-side routing',
    blurb: 'Link vs reload, SPA-переходы и что реально меняется при навигации.',
    href: '/client-routing',
  },
  {
    id: 'tree',
    label: '2. Route tree',
    blurb: 'Общий layout route, дочерние страницы и текущее совпадение URL с маршрутом.',
    href: '/route-tree',
  },
  {
    id: 'navigation',
    label: '3. Navigation',
    blurb:
      'Link, NavLink, useNavigate, история переходов и экраны без полной перезагрузки.',
    href: '/navigation',
  },
  {
    id: 'params',
    label: '4. Route params',
    blurb:
      'Динамический сегмент URL и повторное использование одного экрана для разных сущностей.',
    href: '/params/module-6',
  },
  {
    id: 'spa',
    label: '5. SPA mental model',
    blurb: 'Как URL, shell state и экраны складываются в модель SPA-приложения.',
    href: '/spa-mental-model',
  },
  {
    id: 'architecture',
    label: '6. Routing architecture',
    blurb: 'Когда экран достоин маршрута, а когда достаточно локального состояния.',
    href: '/routing-architecture',
  },
] as const;
