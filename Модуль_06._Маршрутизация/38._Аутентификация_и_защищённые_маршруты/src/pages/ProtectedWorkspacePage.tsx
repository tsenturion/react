import { NavLink, Outlet, useLoaderData, useNavigation } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { type ProtectedBranchLoaderData } from '../lib/auth-runtime';
import { projectStudyByLab } from '../lib/project-study';

export function ProtectedWorkspacePage() {
  const data = useLoaderData() as ProtectedBranchLoaderData;
  const navigation = useNavigation();

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Protected Routes"
        title="Защищённая ветка живёт как route branch, а не как случайная проверка внутри виджета"
        copy="Если сессии нет, loader этой ветки вообще не пустит экран в рендер и переведёт на login с сохранением намерения. Если токен просрочен, сначала сработает refresh logic."
        aside={<StatusPill tone="success">{data.session.role}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Allowed screens"
          value={String(data.screens.length)}
          hint="Parent branch знает все child screens, которые принадлежат защищённой ветке."
        />
        <MetricCard
          label="Current session"
          value={data.session.displayName}
          hint="Ветка уже получила валидный session snapshot до leaf render."
          tone="accent"
        />
        <MetricCard
          label="Navigation state"
          value={navigation.state}
          hint="При переходе между child screens router обновляет branch навигацию сам."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Protected screens
          </p>

          <div className="space-y-2">
            {data.screens.map((screen) => (
              <NavLink
                key={screen.id}
                to={`/protected-workspace/${screen.id}`}
                className={({ isActive }) =>
                  isActive
                    ? 'block rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white'
                    : 'block rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                }
              >
                {screen.title}
              </NavLink>
            ))}
          </div>

          <ListBlock title="Branch notes" items={data.branchNotes} />
        </Panel>

        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Ниже рендерится leaf screen внутри защищённой ветки. Parent branch уже знает,
            что сессия валидна, и child screen может сосредоточиться на своём конкретном
            protected contract.
          </p>
          <Outlet />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.protected} />
      </Panel>
    </div>
  );
}
