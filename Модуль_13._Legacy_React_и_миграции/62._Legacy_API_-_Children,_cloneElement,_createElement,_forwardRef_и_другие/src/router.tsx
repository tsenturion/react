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
import { ChildrenPage } from './pages/ChildrenPage';
import { CloneElementPage } from './pages/CloneElementPage';
import { CreateElementPage } from './pages/CreateElementPage';
import { LegacyContextPage } from './pages/LegacyContextPage';
import { OverviewPage } from './pages/OverviewPage';
import { RefMigrationPage } from './pages/RefMigrationPage';

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
            <span className="soft-label">Модуль 13 / Урок 62</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Legacy API: Children, cloneElement, createElement, forwardRef и другие
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете старые и переходные React API не как архив, а как
              реальный слой совместимости: `Children` работает с opaque structure,
              `cloneElement` неявно меняет дочерний контракт, `createElement` показывает
              низкоуровневую форму JSX, а `forwardRef` уже нужно рассматривать через
              migration к React 19 `ref-as-prop`.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Legacy APIs are still readable surface
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Эти API по-прежнему встречаются в design-system adapters, compound
                components, старых wrapper layers и migration code.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                The cost is usually implicitness
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Почти каждая legacy поверхность добавляет скрытое поведение: opaque
                children, injected props, imperative refs или неочевидный context flow.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Migration is more useful than prohibition
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Важно не просто знать, что API считается legacy, а понимать, чем его
                заменить и где его пока разумно оставить.
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
              Как смотреть на lesson 62
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Сначала карта legacy API
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  На overview видно, какие API реально относятся к одной группе, а какие
                  только исторически стоят рядом.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Затем живые sandboxes
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Children, cloneElement, createElement, refs и context здесь не описаны
                  текстом, а работают прямо в текущем приложении.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Потом migration lens
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Главное в этой теме не сам legacy-синтаксис, а понимание границ,
                  стоимости и современных альтернатив.
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
                <li>`src/components/legacy-api-labs/ChildrenApiLab.tsx`</li>
                <li>`src/components/legacy-api-labs/CloneElementLab.tsx`</li>
                <li>`src/components/legacy-api-labs/CreateElementLab.tsx`</li>
                <li>`src/components/legacy-api-labs/RefMigrationLab.tsx`</li>
                <li>`src/components/legacy-api-labs/LegacyContextLab.tsx`</li>
                <li>`src/lib/legacy-api-overview-model.ts`</li>
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
                    Сначала открывайте `src/components/legacy-api-labs/*`: именно там тема
                    выражена через реальные `Children`, `cloneElement`, `createElement`,
                    `createRef` и `contextType` внутри текущего кода.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/lib/*model.ts`: там лежат чистые модели,
                    migration rules и сопоставление legacy API с современными
                    альтернативами.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого смотрите `src/router.tsx`, `src/main.tsx` и `README.md`:
                    урок сам организован так, чтобы legacy API были частью структуры
                    проекта, а не отдельной витриной.
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
                Урок намеренно показывает legacy API внутри современного toolchain:
                TypeScript, router, Vitest и React 19 живут рядом с историческими
                поверхностями, потому что именно так legacy-код чаще всего и
                поддерживается на практике.
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
          Это router-level ошибка. Даже вокруг legacy API уже стоит современная
          инфраструктура маршрутов, поэтому сбой страницы лучше локализовать на уровне
          route tree, а не во всём приложении целиком.
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
          to="/legacy-api-overview?focus=all"
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
        element: <Navigate to="/legacy-api-overview?focus=all" replace />,
      },
      { path: 'legacy-api-overview', element: <OverviewPage /> },
      { path: 'children-api', element: <ChildrenPage /> },
      { path: 'clone-element', element: <CloneElementPage /> },
      { path: 'create-element', element: <CreateElementPage /> },
      { path: 'ref-migration', element: <RefMigrationPage /> },
      { path: 'legacy-context', element: <LegacyContextPage /> },
      { path: '*', element: <Navigate to="/legacy-api-overview?focus=all" replace /> },
    ],
  },
]);
