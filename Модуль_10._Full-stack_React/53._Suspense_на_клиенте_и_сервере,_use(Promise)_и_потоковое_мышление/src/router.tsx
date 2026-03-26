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
import { ClientSuspensePage } from './pages/ClientSuspensePage';
import { LazyPage } from './pages/LazyPage';
import { OverviewPage } from './pages/OverviewPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { ServerPage } from './pages/ServerPage';
import { UsePromisePage } from './pages/UsePromisePage';

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
            <span className="soft-label">Модуль 10 / Урок 53</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Suspense на клиенте и сервере, use(Promise) и потоковое мышление
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете Suspense как систему reveal и ожидания: на клиенте, вместе
              с lazy и `use(Promise)`, а также на сервере, где границы Suspense начинают
              влиять на сам способ доставки HTML.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Boundaries first
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Важен не сам fallback, а то, какая часть интерфейса имеет право ждать
                отдельно от остального экрана.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Resource reading
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `use(Promise)` переносит ожидание внутрь render и меняет саму структуру
                загрузки данных в компоненте.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Streaming intuition
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                На сервере Suspense уже влияет на reveal HTML по частям и требует
                потокового мышления вместо ожидания «всего экрана целиком».
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
              Как смотреть на lesson 53
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала boundary</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Определите, какие части экрана могут ждать отдельно и что обязано
                  остаться видимым во время ожидания.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом ресурс</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Если данные читаются прямо в render, думайте про resource cache и
                  стабильный promise key, а не только про fallback.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом reveal HTML</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  На сервере важно уже не только ожидание данных, но и то, как shell и
                  boundaries раскрываются в самом HTML-ответе.
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
                <li>`src/components/suspense-labs/ClientSuspenseLab.tsx`</li>
                <li>`src/components/suspense-labs/LazyBoundaryLab.tsx`</li>
                <li>`src/components/suspense-labs/UsePromiseLab.tsx`</li>
                <li>`src/components/suspense-labs/ServerSuspenseLab.tsx`</li>
                <li>`src/components/suspense-labs/SuspensePlaybookLab.tsx`</li>
                <li>`src/server/suspense-runtime.tsx`</li>
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
                    Начинайте с `src/lib/*-model.ts`: там видно, как отдельно описаны
                    boundaries, resource cache, server reveal и playbook выбора подхода.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/components/suspense-labs/*`: там та же теория
                    проходит через реальные client boundaries, lazy chunks и
                    `use(Promise)`.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого смотрите `src/server/suspense-runtime.tsx`: там лежит
                    реальная серверная Suspense-механика через `renderToString` и
                    `renderToReadableStream`.
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
                Стек вынесен вниз, чтобы фокус урока оставался на Suspense mental model,
                `use(Promise)` и потоковом reveal HTML.
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
          Для урока про Suspense это повод проверить, не смешались ли boundary design,
          resource cache и server-side reveal так, что экран потерял предсказуемость
          ожидания.
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
          to="/suspense-overview?focus=all"
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
        element: <Navigate to="/suspense-overview?focus=all" replace />,
      },
      {
        path: 'suspense-overview',
        element: <OverviewPage />,
      },
      {
        path: 'client-suspense',
        element: <ClientSuspensePage />,
      },
      {
        path: 'lazy-and-suspense',
        element: <LazyPage />,
      },
      {
        path: 'use-promise',
        element: <UsePromisePage />,
      },
      {
        path: 'server-suspense-and-streaming',
        element: <ServerPage />,
      },
      {
        path: 'suspense-playbook',
        element: <PlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/suspense-overview?focus=all" replace />,
      },
    ],
  },
]);
