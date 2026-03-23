import { Form, Link, useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { type AuthFocus } from '../lib/auth-domain';
import { type OverviewLoaderData } from '../lib/auth-runtime';
import { projectStudyByLab } from '../lib/project-study';

const focuses: readonly AuthFocus[] = ['all', 'routing', 'roles', 'session', 'ux'];

export function OverviewPage() {
  const data = useLoaderData() as OverviewLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Auth Flow"
        title="Маршруты начинают управлять доступом, redirect logic и состоянием сессии"
        copy="В этой лаборатории overview loader читает query string, собирает актуальный auth playbook и показывает текущий session snapshot. Экран не симулирует auth flow локальным эффектом после рендера."
        aside={
          <StatusPill tone={data.session ? 'success' : 'warn'}>
            {data.session ? `role: ${data.session.role}` : 'guest mode'}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Playbooks"
          value={String(data.cards.length)}
          hint="Количество сценариев меняется route loader-ом через query string focus."
        />
        <MetricCard
          label="Current focus"
          value={data.focus}
          hint="Маршрут получает `focus` из URL и сразу строит новый lesson snapshot."
          tone="accent"
        />
        <MetricCard
          label="Request URL"
          value={data.requestUrl}
          hint="Здесь видно, что auth overview уже живёт в связке route + URL, а не в изолированном local state."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Filter by auth concern
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Меняйте фокус через GET Form: маршрутизатор заново отдаёт screen data и
              показывает, как auth тема раскладывается по routing, role, session и UX
              слоям.
            </p>
          </div>

          <Link
            to="/auth-ux?next=/protected-workspace/dashboard"
            className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Перейти в auth UX
          </Link>
        </div>

        <Form method="get" className="grid gap-4 lg:grid-cols-[240px_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Focus</span>
            <select
              name="focus"
              defaultValue={data.focus}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
            >
              {focuses.map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Применить filter
            </button>
            <Link
              to="/auth-flow-overview?focus=all"
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Сбросить focus
            </Link>
          </div>
        </Form>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {data.cards.map((item) => (
          <Panel key={item.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                {item.focus}
              </span>
            </div>

            <ListBlock title="Route concern" items={[item.routeConcern]} />
            <ListBlock title="UX concern" items={[item.uxConcern]} />
            <ListBlock title="Где легко ошибиться" items={item.pitfalls} />
          </Panel>
        ))}
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.overview} />
      </Panel>
    </div>
  );
}
