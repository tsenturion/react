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
import { DebuggingWorkflowPage } from './pages/DebuggingWorkflowPage';
import { DevToolsInspectorPage } from './pages/DevToolsInspectorPage';
import { LintRulesPage } from './pages/LintRulesPage';
import { OverviewPage } from './pages/OverviewPage';
import { QualityControlSystemPage } from './pages/QualityControlSystemPage';
import { RulesOfReactPage } from './pages/RulesOfReactPage';

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
            <span className="soft-label">Модуль 14 / Урок 64</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              DevTools, линтинг, правила React и отладка
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете инструменты разработки не по отдельности, а как общий
              контур качества проекта: React DevTools помогает локализовать симптом,
              линтер и Rules of React ловят часть ошибок заранее, а debugging workflow
              переводит находку в исправление и guardrail.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Inspect first
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Props, state и context становятся первой диагностической картой before any
                speculative fix.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Prevent early
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Lint и Rules of React должны отсеивать часть багов ещё до runtime
                расследования.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Close the loop
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Финальная цель не “посмотреть DevTools”, а превратить находку в устойчивый
                quality guardrail.
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
                    ? 'bg-blue-700 text-white shadow-lg'
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
            ))}
          </div>
        </nav>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Как смотреть на tooling lesson
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала symptom</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Проблема формулируется как конкретный сбой: wrong props, stale effect,
                  ref timing или лишние рендеры.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом signal</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Для каждого симптома есть наиболее информативный первый инструмент:
                  DevTools, lint, profiler-style reasoning или tests.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом guardrail</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Хороший debugging workflow заканчивается новым правилом, тестом или
                  изменением архитектуры, а не только локальным fix.
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
                <li>`src/components/tooling-labs/DevToolsInspectorLab.tsx`</li>
                <li>`src/components/tooling-labs/LintRulesLab.tsx`</li>
                <li>`src/components/tooling-labs/RulesOfReactLab.tsx`</li>
                <li>`src/components/tooling-labs/DebuggingWorkflowLab.tsx`</li>
                <li>`src/components/tooling-labs/QualityControlSystemLab.tsx`</li>
                <li>`src/lib/debugging-workflow-model.ts`</li>
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
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <p className="text-sm leading-6">
                    Сначала смотрите `src/lib/*-model.ts`: там лежат чистые модели того,
                    как урок принимает решения о диагностике, lint-сигналах и quality
                    system maturity.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Затем переходите к `src/components/tooling-labs/*`: там те же идеи
                    становятся живыми сценариями с переключателями, filters и route-level
                    состоянием.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    В конце открывайте `eslint.config.js`, `README.md` и tests: lesson 64
                    намеренно выражает тему ещё и в реальной инфраструктуре проекта.
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
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                Тема урока намеренно продублирована внизу через стек и guardrails: quality
                tooling должно быть частью самого проекта, а не только предметом
                обсуждения на экране.
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
          Даже route-level ошибка здесь читается как часть темы: сначала локализовать
          symptom, потом проверить shell, inputs и toolchain assumptions.
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
    path: '/',
    element: <LessonLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/tooling-overview?focus=all" replace />,
      },
      { path: 'tooling-overview', element: <OverviewPage /> },
      { path: 'devtools-inspector', element: <DevToolsInspectorPage /> },
      { path: 'lint-rules', element: <LintRulesPage /> },
      { path: 'rules-of-react', element: <RulesOfReactPage /> },
      { path: 'debugging-workflow', element: <DebuggingWorkflowPage /> },
      { path: 'quality-control-system', element: <QualityControlSystemPage /> },
      { path: '*', element: <Navigate to="/tooling-overview?focus=all" replace /> },
    ],
  },
]);
