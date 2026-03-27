import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';

import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import type { ActionsActionData, ActionsLoaderData } from '../lib/data-router-runtime';

export function ActionsPage() {
  const data = useLoaderData() as ActionsLoaderData;
  const actionData = useActionData() as ActionsActionData | undefined;
  const navigation = useNavigation();
  const pendingFormData = navigation.formData;
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Route Actions"
        title="Action связывает submit flow, validation и route revalidation"
        copy="Здесь форма отправляет данные в action маршрута. После успешной мутации loader этого же маршрута автоматически отдаёт обновлённую очередь заявок."
        aside={
          <StatusPill tone={isSubmitting ? 'warn' : 'success'}>
            {isSubmitting ? 'submitting' : 'idle'}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Requests in loader"
          value={String(data.requests.length)}
          hint="Количество заявок приходит из route loader после revalidation."
        />
        <MetricCard
          label="Action state"
          value={navigation.state}
          hint="Router сам различает idle, loading и submitting lifecycle."
          tone="accent"
        />
        <MetricCard
          label="Last loader snapshot"
          value={data.loadedAt}
          hint="После action этот loader переотдаёт уже актуальный список."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Form {'->'} action
          </p>
          {/* Route Form здесь напрямую связан с action маршрута.
              После submit router сам запускает action и затем revalidate текущий loader. */}
          <Form method="post" className="space-y-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Тема</span>
              <select
                name="topicId"
                defaultValue={actionData?.values?.topicId || data.topics[0]?.id}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                {data.topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </select>
              {actionData?.fieldErrors?.topicId ? (
                <p className="text-sm text-rose-700">{actionData.fieldErrors.topicId}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Owner</span>
              <input
                type="text"
                name="owner"
                defaultValue={actionData?.values?.owner ?? ''}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              />
              {actionData?.fieldErrors?.owner ? (
                <p className="text-sm text-rose-700">{actionData.fieldErrors.owner}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Note</span>
              <textarea
                name="note"
                defaultValue={actionData?.values?.note ?? ''}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400"
              />
              {actionData?.fieldErrors?.note ? (
                <p className="text-sm text-rose-700">{actionData.fieldErrors.note}</p>
              ) : null}
            </label>

            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Отправить через action
            </button>
          </Form>

          {actionData?.message ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              {actionData.message}
            </div>
          ) : null}
        </Panel>

        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Route-owned request queue
          </p>
          {pendingFormData ? (
            <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <strong>Pending submit:</strong>{' '}
              {String(pendingFormData.get('owner') ?? '...')} /{' '}
              {String(pendingFormData.get('topicId') ?? '...')}
            </div>
          ) : null}
          <div className="space-y-3">
            {data.requests.map((request) => (
              <article
                key={request.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {request.owner}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {request.note}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {request.status}
                  </span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {request.topicId} / {request.createdAt}
                </p>
              </article>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.actions} />
      </Panel>
    </div>
  );
}
