import { useState } from 'react';

import {
  audienceOptions,
  buildSubmissionRecord,
  delay,
  readLessonPayload,
} from '../../lib/forms-actions-domain';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import { FormStatusProbe, PendingSubmitButton } from './FormStatusProbe';

export function FormStatusWorkflowLab() {
  const [activity, setActivity] = useState<string[]>([]);

  async function sendLesson(formData: FormData) {
    const payload = readLessonPayload(formData);
    const record = buildSubmissionRecord('review', payload);

    await delay(460);
    setActivity((current) => [record.message, ...current].slice(0, 5));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending source"
          value="form context"
          hint="Pending indicator живёт в самой форме, а не в отдельном parent-level loading flag."
          tone="accent"
        />
        <MetricCard
          label="Activity log"
          value={String(activity.length)}
          hint="Лог появляется после action, но pending snapshot читается ещё до ответа."
          tone="cool"
        />
        <MetricCard
          label="Async structure"
          value="submit → status → result"
          hint="Форма показывает реальный порядок: отправка, pending, результат, а не набор несвязанных обработчиков."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              useFormStatus
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Компоненты внутри формы видят текущую отправку без дополнительного state
              bridge
            </h2>
          </div>
          <StatusPill tone={activity.length > 0 ? 'success' : 'warn'}>
            {activity.length > 0 ? 'status flow visible' : 'submit to inspect status'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <form
            action={sendLesson}
            className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                defaultValue="Form status workflow"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Owner</span>
              <input
                name="owner"
                defaultValue="Docs team"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Cohort</span>
              <input
                name="cohort"
                defaultValue="Forms"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Audience</span>
              <select
                name="audience"
                defaultValue="team"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                {audienceOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Notes</span>
              <textarea
                name="notes"
                defaultValue="useFormStatus читает pending и текущий payload прямо из контекста формы."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="grid gap-3">
              <FormStatusProbe
                idleLabel="Форма готова к submit без дополнительного loading state."
                pendingLabel="Форма уже отправляет текущий payload."
              />

              <PendingSubmitButton
                type="submit"
                pendingLabel="Submitting lesson…"
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send lesson to review
              </PendingSubmitButton>
            </div>
          </form>

          <div className="space-y-4">
            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">
                Что показывает useFormStatus
              </p>
              <p className="text-sm leading-6 text-cyan-950/80">
                Pending indicator и snapshot FormData находятся прямо внутри формы. Для
                этого не нужен effect, bridge через props или отдельный app-level loader.
              </p>
            </Panel>

            <div className="space-y-3">
              {activity.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm leading-6 text-slate-500">
                  После submit здесь появится история завершённых отправок.
                </div>
              ) : (
                activity.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Когда полезен useFormStatus"
        items={[
          'Когда pending indicator должен жить рядом с конкретной кнопкой submit.',
          'Когда нужно показать snapshot текущего payload прямо во время отправки.',
          'Когда хочется сохранить форму декларативной и не поднимать служебный loading state выше, чем это нужно.',
        ]}
      />
    </div>
  );
}
