/* eslint-disable react-refresh/only-export-components */
import clsx from 'clsx';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useLocation,
  useNavigation,
  useRouteError,
} from 'react-router-dom';

import { lessonLabs } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { authSessionStore } from './lib/auth-store';
import { describeLabFromPath } from './lib/auth-domain';
import {
  authUxAction,
  authUxLoader,
  lessonShellLoader,
  overviewLoader,
  protectedBranchLoader,
  protectedScreenLoader,
  roleAccessLoader,
  sessionLifecycleAction,
  sessionLifecycleLoader,
  type LessonShellLoaderData,
} from './lib/auth-runtime';
import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AuthUxPage } from './pages/AuthUxPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProtectedScreenErrorBoundary } from './pages/ProtectedScreenErrorBoundary';
import { ProtectedScreenPage } from './pages/ProtectedScreenPage';
import { ProtectedWorkspacePage } from './pages/ProtectedWorkspacePage';
import { RoleAccessBoundary } from './pages/RoleAccessBoundary';
import { RoleAccessPage } from './pages/RoleAccessPage';
import { SessionLifecyclePage } from './pages/SessionLifecyclePage';

function LessonLayout() {
  const shellData = useLoaderData() as LessonShellLoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const authSnapshot = useSyncExternalStore(
    authSessionStore.subscribe,
    authSessionStore.getSnapshot,
    authSessionStore.getSnapshot,
  );
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в lesson shell и не теряется, пока меняются дочерние auth routes.',
  );

  const currentLocation = navigation.location ?? location;
  const currentStamp = `${currentLocation.pathname}${currentLocation.search}`;
  const activeLabId = describeLabFromPath(location.pathname);
  const transitionLog = useSyncExternalStore(
    shellTransitionLogStore.subscribe,
    shellTransitionLogStore.getSnapshot,
    shellTransitionLogStore.getSnapshot,
  );

  useEffect(() => {
    shellTransitionLogStore.record(currentStamp);
  }, [currentStamp]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 6 / Урок 38</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Аутентификация и защищённые маршруты
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете auth flow, protected routes, role gates, session
              refresh, redirect intent и то, как доступ начинает менять структуру route
              tree, данные и UX переходов.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только login form и logout, но и route guards, role-based 403, refresh
                logic, intent preserving и access architecture.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам урок живёт на `createBrowserRouter`, а session snapshot хранится в
                общем auth store, который видят и shell, и loaders.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не каждый auth check должен жить глобально, но route-critical доступ
                нельзя прятать в локальный widget после первого рендера.
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
              Lesson shell state
            </p>

            <label className="mt-3 block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Заметка в lesson shell
              </span>
              <textarea
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400"
              />
            </label>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Последняя загрузка shell loader: <strong>{shellData.loadedAt}</strong>.
              Всего auth playbooks: <strong>{shellData.totalPlaybooks}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Текущая сессия:{' '}
              <strong>
                {authSnapshot.session
                  ? `${authSnapshot.session.displayName} (${authSnapshot.session.role})`
                  : 'нет'}
              </strong>
              . Router state: <strong>{navigation.state}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Intended path: <strong>{authSnapshot.intendedPath ?? 'none'}</strong>
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Auth and router audit
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {authSnapshot.auditTrail.map((item) => (
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
                Router transitions
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {transitionLog.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
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
                    Сначала смотрите `src/lib/auth-store.ts`, затем
                    `src/lib/auth-runtime.ts` и только потом переходите к
                    `src/router.tsx`, чтобы видеть, как state и route guards связаны между
                    собой.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сопоставляйте auth store, protected branch и role boundary вместе:
                    доступ здесь управляет не только UI, но и самими переходами.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с guard loaders, redirect intent и session
                    refresh, потому что именно там чаще всего появляются скрытые
                    архитектурные ошибки.
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
                Здесь остаются только реальные версии инструментов, которые используются в
                текущем auth-routing проекте и зафиксированы в `package.json`.
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
          Этот boundary ловит ошибку выше lesson shell. Если сбой оказался здесь, значит
          его не локализовали на уровне конкретной auth branch.
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
          to="/auth-flow-overview?focus=all"
          className="mt-5 inline-flex rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Вернуться к уроку
        </Link>
      </div>
    </div>
  );
}

// Здесь router управляет не только экранами, но и доступом:
// loader может пустить в branch, обновить session через refresh или сразу сделать redirect.
export const appRouter = createBrowserRouter([
  {
    id: 'lesson-shell',
    path: '/',
    loader: lessonShellLoader,
    element: <LessonLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        loader: () => redirect('/auth-flow-overview?focus=all'),
      },
      {
        id: 'overview-route',
        path: 'auth-flow-overview',
        loader: overviewLoader,
        element: <OverviewPage />,
      },
      {
        id: 'protected-branch',
        path: 'protected-workspace',
        loader: protectedBranchLoader,
        element: <ProtectedWorkspacePage />,
        children: [
          {
            index: true,
            loader: () => redirect('/protected-workspace/dashboard'),
          },
          {
            id: 'protected-leaf',
            path: ':screenId',
            loader: protectedScreenLoader,
            element: <ProtectedScreenPage />,
            errorElement: <ProtectedScreenErrorBoundary />,
          },
        ],
      },
      {
        path: 'role-access',
        children: [
          {
            index: true,
            loader: () => redirect('/role-access/editor-lab'),
          },
          {
            id: 'role-route',
            path: ':screenId',
            loader: roleAccessLoader,
            element: <RoleAccessPage />,
            errorElement: <RoleAccessBoundary />,
          },
        ],
      },
      {
        id: 'session-route',
        path: 'session-lifecycle',
        loader: sessionLifecycleLoader,
        action: sessionLifecycleAction,
        element: <SessionLifecyclePage />,
      },
      {
        id: 'auth-ux-route',
        path: 'auth-ux',
        loader: authUxLoader,
        action: authUxAction,
        element: <AuthUxPage />,
      },
      {
        path: 'access-architecture',
        element: <ArchitecturePage />,
      },
      {
        path: '*',
        element: <Navigate to="/auth-flow-overview?focus=all" replace />,
      },
    ],
  },
]);
