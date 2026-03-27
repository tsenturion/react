import { Link, useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { type RoleAccessLoaderData } from '../lib/auth-runtime';
import { projectStudyByLab } from '../lib/project-study';

const roleLinks = [
  { href: '/role-access/editor-lab', label: 'editor-lab' },
  { href: '/role-access/admin-panel', label: 'admin-panel' },
  { href: '/role-access/audit-room', label: 'audit-room' },
] as const;

export function RoleAccessPage() {
  const data = useLoaderData() as RoleAccessLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Roles and Access"
        title="Валидная сессия ещё не означает доступ ко всем защищённым экранам"
        copy="Эта лаборатория показывает второй слой после аутентификации: если роль не проходит проверку, route loader возвращает локальный 403 boundary, а не общий logout."
        aside={<StatusPill tone="success">{data.session.role}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current role"
          value={data.session.role}
          hint="Именно текущая роль решает, можно ли открыть выбранный screen."
        />
        <MetricCard
          label="Required role"
          value={data.screen.requiredRole}
          hint="Role gate сравнивает session role и requiredRole на маршрутизаторном уровне."
          tone="accent"
        />
        <MetricCard
          label="Loaded at"
          value={data.loadedAt}
          hint="Loader screen-а отработал только после успешной проверки доступа."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {roleLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <ListBlock title="Почему экран закрыт ролью" items={[data.screen.whyProtected]} />
        <ListBlock title="Allowed roles" items={data.screen.allowedRoles} />
        <ListBlock title="Где ломается UX" items={data.screen.pitfalls} />
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab.roles} />
      </Panel>
    </div>
  );
}
