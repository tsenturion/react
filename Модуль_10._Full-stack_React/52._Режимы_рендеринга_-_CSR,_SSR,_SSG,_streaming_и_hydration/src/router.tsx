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
import { ArchitecturePage } from './pages/ArchitecturePage';
import { HydrationPage } from './pages/HydrationPage';
import { ModeComparisonPage } from './pages/ModeComparisonPage';
import { OverviewPage } from './pages/OverviewPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { StreamingPage } from './pages/StreamingPage';

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
            <span className="soft-label">Модуль 10 / Урок 52</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Режимы рендеринга: CSR, SSR, SSG, streaming и hydration
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы изучаете режимы рендеринга как архитектурную систему доставки HTML
              и interactivity: что видно сразу, что доезжает позже, где возникает
              hydration, как отлаживать mismatch и когда streaming действительно даёт
              выигрыш.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                HTML first
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Первый вопрос урока: когда пользователь увидит полезный HTML и зависит ли
                это от загрузки JavaScript.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Hydration contract
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Серверный HTML нужно не только отдать, но и безболезненно соединить с
                клиентским деревом React.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Architecture cost
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Каждый режим меняет кэш, серверную стоимость, SEO и структуру проекта, а
                не только цифру в synthetic benchmark.
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
              Как смотреть на lesson 52
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала HTML</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Определите, нужен ли на первом экране реальный контент до загрузки
                  клиента или достаточно клиентского shell.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом hydration</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  После SSR, SSG и streaming важно понять, совпадает ли первый рендер
                  сервера и клиента и сколько стоит оживление дерева.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом стоимость</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Выбор завершается не на UX: нужно оценить кэш, deployment, серверную
                  цену и свежесть данных.
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
                <li>`src/components/render-modes/ModeComparisonLab.tsx`</li>
                <li>`src/components/render-modes/HydrationMismatchLab.tsx`</li>
                <li>`src/components/render-modes/StreamingHydrationLab.tsx`</li>
                <li>`src/components/render-modes/ArchitectureConsequencesLab.tsx`</li>
                <li>`src/components/render-modes/RenderingPlaybookLab.tsx`</li>
                <li>`src/server/render-mode-runtime.tsx`</li>
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
                    Начинайте с `src/lib/*-model.ts`: там видно, как отделены доставка
                    HTML, hydration, streaming timeline и архитектурный выбор режима.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Затем переходите к `src/server/render-mode-runtime.tsx`: там лежат
                    реальные функции на `react-dom/server`, а не только визуальные схемы.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого смотрите sandboxes: они переводят серверные и
                    архитектурные идеи в живые UX-сценарии с переключаемыми параметрами.
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
                Стек вынесен вниз, чтобы фокус урока оставался на режимах рендеринга,
                hydration и архитектурных последствиях, а не на инфраструктуре проекта.
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
          Для урока про режимы рендеринга это повод проверить, не смешались ли server-only
          вычисления, hydration assumptions и route-level данные так, что страница
          потеряла предсказуемость уже на уровне shell.
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
          to="/rendering-overview?focus=all"
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
        element: <Navigate to="/rendering-overview?focus=all" replace />,
      },
      {
        path: 'rendering-overview',
        element: <OverviewPage />,
      },
      {
        path: 'mode-comparison',
        element: <ModeComparisonPage />,
      },
      {
        path: 'hydration-debugging',
        element: <HydrationPage />,
      },
      {
        path: 'streaming-and-selective-hydration',
        element: <StreamingPage />,
      },
      {
        path: 'architecture-consequences',
        element: <ArchitecturePage />,
      },
      {
        path: 'rendering-playbook',
        element: <PlaybookPage />,
      },
      {
        path: '*',
        element: <Navigate to="/rendering-overview?focus=all" replace />,
      },
    ],
  },
]);
