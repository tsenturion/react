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
import { describeLabFromPath } from './lib/rtl-domain';
import {
  lessonShellLoader,
  overviewLoader,
  type LessonShellLoaderData,
} from './lib/rtl-runtime';
import { stackBadges } from './lib/stack-meta';
import { AntiPatternsPage } from './pages/AntiPatternsPage';
import { CustomRenderPage } from './pages/CustomRenderPage';
import { FormsPage } from './pages/FormsPage';
import { InteractionsPage } from './pages/InteractionsPage';
import { OverviewPage } from './pages/OverviewPage';
import { QueryPriorityPage } from './pages/QueryPriorityPage';

function LessonLayout() {
  const shellData = useLoaderData() as LessonShellLoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в lesson shell и сохраняется, пока вы переключаете лаборатории React Testing Library.',
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
            <span className="soft-label">Модуль 7 / Урок 40</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              React Testing Library и тестирование пользовательского поведения
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете, как писать user-centric тесты: искать элементы через
              доступные роли, вести сценарий через `userEvent` и проверять поведение
              вместо внутренних деталей реализации.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Query priority, роли, формы, `userEvent`, `custom render` и границы между
                user-centric и implementation-centric тестами.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные RTL suites, helper с провайдерами и компоненты,
                которые намеренно спроектированы под поведенческие проверки.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Тест не должен знать лишнего о private state, className и внутренних
                callback-цепочках, если пользователь этого не видит.
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
              Реальных RTL suites: <strong>{shellData.realRtlSuites}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Реальных test files: <strong>{shellData.realTestFiles}</strong>. Helper
              files: <strong>{shellData.helperFiles}</strong>. Router state:{' '}
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
                <li>`src/lib/learning-model.test.ts`</li>
                <li>`src/components/testing-library/QueryPriorityWorkbench.test.tsx`</li>
                <li>`src/components/testing-library/InteractionSequenceLab.test.tsx`</li>
                <li>`src/components/testing-library/FeedbackFormLab.test.tsx`</li>
                <li>`src/components/testing-library/ProviderHarnessLab.test.tsx`</li>
                <li>`src/test/test-utils.tsx`</li>
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
                    Сначала смотрите `src/lib/rtl-runtime.ts`, затем сопоставляйте его с
                    реальными RTL-компонентами и тестами рядом с ними.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сравнивайте live UI в лаборатории с тестом к этому компоненту: query,
                    действие пользователя и наблюдаемый DOM-result должны совпадать.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии в коде отмечают места, где легко скатиться в лишние
                    implementation details или слишком тяжёлый helper.
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
                текущем уроке про React Testing Library.
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
          конкретной лаборатории. Для урока про RTL это хороший сигнал посмотреть, какой
          именно пользовательский контракт оказался неустойчивым.
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
          to="/rtl-overview?focus=all"
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
        loader: () => redirect('/rtl-overview?focus=all'),
      },
      {
        path: 'rtl-overview',
        loader: overviewLoader,
        element: <OverviewPage />,
      },
      {
        path: 'query-priority',
        element: <QueryPriorityPage />,
      },
      {
        path: 'user-interactions',
        element: <InteractionsPage />,
      },
      {
        path: 'forms-and-errors',
        element: <FormsPage />,
      },
      {
        path: 'custom-render',
        element: <CustomRenderPage />,
      },
      {
        path: 'anti-patterns',
        element: <AntiPatternsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/rtl-overview?focus=all" replace />,
      },
    ],
  },
]);
