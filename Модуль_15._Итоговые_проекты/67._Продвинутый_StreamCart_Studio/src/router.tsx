/* eslint-disable react-refresh/only-export-components */
import clsx from 'clsx';
import { useEffect, useSyncExternalStore } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  createBrowserRouter,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
} from 'react-router-dom';

import { getCartSummary, useCartLines } from './lib/cart-store';
import { appNavItems, describeLabFromPath } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { stackBadges } from './lib/stack-meta';

function StorefrontLayout() {
  const location = useLocation();
  const activeNavId = describeLabFromPath(location.pathname);
  const transitionLog = useSyncExternalStore(
    shellTransitionLogStore.subscribe,
    shellTransitionLogStore.getSnapshot,
    shellTransitionLogStore.getSnapshot,
  );
  const lines = useCartLines();
  const cartSummary = getCartSummary(lines);

  useEffect(() => {
    shellTransitionLogStore.record(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[32px] border border-slate-200 bg-white/80 px-5 py-5 shadow-sm backdrop-blur sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                  SC
                </span>
                <div>
                  <p className="text-lg font-extrabold tracking-tight text-slate-950">
                    StreamCart
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Магазин технической одежды, обуви и снаряжения
                  </p>
                </div>
              </Link>
            </div>

            <nav className="flex flex-wrap gap-2">
              {appNavItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.href}
                  end={item.href === '/'}
                  className={clsx(
                    'rounded-full px-4 py-3 text-sm transition',
                    activeNavId === item.id
                      ? 'bg-slate-950 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  )}
                >
                  <span className="block font-semibold">{item.label}</span>
                  <span
                    className={clsx(
                      'mt-1 block max-w-[18rem] text-xs leading-5',
                      activeNavId === item.id ? 'text-slate-300' : 'text-slate-500',
                    )}
                  >
                    {item.blurb}
                  </span>
                </NavLink>
              ))}
            </nav>

            <Link
              to="/cart"
              className="inline-flex items-center gap-3 self-start rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 lg:self-auto"
            >
              <span>Корзина</span>
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-900">
                {cartSummary.itemCount}
              </span>
            </Link>
          </div>
        </header>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала продукт</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Главная, каталог, карточка товара, корзина и оформление заказа здесь
                  являются основными пользовательскими сценариями.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Архитектура за витриной
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Full-stack React решения вынесены в раздел «Платформа» и в код проекта,
                  а не подменяют собой сам магазин.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Сохраняемая корзина
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Состояние корзины сохраняется локально, поэтому приложение ведёт себя
                  как реальная сессия магазина.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Последние маршруты
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {transitionLog.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <main className="space-y-8">
          <Outlet />
        </main>

        <footer className="mt-14 border-t border-slate-200/80 pt-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">О проекте</h2>
              <div className="mt-4 space-y-3">
                <p className="text-sm leading-6 text-slate-600">
                  StreamCart в первую очередь остаётся реальным сценарием покупки.
                  Стратегия рендеринга, серверные и клиентские границы, серверные действия
                  и продакшен-подготовка показаны в разделе «Платформа» и в кодовой базе,
                  а не занимают весь интерфейс.
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  Откройте раздел «Платформа», если хотите увидеть, почему главная,
                  карточка товара, оформление заказа и внутренние экраны намеренно
                  рендерятся по-разному.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">Стек проекта</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {stackBadges.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-900"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function RootErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-950">
        <h2 className="text-2xl font-bold tracking-tight">Ошибка маршрута витрины</h2>
        <p className="mt-3 text-sm leading-6">
          Во время рендера текущего маршрута что-то пошло не так. В этом проекте такая
          ошибка обычно означает, что стоит проверить границы страницы и допущения о
          распределении ответственности между сервером и клиентом.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-rose-900">
          <code>
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Неизвестная ошибка маршрута'}
          </code>
        </pre>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <StorefrontLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/HomePage')).HomePage,
        }),
      },
      {
        path: 'catalog',
        lazy: async () => ({
          Component: (await import('./pages/CatalogPage')).CatalogPage,
        }),
      },
      {
        path: 'product/:productSlug',
        lazy: async () => ({
          Component: (await import('./pages/ProductPage')).ProductPage,
        }),
      },
      {
        path: 'cart',
        lazy: async () => ({
          Component: (await import('./pages/CartPage')).CartPage,
        }),
      },
      {
        path: 'checkout',
        lazy: async () => ({
          Component: (await import('./pages/CheckoutPage')).CheckoutPage,
        }),
      },
      {
        path: 'platform',
        lazy: async () => ({
          Component: (await import('./pages/PlatformPage')).PlatformPage,
        }),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
