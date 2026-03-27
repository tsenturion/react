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
import { ConcurrencyPlaybookPage } from './pages/ConcurrencyPlaybookPage';
import { ConcurrentSearchPage } from './pages/ConcurrentSearchPage';
import { DeferredValuePage } from './pages/DeferredValuePage';
import { OverviewPage } from './pages/OverviewPage';
import { StartTransitionPage } from './pages/StartTransitionPage';
import { TransitionPriorityPage } from './pages/TransitionPriorityPage';

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
            <span className="soft-label">Модуль 8 / Урок 47</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Concurrent React и неблокирующий UI
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете Concurrent React через реальные сценарии: тяжёлый поиск,
              ввод, фильтрацию, переключение экранов и большие списки. Фокус темы не в
              магическом ускорении, а в разделении срочных и несрочных обновлений.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Priorities
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ввод, cursor и быстрый feedback часто должны оставаться срочными даже
                рядом с дорогим render pass.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Heavy consumers
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Поиск, фильтрация и тяжёлые списки лучше всего показывают, зачем разделять
                urgent и background work.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Trade-offs
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Concurrent APIs полезны только там, где bottleneck действительно связан с
                приоритетами, а не с общей архитектурой компонента.
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
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50',
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    'mt-1 block text-xs leading-5',
                    activeLabId === item.id ? 'text-amber-100' : 'text-slate-500',
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
              Как смотреть на Concurrent React
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала сигнал</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Есть ли реально срочный feedback, который нужно защитить от тяжёлого
                  subtree ниже по дереву.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом инструмент</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  `useTransition`, `startTransition` и `useDeferredValue` решают похожие,
                  но не одинаковые задачи.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом граница</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Если bottleneck структурный, concurrent APIs не заменят нормальную
                  локализацию state и разумную ширину render tree.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Router transitions
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
                <li>`src/components/concurrent/TransitionPriorityLab.tsx`</li>
                <li>`src/components/concurrent/StartTransitionLab.tsx`</li>
                <li>`src/components/concurrent/DeferredValueLab.tsx`</li>
                <li>`src/components/concurrent/ConcurrentSearchLab.tsx`</li>
                <li>`src/lib/search-workload-model.ts`</li>
                <li>`src/lib/concurrency-playbook-model.ts`</li>
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
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Начинайте с `src/lib/*-model.ts`: там видно, какой тип работы
                    считается срочным, какой может уйти в background и где concurrent APIs
                    вообще нужны.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Затем переходите к sandboxes: те же правила проходят через input,
                    фильтрацию, screen switches и большие projection списков.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Комментарии в коде отмечают места, где concurrent APIs применены
                    осознанно ради сценария урока, а не как универсальный шаблон.
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
                    className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                Стек вынесен вниз, чтобы фокус урока оставался на приоритетах обновлений,
                heavy consumers и отзывчивости UI.
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
          Для урока про Concurrent React это повод проверить, не спряталась ли тяжёлая
          работа в unexpected synchronous path или не смешались ли уровни приоритета.
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
          to="/concurrent-overview?focus=all"
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
        element: <Navigate to="/concurrent-overview?focus=all" replace />,
      },
      {
        path: 'concurrent-overview',
        element: <OverviewPage />,
      },
      {
        path: 'use-transition-priority',
        element: <TransitionPriorityPage />,
      },
      {
        path: 'start-transition-workflows',
        element: <StartTransitionPage />,
      },
      {
        path: 'deferred-value-search',
        element: <DeferredValuePage />,
      },
      {
        path: 'non-blocking-search',
        element: <ConcurrentSearchPage />,
      },
      {
        path: 'concurrency-playbook',
        element: <ConcurrencyPlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/concurrent-overview?focus=all" replace />,
      },
    ],
  },
]);
