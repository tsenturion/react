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
import { ConstraintsPage } from './pages/ConstraintsPage';
import { DirectivesPage } from './pages/DirectivesPage';
import { FormsPage } from './pages/FormsPage';
import { InvocationPage } from './pages/InvocationPage';
import { OverviewPage } from './pages/OverviewPage';
import { PlaybookPage } from './pages/PlaybookPage';

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
            <span className="soft-label">Модуль 10 / Урок 55</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Server Functions, директивы и формы с серверной логикой
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете, как `use client`, `use server` и Server Functions меняют
              full-stack React: где проходит серверная граница, почему форма становится
              естественной точкой асинхронного действия и как убрать часть ручного
              API-слоя, не разрушая архитектурную дисциплину.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Boundary first
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `use client` и `use server` задают не стиль кода, а среду исполнения,
                доступные APIs, сериализацию и цену интерактивности.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Submit as flow
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Форма становится реальной границей server logic: submit запускает мутацию,
                а pending, ошибки и результат возвращаются обратно в UI.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Client stays narrow
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Даже с server functions не всё должно ехать на сервер. Client island
                остаётся там, где действительно нужен browser event loop.
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
              Как смотреть на lesson 55
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала граница</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Для каждого блока решайте, где он должен жить: на сервере рядом с
                  данными и мутациями или в client island рядом с input и browser APIs.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом поток</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  После этого смотрите на submit: что пересекает server boundary, где
                  живёт валидация и нужен ли вообще ручной API-слой.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом ограничения</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  И только затем проверяйте ограничения: сериализацию, browser APIs, live
                  typing и границы того, что нельзя отдавать на сервер.
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
                <li>`src/components/server-functions-labs/DirectiveBoundaryLab.tsx`</li>
                <li>`src/components/server-functions-labs/InvocationFlowLab.tsx`</li>
                <li>`src/components/server-functions-labs/ServerFormsLab.tsx`</li>
                <li>`src/components/server-functions-labs/ConstraintsLab.tsx`</li>
                <li>
                  `src/components/server-functions-labs/ServerFunctionsPlaybookLab.tsx`
                </li>
                <li>`src/server/server-functions-runtime.ts`</li>
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
                    boundaries, form flow, ограничения и playbook выбора server function
                    стратегии.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/components/server-functions-labs/*`: там та же
                    тема раскрывается через интерактивные sandboxes и формы.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого открывайте `src/server/server-functions-runtime.ts`: файл
                    показывает server-side слой урока и делает тему видимой не только в
                    UI, но и в коде серверной логики.
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
                Стек вынесен вниз, чтобы основной фокус оставался на server boundaries,
                формах с серверной логикой и правилах, которые определяют новый full-stack
                flow.
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
          Для урока про Server Functions это повод проверить, не смешались ли client
          layer, серверная граница, submit flow и ограничения runtime так, что проект
          потерял предсказуемость.
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
          to="/server-functions-overview?focus=all"
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
        element: <Navigate to="/server-functions-overview?focus=all" replace />,
      },
      {
        path: 'server-functions-overview',
        element: <OverviewPage />,
      },
      {
        path: 'directives-and-boundaries',
        element: <DirectivesPage />,
      },
      {
        path: 'server-function-invocation',
        element: <InvocationPage />,
      },
      {
        path: 'forms-with-server-logic',
        element: <FormsPage />,
      },
      {
        path: 'server-function-constraints',
        element: <ConstraintsPage />,
      },
      {
        path: 'server-functions-playbook',
        element: <PlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/server-functions-overview?focus=all" replace />,
      },
    ],
  },
]);
