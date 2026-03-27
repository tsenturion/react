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
import { describeLabFromPath } from './lib/e2e-domain';
import {
  lessonShellLoader,
  overviewLoader,
  type LessonShellLoaderData,
} from './lib/e2e-runtime';
import { stackBadges } from './lib/stack-meta';
import { useJourneyState, JourneyStateProvider } from './state/JourneyStateContext';
import { AuthJourneysPage } from './pages/AuthJourneysPage';
import { BoundariesPage } from './pages/BoundariesPage';
import { DataJourneysPage } from './pages/DataJourneysPage';
import { FormJourneysPage } from './pages/FormJourneysPage';
import { LoginScreenPage } from './pages/LoginScreenPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReleaseWorkspacePage } from './pages/ReleaseWorkspacePage';
import { RouteJourneysPage } from './pages/RouteJourneysPage';
import { SubmissionReviewPage } from './pages/SubmissionReviewPage';

function LessonShell() {
  const shellData = useLoaderData() as LessonShellLoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const { session, lastSubmission } = useJourneyState();
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в lesson shell и сохраняется, пока вы проходите между лабораториями и скрытыми маршрутами E2E-сценариев.',
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
            <span className="soft-label">Модуль 7 / Урок 42</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              E2E тестирование
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете, как браузерные сценарии подтверждают работу маршрутов,
              авторизации, форм, загрузки данных и переходов между экранами как одной
              системы, а не как набора изолированных компонентов.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Реальные пользовательские пути через routes, redirect, protected screen,
                review flow и восстановление после сетевой ошибки.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть настоящие Playwright-specs, hidden routes и supporting
                Vitest suites, которые страхуют системные сценарии снизу.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                E2E не должен дублировать все component-тесты. Его сила в том, что он
                подтверждает связность приложения как единой системы.
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
              Реальных Playwright journeys: <strong>{shellData.realE2EScenarios}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Скрытых системных экранов: <strong>{shellData.hiddenScreens}</strong>.
              Supporting Vitest suites:{' '}
              <strong>{shellData.supportingVitestSuites}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Сессия:{' '}
              <strong>
                {session ? `${session.name} (${session.role})` : 'ещё не открыта'}
              </strong>
              . Последний review route:{' '}
              <strong>{lastSubmission?.title ?? 'ещё не проходился'}</strong>.
            </p>
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
                <li>`src/components/e2e/AuthFlowPanel.tsx`</li>
                <li>`src/components/e2e/ReleaseFormLab.tsx`</li>
                <li>`src/components/e2e/ReleaseQueueLab.tsx`</li>
                <li>`tests/e2e/e2e-journeys.spec.ts`</li>
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
                    Сначала смотрите `src/router.tsx`, затем hidden screens и только после
                    этого переходите к `tests/e2e/e2e-journeys.spec.ts`.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сопоставляйте каждый системный путь с более дешёвой страховкой снизу:
                    unit runtime, component suite или integration flow.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии в коде стоят рядом с intent redirect, review route и retry
                    flow, потому что именно там чаще всего рождаются скрытые регрессии.
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
                Внизу остаются только реальные версии инструментов, которые участвуют в
                текущем уроке про End-to-End проверку React-приложения.
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
          Если ошибка дошла до корневой границы, значит она не была локализована внутри
          конкретного системного пути. Для урока про E2E это повод проверить, какая
          lower-level страховка отсутствовала до браузерного слоя.
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
          to="/e2e-overview?focus=all"
          className="mt-5 inline-flex rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Вернуться к уроку
        </Link>
      </div>
    </div>
  );
}

function LessonEntry() {
  return (
    <JourneyStateProvider>
      <LessonShell />
    </JourneyStateProvider>
  );
}

function RequireSession() {
  const { session } = useJourneyState();
  const location = useLocation();

  if (!session) {
    // Guard сохраняет intended destination в URL: E2E проверяет именно итоговый путь,
    // а не внутренний вызов navigate внутри компонента.
    const intent = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/auth/login?intent=${intent}`} replace />;
  }

  return <Outlet />;
}

export const appRouter = createBrowserRouter([
  {
    id: 'lesson-shell',
    path: '/',
    loader: lessonShellLoader,
    element: <LessonEntry />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        loader: () => redirect('/e2e-overview?focus=all'),
      },
      {
        path: 'e2e-overview',
        loader: overviewLoader,
        element: <OverviewPage />,
      },
      {
        path: 'route-journeys',
        element: <RouteJourneysPage />,
      },
      {
        path: 'auth-journeys',
        element: <AuthJourneysPage />,
      },
      {
        path: 'form-journeys',
        element: <FormJourneysPage />,
      },
      {
        path: 'data-journeys',
        element: <DataJourneysPage />,
      },
      {
        path: 'e2e-boundaries',
        element: <BoundariesPage />,
      },
      {
        path: 'auth/login',
        element: <LoginScreenPage />,
      },
      {
        element: <RequireSession />,
        children: [
          {
            path: 'workspace/release',
            element: <ReleaseWorkspacePage />,
          },
        ],
      },
      {
        path: 'submission-review',
        element: <SubmissionReviewPage />,
      },
      {
        path: '*',
        element: <Navigate to="/e2e-overview?focus=all" replace />,
      },
    ],
  },
]);
