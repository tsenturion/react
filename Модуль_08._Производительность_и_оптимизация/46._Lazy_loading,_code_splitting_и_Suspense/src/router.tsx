/* eslint-disable react-refresh/only-export-components */
import clsx from 'clsx';
import { Suspense, lazy, useEffect, useSyncExternalStore } from 'react';
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

import { delayImport } from './lib/lazy-runtime';
import { describeLabFromPath, lessonLabs } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { stackBadges } from './lib/stack-meta';

const LazyOverviewPage = lazy(() =>
  delayImport(() => import('./pages/OverviewPage'), 220).then((module) => ({
    default: module.OverviewPage,
  })),
);
const LazyComponentSplitPage = lazy(() =>
  delayImport(() => import('./pages/ComponentSplitPage'), 260).then((module) => ({
    default: module.ComponentSplitPage,
  })),
);
const LazyRouteSplitPage = lazy(() =>
  delayImport(() => import('./pages/RouteSplitPage'), 240).then((module) => ({
    default: module.RouteSplitPage,
  })),
);
const LazySuspenseBoundariesPage = lazy(() =>
  delayImport(() => import('./pages/SuspenseBoundariesPage'), 260).then((module) => ({
    default: module.SuspenseBoundariesPage,
  })),
);
const LazyProgressiveLoadingPage = lazy(() =>
  delayImport(() => import('./pages/ProgressiveLoadingPage'), 260).then((module) => ({
    default: module.ProgressiveLoadingPage,
  })),
);
const LazySplitStrategyPage = lazy(() =>
  delayImport(() => import('./pages/SplitStrategyPage'), 220).then((module) => ({
    default: module.SplitStrategyPage,
  })),
);

function RouteChunkFallback({ pathname }: { pathname: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        route chunk loading
      </p>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">
        Shell остаётся на месте, пока загружается {pathname}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Это и есть главный смысл route-level code splitting в этом уроке: header, меню и
        нижний блок не исчезают, меняется только центр экрана.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
    </div>
  );
}

function LessonLayout() {
  const location = useLocation();
  const activeLabId = describeLabFromPath(location.pathname);
  const transitionLog = useSyncExternalStore(
    shellTransitionLogStore.subscribe,
    shellTransitionLogStore.getSnapshot,
    shellTransitionLogStore.getSnapshot,
  );
  const routeKey = `${location.pathname}${location.search}`;

  useEffect(() => {
    shellTransitionLogStore.record(routeKey);
  }, [routeKey]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 8 / Урок 46</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Lazy loading, code splitting и Suspense
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь важно не просто разбить код на chunks, а понять, где split point
              совпадает со сценарием экрана, как fallback влияет на восприятие интерфейса
              и почему shell должен переживать загрузку тяжёлых частей приложения.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Split points
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Route, modal, analytics panel и rich editor дают разную архитектурную
                отдачу от code splitting.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Fallback scope
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Suspense boundary управляет тем, что именно исчезает со страницы, пока
                грузится chunk.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Perception
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Пользователь чувствует устойчивость shell и ясность loading UX, а не один
                только факт уменьшенного initial bundle.
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
              Как смотреть на lazy loading
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала сценарий</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Насколько блок тяжёлый, как часто он нужен и можно ли показать shell
                  раньше него.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом boundary</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Выбирайте такую границу Suspense, чтобы пропадала только действительно
                  ожидающая часть интерфейса.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом trade-off</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Over-splitting легко создаёт больше сетевых и UX-проблем, чем экономии.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Router transitions
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
                <li>`src/router.tsx`</li>
                <li>`src/components/lazy-loading/ComponentLazyLab.tsx`</li>
                <li>`src/components/lazy-loading/SuspenseBoundariesLab.tsx`</li>
                <li>`src/components/lazy-loading/ProgressiveLoadingLab.tsx`</li>
                <li>`src/lib/lazy-runtime.ts`</li>
                <li>`src/lib/split-strategy-model.ts`</li>
              </ul>
            </div>
          </div>
        </div>

        <main className="panel p-6 sm:p-8">
          <Suspense fallback={<RouteChunkFallback pathname={routeKey} />}>
            <Outlet />
          </Suspense>
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
                    Смотрите на router: lesson pages уже загружаются лениво, поэтому
                    route-level split показан не только в текстах, но и в самом shell.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Затем переходите к local sandboxes: там видно, как React.lazy,
                    Suspense и fallback placement влияют на конкретный widget и экран.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Комментарии в коде отмечают места, где artificial delay нужен только
                    для наблюдаемости split point в учебной среде.
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
                Стек вынесен вниз, чтобы фокус оставался на split points, boundary
                placement, progressive loading и влиянии chunk-стратегии на UX.
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
          Для урока про lazy loading и Suspense это особенно заметный сигнал: если ошибка
          дошла до корня, значит fallback-границы и split-логика смешались слишком высоко
          в дереве.
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
          to="/lazy-loading-overview?focus=all"
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
        element: <Navigate to="/lazy-loading-overview?focus=all" replace />,
      },
      {
        path: 'lazy-loading-overview',
        element: <LazyOverviewPage />,
      },
      {
        path: 'component-lazy-loading',
        element: <LazyComponentSplitPage />,
      },
      {
        path: 'route-code-splitting',
        element: <LazyRouteSplitPage />,
      },
      {
        path: 'suspense-boundaries',
        element: <LazySuspenseBoundariesPage />,
      },
      {
        path: 'progressive-loading',
        element: <LazyProgressiveLoadingPage />,
      },
      {
        path: 'split-strategy',
        element: <LazySplitStrategyPage />,
      },
      {
        path: '*',
        element: <Navigate to="/lazy-loading-overview?focus=all" replace />,
      },
    ],
  },
]);
