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
import { DataPage } from './pages/DataPage';
import { FrameworksPage } from './pages/FrameworksPage';
import { OverviewPage } from './pages/OverviewPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { RenderingPage } from './pages/RenderingPage';
import { RoutesPage } from './pages/RoutesPage';

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
            <span className="soft-label">Модуль 10 / Урок 56</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Framework-based React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете framework-first подход в современном React: почему Next.js
              и React Router framework mode собирают маршруты, серверный рендеринг,
              загрузку данных и мутации в единую архитектурную поверхность, а не в набор
              случайно склеенных библиотек.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Framework surface
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Routing, data, SSR, forms и server logic всё чаще проектируются как одна
                framework-owned система, а не как набор отдельных решений.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Route ownership
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Экран становится route module или segment tree со своими layout, data,
                error surface и мутациями, а не только client-компонентом.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Platform direction
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Partial prerendering, streaming и resume/prerender family APIs задают
                направление платформы, но требуют трезвого разделения между stable и
                emerging.
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
              Как смотреть на lesson 56
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала surface</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Определите, нужен ли продукту framework-owned routing/data/rendering,
                  или пока хватает локального SPA-подхода.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Потом route ownership
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Смотрите, где экран реально владеет своими data surface, layouts,
                  ошибками и server-side поведением.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом rendering</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  И только после этого обсуждайте SSR, streaming, PPR и новые platform
                  direction APIs в привязке к конкретному framework.
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
                <li>`src/components/framework-labs/FrameworkComparisonLab.tsx`</li>
                <li>`src/components/framework-labs/RouteStructureLab.tsx`</li>
                <li>`src/components/framework-labs/DataFlowLab.tsx`</li>
                <li>`src/components/framework-labs/RenderingDirectionLab.tsx`</li>
                <li>`src/components/framework-labs/FrameworkPlaybookLab.tsx`</li>
                <li>`src/server/framework-runtime.ts`</li>
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
                    Сначала посмотрите `src/lib/*-model.ts`: там собраны framework
                    profiles, route structures, rendering plans и playbook выбора.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/components/framework-labs/*`: там эти решения
                    раскрываются через интерактивные sandboxes и сравнения.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого открывайте `src/server/framework-runtime.ts`: файл
                    показывает учебный full-stack pipeline маршрута и делает тему видимой
                    не только в UI, но и в коде runtime-модели.
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
                Стек вынесен вниз, чтобы фокус оставался на framework-first мышлении,
                route-owned архитектуре и rendering strategy, а не на витрине технологий.
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
          Для урока про framework-based React это повод проверить, не распалась ли связь
          между route modules, data loading, rendering strategy и общей framework surface.
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
          to="/framework-overview?focus=all"
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
        element: <Navigate to="/framework-overview?focus=all" replace />,
      },
      {
        path: 'framework-overview',
        element: <OverviewPage />,
      },
      {
        path: 'framework-choice',
        element: <FrameworksPage />,
      },
      {
        path: 'route-modules-and-structure',
        element: <RoutesPage />,
      },
      {
        path: 'full-stack-data-flow',
        element: <DataPage />,
      },
      {
        path: 'rendering-strategies-and-direction',
        element: <RenderingPage />,
      },
      {
        path: 'framework-playbook',
        element: <PlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/framework-overview?focus=all" replace />,
      },
    ],
  },
]);
