import clsx from 'clsx';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { stackBadges } from './lib/stack-meta';
import { lessonLabs } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { describeLabFromPath } from './lib/routing-domain';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { BasicsPage } from './pages/BasicsPage';
import { NavigationPage } from './pages/NavigationPage';
import { ParamsPage } from './pages/ParamsPage';
import { SpaPage } from './pages/SpaPage';
import { TreePage } from './pages/TreePage';

function LessonLayout() {
  const location = useLocation();
  const shellSessionId = useId().replace(/:/g, '').slice(-6);
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в layout route и сохраняется между client-side переходами.',
  );
  const activeLabId = describeLabFromPath(location.pathname);
  const currentStamp = `${location.pathname}${location.search || ''}`;
  const transitionLog = useSyncExternalStore(
    shellTransitionLogStore.subscribe,
    shellTransitionLogStore.getSnapshot,
    shellTransitionLogStore.getSnapshot,
  );

  // Layout route остаётся смонтированным, пока меняются только дочерние страницы.
  // Поэтому shell state ниже переживает обычные client-side переходы между route children.
  useEffect(() => {
    shellTransitionLogStore.record(currentStamp);
  }, [currentStamp]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 6 / Урок 35</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Основы клиентской маршрутизации
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете client-side routing, React Router, route tree,
              динамические параметры маршрутов и то, как URL превращается в часть
              архитектуры SPA, а не просто в строку в адресной строке.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только `Link` и `Route`, но и route tree, layout route, params,
                переходы без полной перезагрузки и границу между экраном и локальным
                UI-состоянием.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам проект построен на реальном `React Router`: `BrowserRouter`, `Routes`,
                `Route`, `Outlet`, `NavLink`, `useNavigate`, `useParams` и shared layout
                state.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Маршрут нужен не для любой кнопки и не для любого toggle. Он нужен там,
                где экран, URL и пользовательский сценарий реально образуют один смысловой
                слой.
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
              Shell state
            </p>
            <label className="mt-3 block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Заметка в layout route
              </span>
              <textarea
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400"
              />
            </label>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Session id текущего shell: <strong>{shellSessionId}</strong>. При обычной
              router-навигации он не меняется.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Для быстрого сравнения:{' '}
              <Link
                to="/navigation"
                className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
              >
                client transition
              </Link>{' '}
              и{' '}
              <Link
                reloadDocument
                to="/navigation"
                className="font-semibold text-rose-700 underline decoration-rose-300 underline-offset-4"
              >
                document reload
              </Link>
              .
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Переходы внутри SPA
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
                    Идите по порядку: сначала client-side переходы, потом route tree,
                    навигация, params, SPA mental model и только потом архитектурный
                    advisor.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите `src/router.tsx`, `src/pages` и `src/lib/routing-domain.ts`
                    вместе: так видно и реальный route tree, и то, как URL связан с
                    экранами и сценариями.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с layout state, params и route placement
                    decisions, потому что именно там routing чаще всего или недооценивают,
                    или раздувают без необходимости.
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
                текущем routing-проекте и зафиксированы в `package.json`.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function NotFoundRoutePage() {
  return (
    <div className="space-y-4 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-950">
      <h2 className="text-2xl font-bold tracking-tight">Маршрут не найден</h2>
      <p className="text-sm leading-6">
        Эта ветка показывает, что route tree ограничивает допустимые адреса, а не просто
        прячет несколько компонентов за условным рендерингом.
      </p>
      <Link
        to="/client-routing"
        className="inline-flex rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Вернуться к лабораториям
      </Link>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LessonLayout />}>
        <Route index element={<Navigate to="/client-routing" replace />} />
        <Route path="client-routing" element={<BasicsPage />} />
        <Route path="route-tree" element={<TreePage />} />
        <Route path="navigation" element={<NavigationPage />} />
        <Route path="params">
          <Route index element={<Navigate to="/params/module-6" replace />} />
          <Route path=":lessonId" element={<ParamsPage />} />
        </Route>
        <Route path="spa-mental-model" element={<SpaPage />} />
        <Route path="routing-architecture" element={<ArchitecturePage />} />
        <Route path="*" element={<NotFoundRoutePage />} />
      </Route>
    </Routes>
  );
}
