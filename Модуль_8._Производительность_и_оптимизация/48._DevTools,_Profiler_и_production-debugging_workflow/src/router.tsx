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
import { ComponentTreePage } from './pages/ComponentTreePage';
import { OverviewPage } from './pages/OverviewPage';
import { PerformanceTracksPage } from './pages/PerformanceTracksPage';
import { ProductionDebugPage } from './pages/ProductionDebugPage';
import { ReactProfilerPage } from './pages/ReactProfilerPage';
import { WorkflowPlaybookPage } from './pages/WorkflowPlaybookPage';

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
            <span className="soft-label">Модуль 8 / Урок 48</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              DevTools, Profiler и production-debugging workflow
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете не один отдельный инструмент, а полный цикл расследования
              проблем производительности: component tree, React Profiler, browser
              Performance tools и решение, которое следует из evidence, а не из интуиции.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Component tree
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала вы ищете, какие ветки обновляются и где ownership состояния делает
                дерево шумным.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Commit timing
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Потом вы измеряете actual/base duration и сузаете hotspot до suspect
                subtree.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Production workflow
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В финале вы объединяете browser trace, network и React evidence в один
                рабочий сценарий.
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
              Как смотреть на perf-debug
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала symptom</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Формулируйте проблему как конкретное действие пользователя, а не как
                  расплывчатое “приложение кажется тяжёлым”.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом evidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Tree, Profiler и browser trace отвечают на разные вопросы и не заменяют
                  друг друга.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом fix</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Только после локализации bottleneck стоит менять структуру компонента,
                  сеть или browser-heavy path.
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
                <li>`src/components/profiling/ComponentTreeLab.tsx`</li>
                <li>`src/components/profiling/ReactProfilerLab.tsx`</li>
                <li>`src/components/profiling/PerformanceTracksLab.tsx`</li>
                <li>`src/components/profiling/ProductionDebugLab.tsx`</li>
                <li>`src/lib/performance-cases-model.ts`</li>
                <li>`src/lib/workflow-playbook-model.ts`</li>
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
                    Начинайте с `src/lib/*-model.ts`: там видно, по каким правилам урок
                    различает React bottleneck, browser-level bottleneck и network-heavy
                    symptom.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Затем переходите к sandboxes: те же правила проходят через component
                    tree, Profiler feed, tracks и production-like workflow.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Комментарии в коде отмечают места, где instrumentation сделана ради
                    наблюдаемости, а не как production telemetry по умолчанию.
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
                Стек вынесен вниз, чтобы фокус урока оставался на workflow расследования,
                а не на перечне инструментов.
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
          Для урока про performance debugging это повод проверить, не смешалась ли
          instrumentation с основной логикой и не ушло ли измерение в неожиданный render
          path.
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
          to="/tooling-overview?focus=all"
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
        element: <Navigate to="/tooling-overview?focus=all" replace />,
      },
      {
        path: 'tooling-overview',
        element: <OverviewPage />,
      },
      {
        path: 'component-tree-analysis',
        element: <ComponentTreePage />,
      },
      {
        path: 'react-profiler-analysis',
        element: <ReactProfilerPage />,
      },
      {
        path: 'performance-tracks',
        element: <PerformanceTracksPage />,
      },
      {
        path: 'production-debug-workflow',
        element: <ProductionDebugPage />,
      },
      {
        path: 'workflow-playbook',
        element: <WorkflowPlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/tooling-overview?focus=all" replace />,
      },
    ],
  },
]);
