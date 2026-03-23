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

import { lessonLabs } from './lib/learning-model';
import { shellTransitionLogStore } from './lib/navigation-log-store';
import { describeLabFromPath } from './lib/routing-domain';
import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { EntitySelectionPage } from './pages/EntitySelectionPage';
import { LayoutActivityPane } from './pages/LayoutActivityPane';
import { LayoutChecklistPane } from './pages/LayoutChecklistPane';
import { LayoutOverviewPane } from './pages/LayoutOverviewPane';
import { LayoutRoutesPage } from './pages/LayoutRoutesPage';
import { NestedIndexPane } from './pages/NestedIndexPane';
import { NestedModulePane } from './pages/NestedModulePane';
import { NestedRoutesPage } from './pages/NestedRoutesPage';
import { SearchParamsPage } from './pages/SearchParamsPage';
import { UrlStatePage } from './pages/UrlStatePage';

function LessonLayout() {
  const location = useLocation();
  const shellSessionId = useId().replace(/:/g, '').slice(-6);
  const [shellNote, setShellNote] = useState(
    'Эта заметка живёт в общем lesson layout и переживает переходы между labs и их дочерними route branches.',
  );
  const activeLabId = describeLabFromPath(location.pathname);
  const currentStamp = `${location.pathname}${location.search || ''}`;
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
            <span className="soft-label">Модуль 6 / Урок 36</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Продвинутая маршрутизация и URL как состояние
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете nested routes, layout routes, search params и URL-driven
              state. Главная цель урока: увидеть, как адресная строка начинает описывать
              не только экран, но и его устойчивые режимы.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только `useSearchParams`, но и nested route trees, parent layouts, path
                params, выбранные сущности и границу между URL state и local UI state.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам урок живёт на реальном nested route tree: `Outlet`, parent routes,
                `useSearchParams`, `useParams`, query normalization и URL-driven filters
                без лишних эффектов.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В URL стоит хранить то, что образует navigation contract: screen identity,
                выбранную сущность, tab, sort и filter. Hover, draft и мелкие визуальные
                реакции туда не относятся.
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
                Заметка в общем layout route
              </span>
              <textarea
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400"
              />
            </label>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Shell id текущего lesson layout: <strong>{shellSessionId}</strong>.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Для быстрого сравнения откройте{' '}
              <Link
                to="/search-params?level=advanced&sort=title&view=cards"
                className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
              >
                query-driven filters
              </Link>{' '}
              и{' '}
              <Link
                to="/entities/entity-review?tab=routing&panel=links"
                className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
              >
                deep link с path param
              </Link>
              .
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Transition log
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
                    Сначала смотрите `src/router.tsx`, затем страницы `nested` и
                    `layouts`, а уже потом `search params` и `URL state`.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сопоставляйте route tree, компоненты и query normalization вместе: так
                    видно, что URL в этом уроке действительно управляет экраном.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с parent layouts, `useSearchParams` и route
                    placement decisions, потому что именно там чаще всего появляется
                    архитектурная путаница.
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
        Эта ветка показывает, что route tree задаёт допустимую карту адресов, а не просто
        прячет несколько экранов за условным рендерингом.
      </p>
      <Link
        to="/nested-routes/module-6"
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
        <Route index element={<Navigate to="/nested-routes/module-6" replace />} />
        <Route path="nested-routes" element={<NestedRoutesPage />}>
          <Route index element={<NestedIndexPane />} />
          <Route path=":moduleId" element={<NestedModulePane />} />
        </Route>
        <Route path="layout-routes" element={<LayoutRoutesPage />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<LayoutOverviewPane />} />
          <Route path="checklist" element={<LayoutChecklistPane />} />
          <Route path="activity" element={<LayoutActivityPane />} />
        </Route>
        <Route path="search-params" element={<SearchParamsPage />} />
        <Route path="url-state" element={<UrlStatePage />} />
        <Route path="entities">
          <Route
            index
            element={
              <Navigate to="/entities/module-6?tab=overview&panel=summary" replace />
            }
          />
          <Route path=":entityId" element={<EntitySelectionPage />} />
        </Route>
        <Route path="navigation-architecture" element={<ArchitecturePage />} />
        <Route path="*" element={<NotFoundRoutePage />} />
      </Route>
    </Routes>
  );
}
