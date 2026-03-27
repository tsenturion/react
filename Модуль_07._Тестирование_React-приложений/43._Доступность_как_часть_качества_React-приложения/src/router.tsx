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
import {
  describeLabFromPath,
  shellAccessibilitySurfaces,
} from './lib/accessibility-domain';
import {
  lessonShellLoader,
  overviewLoader,
  type LessonShellLoaderData,
} from './lib/accessibility-runtime';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { KeyboardPage } from './pages/KeyboardPage';
import { LabelsPage } from './pages/LabelsPage';
import { OverviewPage } from './pages/OverviewPage';
import { SemanticsPage } from './pages/SemanticsPage';
import { TestingPage } from './pages/TestingPage';

function LessonLayout() {
  const shellData = useLoaderData() as LessonShellLoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const activeLabId = describeLabFromPath(location.pathname);
  const activeLab = lessonLabs.find((item) => item.id === activeLabId) ?? lessonLabs[0];
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в lesson shell и сохраняется, пока вы переключаете лаборатории про labels, keyboard flow, semantic HTML и accessibility-тесты.',
  );

  const currentLocation = navigation.location ?? location;
  const currentStamp = `${currentLocation.pathname}${currentLocation.search}`;
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
      <a href="#lesson-content" className="skip-link">
        Перейти к содержимому урока
      </a>
      <div className="sr-only" aria-live="polite">
        {`Открыта лаборатория: ${activeLab.label}`}
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 7 / Урок 43</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Доступность как часть качества React-приложения
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете доступность не как отдельный чекбокс, а как часть
              устройства интерфейса: labels, keyboard support, semantic HTML, маршруты,
              сообщения об ошибках и user-centric тестирование работают вместе.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Labels and names
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Поле становится понятным только тогда, когда у него есть наблюдаемая и
                связанная подпись, а ошибка и подсказка доходят до assistive tech.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Keyboard and focus
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Диалог, меню и кнопки остаются управляемыми, только если фокус движется
                предсказуемо и возвращается туда, откуда пользователь пришёл.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Testing and quality
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Доступность проверяется живым UI, role-based assertions и keyboard flow, а
                не случайным наличием `aria-*` в разметке.
              </p>
            </div>
          </div>
        </header>

        <nav aria-label="Лаборатории урока" className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {lessonLabs.map((item) => (
              <NavLink
                key={item.id}
                to={item.href}
                className={clsx(
                  'rounded-2xl px-4 py-3 text-left transition',
                  activeLabId === item.id
                    ? 'bg-teal-700 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50',
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    'mt-1 block text-xs leading-5',
                    activeLabId === item.id ? 'text-teal-100' : 'text-slate-500',
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
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-teal-500"
              />
            </label>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Последняя загрузка shell loader: <strong>{shellData.loadedAt}</strong>.
              Лабораторий темы: <strong>{shellData.liveLabs}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Landmarks в shell: <strong>{shellData.shellLandmarks}</strong>. Слоёв
              проверки качества: <strong>{shellData.verificationLayers}</strong>. Router
              state: <strong>{navigation.state}</strong>.
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
                Accessibility shell
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {shellAccessibilitySurfaces.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <main id="lesson-content" className="panel p-6 sm:p-8">
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
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal-600" />
                  <p className="text-sm leading-6">
                    Сначала смотрите `src/router.tsx`, затем shell landmarks и только
                    после этого переходите к лабораториям и тестам рядом с ними.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сопоставляйте live UI с component tests: роль, доступное имя,
                    клавиатурный путь и возврат фокуса должны проверяться тем же языком,
                    которым реально пользуется человек.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Отдельно смотрите `src/lib/accessibility-runtime.ts` и
                    `src/lib/project-study.ts`: там видно, как учебные сценарии связаны с
                    конкретным кодом проекта.
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
                    className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                Внизу остаются только реальные версии инструментов, которые участвуют в
                текущем уроке про доступность, компоненты и user-centric проверки.
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
          Если ошибка дошла до корневой границы, значит сбой не был локализован в
          конкретной лаборатории. Для урока про accessibility это повод проверить, где
          качество интерфейса оказалось завязано на хрупкую внутреннюю реализацию.
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
          to="/a11y-overview?focus=all"
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
        loader: () => redirect('/a11y-overview?focus=all'),
      },
      {
        path: 'a11y-overview',
        loader: overviewLoader,
        element: <OverviewPage />,
      },
      {
        path: 'labels-and-names',
        element: <LabelsPage />,
      },
      {
        path: 'keyboard-and-focus',
        element: <KeyboardPage />,
      },
      {
        path: 'semantics-and-roles',
        element: <SemanticsPage />,
      },
      {
        path: 'testing-and-audits',
        element: <TestingPage />,
      },
      {
        path: 'a11y-architecture',
        element: <ArchitecturePage />,
      },
      {
        path: '*',
        element: <Navigate to="/a11y-overview?focus=all" replace />,
      },
    ],
  },
]);
