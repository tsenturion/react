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

import { describeLabFromPath, lessonLabs } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { stackBadges } from './lib/stack-meta';
import { AsyncServerPage } from './pages/AsyncServerPage';
import { CompositionPage } from './pages/CompositionPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { OverviewPage } from './pages/OverviewPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { TradeoffPage } from './pages/TradeoffPage';

function LessonLayout() {
  const location = useLocation();
  const activeLabId = describeLabFromPath(location.pathname);
  const transitionLog = useSyncExternalStore(
    shellTransitionLogStore.subscribe,
    shellTransitionLogStore.getSnapshot,
    shellTransitionLogStore.getSnapshot,
  );

  useEffect(() => {
    shellTransitionLogStore.record(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 10 / Урок 54</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              React Server Components и границы server/client
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете mixed architecture: что реально исполняется на сервере,
              что обязано стать client island, как проектировать async server components и
              почему одна граница меняет bundle, данные и модель мышления разработчика.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Server default
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Стартовая точка здесь — server layer. Client включается только там, где
                нужна реальная browser-интерактивность.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Mixed composition
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Важна не только директива, но и import direction: кто кого имеет право
                импортировать и где проходит допустимая mixed boundary.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Bundle pressure
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Каждая лишняя client boundary расширяет hydrate graph и меняет доступ к
                данным. Это видно не в теории, а в архитектурных цифрах урока.
              </p>
            </div>
          </div>
        </header>

        <nav className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {lessonLabs.map((item) => (
              <NavLink
                key={item.id}
                to={item.href}
                className={clsx(
                  'rounded-2xl px-4 py-3 text-left transition',
                  activeLabId === item.id
                    ? 'bg-sky-700 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50',
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    'mt-1 block text-xs leading-5',
                    activeLabId === item.id ? 'text-sky-100' : 'text-slate-500',
                  )}
                >
                  {item.blurb}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Как смотреть на lesson 54
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала слой</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Для каждого блока решайте, где он должен исполняться: рядом с серверными
                  данными или внутри browser event loop.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом композиция</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Проверьте import direction и способ передачи server output в client
                  wrappers. Это определяет реальную корректность mixed tree.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом цена</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  После этого измеряйте bundle, bridge-запросы и hydration pressure.
                  Именно они показывают, насколько boundary действительно удачна.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recent routes
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
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Быстрый вход в код
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>`src/components/rsc-labs/ExecutionBoundaryLab.tsx`</li>
                <li>`src/components/rsc-labs/AsyncServerComponentsLab.tsx`</li>
                <li>`src/components/rsc-labs/CompositionBoundaryLab.tsx`</li>
                <li>`src/components/rsc-labs/BundleTradeoffLab.tsx`</li>
                <li>`src/components/rsc-labs/RscPlaybookLab.tsx`</li>
                <li>`src/server/rsc-runtime.ts`</li>
              </ul>
            </div>
          </div>
        </div>

        <main className="panel p-6 sm:p-8">
          <Outlet />
        </main>

        <footer className="mt-12 border-t border-slate-200 pt-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Как читать этот проект
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <p className="text-sm leading-6">
                    Сначала посмотрите `src/lib/*-model.ts`: там зафиксированы execution
                    boundaries, async strategy comparison, composition rules и playbook
                    выбора архитектуры.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/components/rsc-labs/*`: там те же решения
                    раскрываются через интерактивные boundary sandboxes.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого открывайте `src/server/rsc-runtime.ts`: файл показывает
                    flight-like report и помогает увидеть mixed tree уже на уровне server
                    runtime модели.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">Стек проекта</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {stackBadges.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                Стек вынесен вниз, чтобы фокус урока оставался на server/client
                boundaries, mixed composition и архитектурных trade-offs.
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
        <h2 className="text-2xl font-bold tracking-tight">Корневой маршрут упал</h2>
        <p className="mt-3 text-sm leading-6">
          Для урока про RSC это повод проверить, не смешались ли execution layers,
          composition rules и boundary contract так, что проект потерял предсказуемость.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-rose-900">
          <code>
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Unknown route error'}
          </code>
        </pre>
        <Link
          to="/rsc-overview?focus=all"
          className="mt-5 inline-flex rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Вернуться к уроку
        </Link>
      </div>
    </div>
  );
}

export const appRouter = createBrowserRouter([
  {
    id: 'lesson-shell',
    path: '/',
    element: <LessonLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/rsc-overview?focus=all" replace />,
      },
      {
        path: 'rsc-overview',
        element: <OverviewPage />,
      },
      {
        path: 'execution-boundaries',
        element: <ExecutionPage />,
      },
      {
        path: 'async-server-components',
        element: <AsyncServerPage />,
      },
      {
        path: 'server-client-composition',
        element: <CompositionPage />,
      },
      {
        path: 'bundle-and-data-tradeoffs',
        element: <TradeoffPage />,
      },
      {
        path: 'rsc-playbook',
        element: <PlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/rsc-overview?focus=all" replace />,
      },
    ],
  },
]);
