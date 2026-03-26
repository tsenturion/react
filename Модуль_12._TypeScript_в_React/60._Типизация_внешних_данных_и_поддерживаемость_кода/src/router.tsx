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
import { MutationValidationPage } from './pages/MutationValidationPage';
import { OverviewPage } from './pages/OverviewPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { RouteContractsPage } from './pages/RouteContractsPage';
import { SchemaBoundaryPage } from './pages/SchemaBoundaryPage';
import { ValidatedRequestsPage } from './pages/ValidatedRequestsPage';

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
            <span className="soft-label">Модуль 12 / Урок 60</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Типизация внешних данных и поддерживаемость кода
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете самую болезненную границу full-stack React: TypeScript
              внутри приложения заканчивается там, где начинаются внешние
              `unknown`-данные. Поэтому запросы, формы, мутации и route loaders должны
              проходить через runtime schemas, а не через `as SomeType`.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Static types stop here
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                TypeScript не может подтвердить payload снаружи. До runtime parse эти
                данные остаются недоверенными.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Schemas create trust
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `Zod` превращает схему в границу доверия для запросов, форм, мутаций и
                route-level data.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Maintainability scales
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Shared schema снижает дрейф между клиентом, сервером, роутами и reusable
                data helpers.
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
              Как смотреть на lesson 60
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала boundary</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Начните с точки, где типы заканчиваются и почему внешний payload нельзя
                  считать безопасным до parse.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом data flow</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Затем переходите к запросам, формам и мутациям: там лучше всего видно,
                  как schema discipline стабилизирует UI.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом architecture</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  После этого изучайте route contracts и playbook: именно там тема
                  превращается в поддерживаемый full-stack workflow.
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
                <li>`src/lib/zod-schema-boundary-model.ts`</li>
                <li>`src/lib/request-validation-model.ts`</li>
                <li>`src/lib/mutation-validation-model.ts`</li>
                <li>`src/lib/route-contract-model.ts`</li>
                <li>`src/components/external-data-labs/SchemaBoundaryLab.tsx`</li>
                <li>`src/components/external-data-labs/RouteContractsLab.tsx`</li>
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
                    Сначала открывайте `src/lib/*model.ts`: там лежат схемы, envelope
                    parsers, form contracts и route boundary стратегии.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/components/external-data-labs/*`: там видно,
                    как runtime validation влияет на реальный UI и async flow.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого изучайте `src/router.tsx`, `src/main.tsx` и `README.md`:
                    тема выражена через весь проект, а не только через отдельные demos.
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
                `Zod` intentionally находится рядом с TypeScript в стеке, потому что для
                этой темы именно пара “static types + runtime schemas” создаёт устойчивый
                data flow.
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
          Для урока про внешние данные это почти всегда сигнал, что граница доверия
          размазана не там: либо сырой payload дошёл до UI без parse, либо route shell
          потерял schema contract.
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
          to="/external-data-overview?focus=all"
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
        element: <Navigate to="/external-data-overview?focus=all" replace />,
      },
      { path: 'external-data-overview', element: <OverviewPage /> },
      { path: 'schema-boundaries', element: <SchemaBoundaryPage /> },
      { path: 'validated-requests', element: <ValidatedRequestsPage /> },
      { path: 'validated-mutations', element: <MutationValidationPage /> },
      { path: 'route-contracts', element: <RouteContractsPage /> },
      { path: 'external-data-playbook', element: <PlaybookPage /> },
      { path: '*', element: <Navigate to="/external-data-overview?focus=all" replace /> },
    ],
  },
]);
