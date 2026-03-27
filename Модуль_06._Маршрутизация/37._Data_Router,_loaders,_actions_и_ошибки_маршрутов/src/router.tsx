/* eslint-disable react-refresh/only-export-components */
import clsx from 'clsx';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  useLocation,
  useLoaderData,
  useNavigation,
  useRouteError,
} from 'react-router-dom';

import { lessonLabs } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { describeLabFromPath } from './lib/data-router-domain';
import {
  actionsAction,
  actionsLoader,
  comparisonLoader,
  errorRouteLoader,
  lessonShellLoader,
  loaderBranchLoader,
  loaderLessonLoader,
  overviewLoader,
  type LessonShellLoaderData,
} from './lib/data-router-runtime';
import { stackBadges } from './lib/stack-meta';
import { ActionsPage } from './pages/ActionsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ErrorRouteBoundary } from './pages/ErrorRouteBoundary';
import { ErrorRoutesPage } from './pages/ErrorRoutesPage';
import { LoaderLessonErrorBoundary } from './pages/LoaderLessonErrorBoundary';
import { LoaderLessonPage } from './pages/LoaderLessonPage';
import { LoaderTreePage } from './pages/LoaderTreePage';
import { OverviewPage } from './pages/OverviewPage';

function LessonLayout() {
  const shellData = useLoaderData() as LessonShellLoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в route shell и сохраняется, пока меняются только дочерние data routes.',
  );
  const nextLocation = navigation.location;
  const currentLocation = nextLocation ?? location;
  const currentStamp = `${currentLocation.pathname}${currentLocation.search}`;
  const activeLabId = describeLabFromPath(location.pathname);
  const transitionLog = useSyncExternalStore(
    shellTransitionLogStore.subscribe,
    shellTransitionLogStore.getSnapshot,
    shellTransitionLogStore.getSnapshot,
  );

  useEffect(() => {
    shellTransitionLogStore.record(currentStamp);
  }, [currentStamp]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 6 / Урок 37</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Data Router, loaders, actions и ошибки маршрутов
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете `createBrowserRouter`, `RouterProvider`, loaders,
              actions, route-level data, route error boundaries и то, как маршрутизатор
              начинает управлять не только отображением, но и данными.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только `useLoaderData` и `Form`, но и nested loaders, actions,
                revalidation, errorElement и route-level data flow.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам проект живёт на `createBrowserRouter`: route objects здесь управляют
                branch UI, загрузкой данных, submit flow и route error handling.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Loader и action нужны там, где navigation действительно связана с данными.
                Локальный widget fetch и route-critical data flow не обязаны жить в одном
                слое.
              </p>
            </div>
          </div>
        </header>

        <nav className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {lessonLabs.map((item) => {
              return (
                <NavLink
                  key={item.id}
                  to={item.href}
                  className={clsx(
                    'rounded-2xl px-4 py-3 text-left transition',
                    activeLabId === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-50',
                  )}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span
                    className={clsx(
                      'mt-1 block text-xs leading-5',
                      activeLabId === item.id ? 'text-blue-100' : 'text-slate-500',
                    )}
                  >
                    {item.blurb}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Route shell state
            </p>
            <label className="mt-3 block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Заметка в route shell
              </span>
              <textarea
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400"
              />
            </label>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Последняя загрузка shell loader: <strong>{shellData.loadedAt}</strong>.
              Всего playbooks: <strong>{shellData.totalPlaybooks}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Router state сейчас: <strong>{navigation.state}</strong>. Data router сам
              знает, когда branch грузится, а когда форма уже отправляется.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Router lifecycle
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
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <p className="text-sm leading-6">
                    Сначала смотрите `src/router.tsx` и `src/lib/data-router-runtime.ts`,
                    потом переходите к nested loader branch и только затем к action/error
                    лабораториям.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сопоставляйте route objects, loaders и страницы вместе: так видно, что
                    маршруты здесь управляют не только отображением, но и данными.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с `RouterProvider`, loaders, actions и nested
                    error boundaries, потому что именно там чаще всего возникает путаница
                    между route data и component data.
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
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                Здесь остаются только реальные версии инструментов, которые используются в
                текущем data-router проекте и зафиксированы в `package.json`.
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
          Этот boundary ловит сбой выше lesson shell. Если ошибка добралась сюда, значит
          локализовать её на более узком route уровне не удалось.
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
          to="/data-router-overview?track=all"
          className="mt-5 inline-flex rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Вернуться к уроку
        </Link>
      </div>
    </div>
  );
}

// Здесь route objects управляют не только JSX, но и жизненным циклом данных:
// loader/action/errorElement объявлены рядом с branch UI и образуют единый contract.
export const appRouter = createBrowserRouter([
  {
    id: 'lesson-shell',
    path: '/',
    loader: lessonShellLoader,
    element: <LessonLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        loader: () => redirect('/data-router-overview?track=all'),
      },
      {
        id: 'overview-route',
        path: 'data-router-overview',
        loader: overviewLoader,
        element: <OverviewPage />,
      },
      {
        id: 'loader-branch',
        path: 'loader-tree',
        loader: loaderBranchLoader,
        element: <LoaderTreePage />,
        children: [
          {
            index: true,
            loader: () => redirect('/loader-tree/route-loaders'),
          },
          {
            id: 'loader-leaf',
            path: ':lessonId',
            loader: loaderLessonLoader,
            element: <LoaderLessonPage />,
            errorElement: <LoaderLessonErrorBoundary />,
          },
        ],
      },
      {
        id: 'actions-route',
        path: 'actions-lab',
        loader: actionsLoader,
        action: actionsAction,
        element: <ActionsPage />,
      },
      {
        path: 'error-routes',
        children: [
          {
            index: true,
            loader: () => redirect('/error-routes/stable'),
          },
          {
            id: 'error-route',
            path: ':mode',
            loader: errorRouteLoader,
            element: <ErrorRoutesPage />,
            errorElement: <ErrorRouteBoundary />,
          },
        ],
      },
      {
        id: 'comparison-route',
        path: 'route-vs-component-data',
        loader: comparisonLoader,
        element: <ComparisonPage />,
      },
      {
        path: 'data-router-architecture',
        element: <ArchitecturePage />,
      },
      {
        path: '*',
        element: <Navigate to="/data-router-overview?track=all" replace />,
      },
    ],
  },
]);
