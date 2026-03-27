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
import { BottlenecksPage } from './pages/BottlenecksPage';
import { DataStructurePage } from './pages/DataStructurePage';
import { OverviewPage } from './pages/OverviewPage';
import { PrematureOptimizationPage } from './pages/PrematureOptimizationPage';
import { RenderCausesPage } from './pages/RenderCausesPage';
import { StateColocationPage } from './pages/StateColocationPage';

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
            <span className="soft-label">Модуль 8 / Урок 44</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Основы производительности React-приложений
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы не оптимизируете наугад, а смотрите, что именно заставляет дерево
              ререндериться, где state лежит слишком высоко и какой bottleneck реально
              даёт пользователю лаг.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главный фильтр темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Лишний ререндер важен только тогда, когда он задевает дорогой участок
                интерфейса или заметен пользователю.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Первый ход
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала смотрите на placement state, ширину дерева и форму данных, а не
                тянетесь автоматически к `memo` и другим точечным оптимизациям.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Dev-нюанс
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Урок работает в `StrictMode`, поэтому смотрите на относительные изменения
                после действий, а не на первую mount-цифру в development.
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
            ))}
          </div>
        </nav>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Как смотреть на сигналы
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Сначала scope</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Кто именно ререндерится: leaf, секция или целый экран.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом cost</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Насколько дорог этот участок: лёгкий текст или synthetic slow grid.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Потом action</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Какое действие запускает проблему: ввод, toggle, фильтр или route
                  change.
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
                <li>`src/components/performance/RenderCausesLab.tsx`</li>
                <li>`src/components/performance/StateColocationLab.tsx`</li>
                <li>`src/components/performance/DataStructureLab.tsx`</li>
                <li>`src/components/performance/BottleneckLab.tsx`</li>
                <li>`src/lib/data-structure-model.ts`</li>
                <li>`src/lib/performance-advisor-model.ts`</li>
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
                    Начинайте с `src/lib/*-model.ts`: там видны чистые правила, по которым
                    приложение объясняет рендеры, bottlenecks и нужность оптимизации.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Потом смотрите live-labs: они используют те же модели, но уже на
                    настоящих интерактивных ветках UI и synthetic slow surfaces.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии в коде отмечают места, где демонстрация специально
                    измеряет рендеры или имитирует дорогой subtree ради наглядности.
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
                Стек выводится только здесь, внизу shell, чтобы верхний блок не спорил с
                самой темой урока про структуру UI и реальные bottlenecks.
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
          Если ошибка дошла до корневой границы, значит сбой не локализован внутри
          конкретной лаборатории. Для темы производительности это хороший повод проверить,
          не смешалась ли логика измерения, UI и вспомогательные вычисления.
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
          to="/performance-overview?focus=all"
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
        element: <Navigate to="/performance-overview?focus=all" replace />,
      },
      {
        path: 'performance-overview',
        element: <OverviewPage />,
      },
      {
        path: 'render-causes',
        element: <RenderCausesPage />,
      },
      {
        path: 'state-colocation',
        element: <StateColocationPage />,
      },
      {
        path: 'data-structure',
        element: <DataStructurePage />,
      },
      {
        path: 'bottlenecks',
        element: <BottlenecksPage />,
      },
      {
        path: 'premature-optimization',
        element: <PrematureOptimizationPage />,
      },
      {
        path: '*',
        element: <Navigate to="/performance-overview?focus=all" replace />,
      },
    ],
  },
]);
