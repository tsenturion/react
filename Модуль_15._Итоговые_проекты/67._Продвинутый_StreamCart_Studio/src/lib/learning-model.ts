export type StatusTone = 'success' | 'warn' | 'error';

export type NavId = 'home' | 'catalog' | 'cart' | 'checkout' | 'platform';

export const appNavItems: readonly {
  id: NavId;
  label: string;
  blurb: string;
  href: string;
}[] = [
  {
    id: 'home',
    label: 'Главная',
    blurb: 'Витрина магазина с главным баннером, подборками и новинками.',
    href: '/',
  },
  {
    id: 'catalog',
    label: 'Каталог',
    blurb: 'Каталог с поиском, фильтрами и быстрыми клиентскими взаимодействиями.',
    href: '/catalog',
  },
  {
    id: 'cart',
    label: 'Корзина',
    blurb: 'Корзина с сохранением состояния, редактированием позиций и итогами заказа.',
    href: '/cart',
  },
  {
    id: 'checkout',
    label: 'Оформление',
    blurb: 'Оформление заказа с серверными действиями и понятным статусом отправки.',
    href: '/checkout',
  },
  {
    id: 'platform',
    label: 'Платформа',
    blurb:
      'Архитектурная страница про SSR, потоковую отдачу, серверные границы и продакшен-подготовку.',
    href: '/platform',
  },
] as const;

export function describeLabFromPath(pathname: string): NavId {
  if (pathname.startsWith('/product/')) {
    return 'catalog';
  }

  const match = appNavItems.find((item) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  );

  return match?.id ?? 'home';
}
