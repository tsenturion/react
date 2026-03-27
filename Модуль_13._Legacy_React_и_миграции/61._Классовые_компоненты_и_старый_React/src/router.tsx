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

import { LegacyErrorBoundary } from './components/legacy-react-labs/LegacyErrorBoundary';
import { describeLabFromPath, lessonLabs } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { stackBadges } from './lib/stack-meta';
import { ClassStatePage } from './pages/ClassStatePage';
import { LifecyclePage } from './pages/LifecyclePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { OverviewPage } from './pages/OverviewPage';
import { PureComponentPage } from './pages/PureComponentPage';
import { RefsPage } from './pages/RefsPage';

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
            <span className="soft-label">Модуль 13 / Урок 61</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Классовые компоненты и старый React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете старую модель React не как музейный экспонат, а как
              реальный рабочий код: `state` живёт в инстансе, жизненный цикл описан
              методами класса, `createRef` связывает React с DOM imperatively, а class
              boundaries до сих пор остаются частью практики.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                State lives in instances
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В class components состояние связано с экземпляром класса, а `setState`
                работает через очередь обновлений, а не через мгновенную запись.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Lifecycle is explicit
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Mount, update и cleanup выражаются отдельными методами, поэтому старый код
                нужно читать через фазу, причину и побочный эффект.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Legacy still matters
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Error boundaries, старые dashboard-модули и migration layers всё ещё
                требуют уверенного чтения class-based React-кода.
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
              Как смотреть на lesson 61
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Сначала ментальная карта
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Сначала разберите старую оптику React: где живёт state, как читать
                  lifecycle и почему hooks позже заменили именно эти поверхности.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Потом реальные class labs
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Затем переходите к `setState`, `createRef`, `PureComponent` и boundary
                  sandboxes: там видно поведение старого React в действии.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Потом maintenance logic
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  В конце сравните legacy patterns с hooks и migration playbook: именно
                  так class-based знание превращается в практику поддержки кода.
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
                <li>`src/components/legacy-react-labs/ClassStateLab.tsx`</li>
                <li>`src/components/legacy-react-labs/LifecycleLab.tsx`</li>
                <li>`src/components/legacy-react-labs/LegacyRefsLab.tsx`</li>
                <li>`src/components/legacy-react-labs/PureComponentLab.tsx`</li>
                <li>`src/components/legacy-react-labs/LegacyErrorBoundary.tsx`</li>
                <li>`src/main.tsx`</li>
              </ul>
            </div>
          </div>
        </div>

        <LegacyErrorBoundary
          label="Lesson shell"
          resetKey={`${location.pathname}${location.search}`}
          fallbackTitle="Shell урока поймал ошибку"
          fallbackCopy="Это уже class-based boundary внутри самого проекта. Переход на другой маршрут сбросит состояние boundary, а код лаборатории всё ещё останется локализованным."
        >
          <main className="panel p-6 sm:p-8">
            <Outlet />
          </main>
        </LegacyErrorBoundary>

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
                    Сначала открывайте `src/components/legacy-react-labs/*`: там тема
                    выражена буквально через class components, lifecycle methods и
                    boundaries текущего проекта.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-6">
                    Потом переходите к `src/lib/*model.ts`: там лежат сравнения со hooks,
                    maintenance heuristics и чистые модели поведения.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    После этого изучайте `src/main.tsx`, `src/router.tsx` и `README.md`:
                    урок сам организован так, чтобы legacy API были не декорацией, а
                    реальной частью приложения.
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
                Проект специально оставляет TypeScript, router и современные тесты рядом с
                class-based кодом: в реальной поддержке legacy React старые компоненты
                почти всегда живут внутри уже современного toolchain.
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
          Это уже router-level ошибка. Она живёт выше обычного class-based error boundary
          и напоминает, что в современном приложении legacy React почти всегда соседствует
          с более новой инфраструктурой.
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
          to="/legacy-react-overview?focus=all"
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
        element: <Navigate to="/legacy-react-overview?focus=all" replace />,
      },
      { path: 'legacy-react-overview', element: <OverviewPage /> },
      { path: 'class-state', element: <ClassStatePage /> },
      { path: 'lifecycle-methods', element: <LifecyclePage /> },
      { path: 'legacy-refs', element: <RefsPage /> },
      { path: 'pure-component', element: <PureComponentPage /> },
      { path: 'maintenance-and-boundaries', element: <MaintenancePage /> },
      { path: '*', element: <Navigate to="/legacy-react-overview?focus=all" replace /> },
    ],
  },
]);
