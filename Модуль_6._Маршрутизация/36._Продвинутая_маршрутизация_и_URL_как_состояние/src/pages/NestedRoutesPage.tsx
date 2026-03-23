import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { RouteTreeVisualizer } from '../components/routing-state/RouteTreeVisualizer';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { advancedRouteTree, routingModules } from '../lib/routing-domain';
import { projectStudyByLab } from '../lib/project-study';

export function NestedRoutesPage() {
  const location = useLocation();
  const currentLeaf = location.pathname.split('/').at(-1) ?? 'index';

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Nested Route Tree"
        title="Вложенные маршруты собирают экран в иерархию, а не в плоский набор ссылок"
        copy="Nested routes позволяют parent route держать общий shell, а leaf route менять только ту часть экрана, которая действительно зависит от выбранной ветки."
        aside={<StatusPill tone="success">active leaf: {currentLeaf}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Parent path"
          value="/nested-routes"
          hint="Это общий уровень ветки, который остаётся стабильным для всех её leaf screens."
        />
        <MetricCard
          label="Leaf route"
          value={currentLeaf}
          hint="Leaf route меняет только содержимое Outlet, а не всю оболочку ветки."
          tone="accent"
        />
        <MetricCard
          label="Route depth"
          value="2 уровня"
          hint="Parent route и child route создают читаемую иерархию экранов."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ветки по moduleId
          </p>
          {routingModules.map((item) => (
            <NavLink
              key={item.id}
              to={`/nested-routes/${item.id}`}
              className={({ isActive }) =>
                isActive
                  ? 'block rounded-2xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-950'
                  : 'block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50'
              }
            >
              <strong>{item.title}</strong>
              <span className="mt-1 block text-xs text-slate-500">{item.id}</span>
            </NavLink>
          ))}
        </Panel>

        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Parent route ниже рендерит общий каркас, а `Outlet` вставляет конкретный leaf
            screen. Это важная граница: parent route описывает ветку, child route
            описывает конкретное состояние внутри неё.
          </p>
          <Outlet />
        </Panel>

        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Route tree
          </p>
          <RouteTreeVisualizer tree={advancedRouteTree} pathname={location.pathname} />
        </Panel>
      </div>

      <BeforeAfter
        beforeTitle="Плоский набор экранов"
        before="Если все leaf screens живут рядом без parent route, у экрана быстро дублируются sidebar, header и общий navigation context."
        afterTitle="Nested route branch"
        after="Parent route держит общий каркас ветки, а leaf route меняет только ту часть экрана, которая действительно зависит от выбранной сущности."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.nested} />
      </Panel>
    </div>
  );
}
