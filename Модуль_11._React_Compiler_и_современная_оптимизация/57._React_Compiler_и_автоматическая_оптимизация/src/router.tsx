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
import { AutomaticMemoizationPage } from './pages/AutomaticMemoizationPage';
import { BailoutsPage } from './pages/BailoutsPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { OverviewPage } from './pages/OverviewPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { ProfilingPage } from './pages/ProfilingPage';

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
            <span className="soft-label">Модуль 11 / Урок 57</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              React Compiler и автоматическая оптимизация
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете React Compiler как реальный build-time слой автоматической
              мемоизации: где он снимает ручной шум из `memo`, `useMemo` и `useCallback`,
              где требует более чистого кода, и где всё равно остаётся работа архитектуры
              и профилирования.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Compiler scope
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Компилятор помогает со стабильностью и повторной работой дерева, но не
                чинит network waterfalls, giant contexts и слабые boundaries.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Gradual rollout
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Нормальное внедрение идёт через compiler-aware lint, profiler baseline и
                ограниченные feature slices, а не через массовое удаление всей ручной
                мемоизации за один проход.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Profiler truth
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ключевой критерий успеха здесь не красота синтаксиса, а commit time,
                причины ререндеров и то, стал ли интерфейс реально отзывчивее.
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
              Как смотреть на lesson 57
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала baseline</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Сначала ищите реальные interaction pains и profiler evidence, а не
                  обсуждайте compiler как абстрактное улучшение кода.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом rollout</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Затем смотрите на config, lint diagnostics и шаги постепенного
                  включения, чтобы не превратить тему в рискованный массовый рефакторинг.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом limits</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  И только после этого оценивайте bailouts и архитектурные границы: где
                  compiler помогает, а где он честно бессилен.
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
                <li>`vite.config.ts`</li>
                <li>`eslint.config.js`</li>
                <li>`src/components/compiler-labs/AutomaticMemoizationLab.tsx`</li>
                <li>`src/components/compiler-labs/ConfigurationRolloutLab.tsx`</li>
                <li>`src/components/compiler-labs/CompilerBailoutsLab.tsx`</li>
                <li>`src/components/compiler-labs/ProfilingDebugLab.tsx`</li>
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
                    Сначала откройте `vite.config.ts` и `eslint.config.js`: там тема уже
                    выражена через реальный compiler plugin и compiler-aware lint.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/lib/*model.ts`: там собраны scenario profiles,
                    rollout plans, bailout cases и profiling reports.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого открывайте `src/components/compiler-labs/*`: именно там
                    видно, как тема превращается в живые sandboxes, а не остаётся набором
                    определений.
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
                Стек вынесен вниз, чтобы фокус оставался на compiler mental model, gradual
                rollout и profiling workflow, а не на витрине инструментов.
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
          Для урока про React Compiler это повод проверить, не сломалась ли связь между
          compiler config, lint diagnostics, profiler workflow и текущими учебными
          sandboxes.
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
          to="/compiler-overview?focus=all"
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
        element: <Navigate to="/compiler-overview?focus=all" replace />,
      },
      {
        path: 'compiler-overview',
        element: <OverviewPage />,
      },
      {
        path: 'automatic-memoization',
        element: <AutomaticMemoizationPage />,
      },
      {
        path: 'compiler-configuration-and-rollout',
        element: <ConfigurationPage />,
      },
      {
        path: 'compiler-bailouts-and-limits',
        element: <BailoutsPage />,
      },
      {
        path: 'compiler-profiling-and-debugging',
        element: <ProfilingPage />,
      },
      {
        path: 'compiler-playbook',
        element: <PlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/compiler-overview?focus=all" replace />,
      },
    ],
  },
]);
