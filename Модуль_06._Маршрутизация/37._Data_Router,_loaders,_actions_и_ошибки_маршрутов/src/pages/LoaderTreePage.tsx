import { NavLink, Outlet, useLoaderData, useNavigation } from 'react-router-dom';

import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import { type LoaderBranchLoaderData } from '../lib/data-router-runtime';

export function LoaderTreePage() {
  const data = useLoaderData() as LoaderBranchLoaderData;
  const navigation = useNavigation();

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Nested Loaders"
        title="Parent и child routes получают собственные loaders и делят одну route branch"
        copy="Parent route даёт общий branch context и sidebar, а child route грузит конкретную сущность по `:lessonId`. Если child loader падает, parent layout может остаться на месте."
        aside={<StatusPill tone="success">branch loader ready</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Branch lessons"
          value={String(data.lessons.length)}
          hint="Parent loader отдаёт общий branch dataset для sidebar и контекста экрана."
        />
        <MetricCard
          label="Navigation state"
          value={navigation.state}
          hint="При смене `:lessonId` router перезапускает child loader и показывает pending state."
          tone="accent"
        />
        <MetricCard
          label="Parent loaded at"
          value={data.loadedAt}
          hint="Parent loader живёт на уровне branch, а не внутри leaf-компонента."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Branch notes
          </p>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {data.branchNotes.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>

          <p className="pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Leaf routes
          </p>
          <div className="space-y-2">
            {data.lessons.map((lesson) => (
              <NavLink
                key={lesson.id}
                to={`/loader-tree/${lesson.id}`}
                className={({ isActive }) =>
                  isActive
                    ? 'block rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white'
                    : 'block rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                }
              >
                {lesson.title}
              </NavLink>
            ))}
            <NavLink
              to="/loader-tree/missing-lesson"
              className="block rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Открыть missing leaf
            </NavLink>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Ниже рендерится child route branch. Даже если конкретный leaf loader падает,
            сам parent route с sidebar и notes может остаться живым.
          </p>
          <Outlet />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.nested} />
      </Panel>
    </div>
  );
}
