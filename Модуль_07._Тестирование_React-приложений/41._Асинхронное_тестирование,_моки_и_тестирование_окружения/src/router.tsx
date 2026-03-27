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
import { describeLabFromPath } from './lib/async-testing-domain';
import {
  lessonShellLoader,
  type LessonShellLoaderData,
  overviewLoader,
} from './lib/async-testing-runtime';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { stackBadges } from './lib/stack-meta';
import { AntiFragilityPage } from './pages/AntiFragilityPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { HttpMocksPage } from './pages/HttpMocksPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { WaitingPage } from './pages/WaitingPage';

function LessonLayout() {
  const shellData = useLoaderData() as LessonShellLoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в lesson shell и сохраняется, пока вы переключаете лаборатории про async UI, mocked HTTP и test environment.',
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
            <span className="soft-label">Модуль 7 / Урок 41</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Асинхронное тестирование, моки и тестирование окружения
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы связываете async UI, mocked HTTP, provider-aware render helpers и
              test environment в одну стратегию. Хороший тест ждёт наблюдаемый результат,
              мокает только внешнюю границу и не протекает в соседние сценарии.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Async UI
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Loading, error, empty, повторные запросы и ожидание DOM-result вместо
                фиксированной паузы.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Mock Boundary
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                fetch, provider harness и client-границы подменяются точечно, без знания о
                внутренних `setState` и callback-цепочках.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Test Environment
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `vitest.setup.ts`, fake timers, reset mocks и restore globals удерживают
                весь suite предсказуемым при полном прогоне.
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
              Реальных async suites: <strong>{shellData.realAsyncSuites}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Mock utilities: <strong>{shellData.mockUtilities}</strong>. Provider
              helpers: <strong>{shellData.providerHelpers}</strong>. Environment resets:{' '}
              <strong>{shellData.environmentResets}</strong>. Router state:{' '}
              <strong>{navigation.state}</strong>.
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
                <li>`src/components/async-testing/AsyncResourceLab.tsx`</li>
                <li>`src/components/async-testing/MockedHttpLab.tsx`</li>
                <li>`src/components/async-testing/ProviderHarnessLab.tsx`</li>
                <li>`src/components/async-testing/PollingEnvironmentLab.tsx`</li>
                <li>`src/test/test-utils.tsx`</li>
                <li>`vitest.setup.ts`</li>
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
                    Сначала смотрите `src/lib/async-testing-runtime.ts`, затем
                    сопоставляйте модель выбора стратегии с живыми лабораториями и test
                    files рядом.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сравнивайте live UI в лаборатории с тестом к этому компоненту:
                    мок-граница, ожидание результата и reset окружения должны совпадать.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Отдельно проверьте `vitest.setup.ts`, `src/test/mock-fetch.ts` и
                    `src/test/deferred.ts`: здесь лежит инфраструктура устойчивого async
                    suite.
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
                текущем уроке про async testing, mocks и test environment.
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
          Если ошибка дошла до корневой границы, значит она не локализована внутри
          конкретной лаборатории. Для урока про async testing это сигнал проверить, где
          разорвалась синхронизация между UI, моками и тестовым окружением.
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
          to="/async-overview?focus=all"
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
    loader: lessonShellLoader,
    element: <LessonLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        loader: () => redirect('/async-overview?focus=all'),
      },
      {
        path: 'async-overview',
        loader: overviewLoader,
        element: <OverviewPage />,
      },
      {
        path: 'loading-and-waiting',
        element: <WaitingPage />,
      },
      {
        path: 'mocked-http',
        element: <HttpMocksPage />,
      },
      {
        path: 'providers-and-context',
        element: <ProvidersPage />,
      },
      {
        path: 'test-environment',
        element: <EnvironmentPage />,
      },
      {
        path: 'anti-fragility',
        element: <AntiFragilityPage />,
      },
      {
        path: '*',
        element: <Navigate to="/async-overview?focus=all" replace />,
      },
    ],
  },
]);
