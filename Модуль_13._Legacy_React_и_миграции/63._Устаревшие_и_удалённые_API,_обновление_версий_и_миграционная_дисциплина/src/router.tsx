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
import { CodemodsPage } from './pages/CodemodsPage';
import { DeprecatedApisPage } from './pages/DeprecatedApisPage';
import { MigrationWorkflowPage } from './pages/MigrationWorkflowPage';
import { OverviewPage } from './pages/OverviewPage';
import { TestGuardrailsPage } from './pages/TestGuardrailsPage';
import { UpgradeDisciplinePage } from './pages/UpgradeDisciplinePage';

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
            <span className="soft-label">Модуль 13 / Урок 63</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Устаревшие и удалённые API, обновление версий и миграционная дисциплина
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете миграцию React как инженерный процесс: deprecated DOM
              API, React 18.3 как предупреждающий мост к 19, codemods, release channels,
              test suite как guardrail и полный порядок действий от inventory до staged
              rollout.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Removed APIs are only the surface
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам вызов deprecated API важен, но ещё важнее assumptions и helpers,
                которые выросли вокруг него в кодовой базе.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Codemods are not proof
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Автоматические замены хорошо чистят синтаксис, но не доказывают, что
                система корректно работает после обновления.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Migration discipline is evidence
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Качественная миграция опирается на audit, tests, release notes и staged
                rollout, а не на один merge-коммит.
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
              Как смотреть на lesson 63
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Сначала карта migration риска
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Overview даёт правильную оптику: deprecated API, tests, release channels
                  и workflow связаны между собой.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Потом audit и guardrails
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Сначала поймите removed DOM APIs и assumptions, затем проверьте,
                  достаточно ли codemods и тестов для безопасной миграции.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Потом workflow целиком
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Финальный раздел связывает inventory, codemods, tests и rollout в один
                  управляемый план изменений.
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
                <li>`src/components/migration-labs/DeprecatedDomApisLab.tsx`</li>
                <li>`src/components/migration-labs/UpgradeDisciplineLab.tsx`</li>
                <li>`src/components/migration-labs/CodemodReleaseLab.tsx`</li>
                <li>`src/components/migration-labs/TestGuardrailLab.tsx`</li>
                <li>`src/components/migration-labs/MigrationWorkflowLab.tsx`</li>
                <li>`src/lib/migration-overview-model.ts`</li>
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
                    Сначала открывайте `src/components/migration-labs/*`: урок реализует
                    audit, rollout strategy и test guardrails прямо через свой код, а не
                    только через поясняющий текст.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/lib/*model.ts`: там лежат чистые модели
                    removed API, release channels, guardrail coverage и migration plan.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого смотрите `src/main.tsx`, `src/router.tsx` и `README.md`:
                    проект сам выражает тему через modern root API и дисциплину
                    обновления.
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
                Урок намеренно строится на React 19 и современном root API, а deprecated и
                removed поверхности изучаются как объект миграционного анализа внутри уже
                нового toolchain.
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
        <h2 className="text-2xl font-bold tracking-tight">Маршрут урока упал</h2>
        <p className="mt-3 text-sm leading-6">
          Это router-level ошибка. Даже migration tooling и audit-поверхности должны быть
          локализованы на уровне route tree, чтобы сбой одной страницы не ломал весь
          учебный проект.
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
          to="/migration-overview?focus=all"
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
    path: '/',
    element: <LessonLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/migration-overview?focus=all" replace /> },
      { path: 'migration-overview', element: <OverviewPage /> },
      { path: 'deprecated-dom-apis', element: <DeprecatedApisPage /> },
      { path: 'upgrade-discipline', element: <UpgradeDisciplinePage /> },
      { path: 'codemods-and-release-channels', element: <CodemodsPage /> },
      { path: 'test-guardrails', element: <TestGuardrailsPage /> },
      { path: 'migration-workflow', element: <MigrationWorkflowPage /> },
      { path: '*', element: <Navigate to="/migration-overview?focus=all" replace /> },
    ],
  },
]);
