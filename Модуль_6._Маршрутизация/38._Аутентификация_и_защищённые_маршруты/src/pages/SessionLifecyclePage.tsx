import { Form, useActionData, useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import type {
  SessionLifecycleActionData,
  SessionLifecycleLoaderData,
} from '../lib/auth-runtime';
import { projectStudyByLab } from '../lib/project-study';

export function SessionLifecyclePage() {
  const data = useLoaderData() as SessionLifecycleLoaderData;
  const actionData = useActionData() as SessionLifecycleActionData | undefined;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Session and Tokens"
        title="Сессия живёт дольше одного рендера и влияет на каждый защищённый переход"
        copy="Здесь вы вручную переключаете login, expire, refresh, forced refresh failure и logout. Так видно, как routing, auth store и UX ожидают друг друга."
        aside={
          <StatusPill tone={data.session ? 'success' : 'warn'}>
            {data.session ? 'session active' : 'guest'}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Session owner"
          value={data.session?.displayName ?? 'none'}
          hint="Если сессии нет, protected branches должны сразу вести на login."
        />
        <MetricCard
          label="Next refresh mode"
          value={data.nextRefreshMode}
          hint="Этим флагом можно специально сломать следующий refresh и увидеть redirect на login."
          tone="accent"
        />
        <MetricCard
          label="Intent path"
          value={data.intendedPath ?? 'none'}
          hint="Маршрутизатор может хранить путь возврата отдельно от самой auth session."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Session actions
          </p>

          {/* Route action ниже меняет auth store как единый lifecycle.
              Это даёт один понятный канал для login/refresh/logout и audit trail. */}
          <Form method="post" className="grid gap-3 md:grid-cols-2">
            <button
              name="intent"
              value="login-member"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Login member
            </button>
            <button
              name="intent"
              value="login-editor"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Login editor
            </button>
            <button
              name="intent"
              value="login-admin"
              className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Login admin
            </button>
            <button
              name="intent"
              value="expire"
              className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white"
            >
              Просрочить токен
            </button>
            <button
              name="intent"
              value="refresh"
              className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Запустить refresh
            </button>
            <button
              name="intent"
              value="arm-refresh-failure"
              className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Сломать следующий refresh
            </button>
            <button
              name="intent"
              value="logout"
              className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 md:col-span-2"
            >
              Logout
            </button>
          </Form>

          {actionData?.message ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              {actionData.message}
            </div>
          ) : null}
        </Panel>

        <Panel className="space-y-4">
          <ListBlock title="Session policy" items={data.policies} />
          <ListBlock title="Auth audit trail" items={data.auditTrail} />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.session} />
      </Panel>
    </div>
  );
}
