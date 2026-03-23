import { useId, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function LayoutRoutesPage() {
  const location = useLocation();
  const layoutSessionId = useId().replace(/:/g, '').slice(-6);
  const [layoutNote, setLayoutNote] = useState(
    'Эта заметка живёт в parent layout route и не теряется при переходе между child routes.',
  );
  const activeChild = location.pathname.split('/').at(-1) ?? 'overview';

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Layout Route"
        title="Layout route нужен там, где несколько экранов делят общий каркас и общий контекст"
        copy="Parent layout route позволяет держать toolbar, заметки, навигацию и другие общие элементы в одном месте, пока дочерние маршруты меняют только содержимое рабочей области."
        aside={<StatusPill tone="success">child: {activeChild}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Layout session"
          value={layoutSessionId}
          hint="Пока меняется только child route, parent layout instance не пересоздаётся."
        />
        <MetricCard
          label="Active child"
          value={activeChild}
          hint="Меняется только дочерний segment и содержимое Outlet."
          tone="accent"
        />
        <MetricCard
          label="Preserved note"
          value={`${layoutNote.length} символов`}
          hint="Local state родителя остаётся живым между переходами внутри ветки."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Parent layout controls
          </p>
          {/* Parent route остаётся смонтированным, пока меняются только child segments.
              Именно поэтому textarea ниже переживает переходы overview/checklist/activity. */}
          <textarea
            value={layoutNote}
            onChange={(event) => setLayoutNote(event.target.value)}
            className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400"
          />

          <div className="space-y-2">
            {(['overview', 'checklist', 'activity'] as const).map((child) => (
              <NavLink
                key={child}
                to={`/layout-routes/${child}`}
                className={({ isActive }) =>
                  isActive
                    ? 'block rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white'
                    : 'block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200'
                }
              >
                {child}
              </NavLink>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Ниже рендерится `Outlet` дочернего route. Parent layout не дублирует свои
            элементы в каждом child screen и остаётся общей рамкой ветки.
          </p>
          <Outlet />
        </Panel>
      </div>

      <BeforeAfter
        beforeTitle="Повторение каркаса на каждой странице"
        before="Если overview, checklist и activity отдельно повторяют toolbar и общие контролы, код быстро расходится и теряет общий navigation context."
        afterTitle="Общий layout route"
        after="Parent route держит общий каркас в одном месте, а child routes фокусируются только на своих leaf screens."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.layouts} />
      </Panel>
    </div>
  );
}
