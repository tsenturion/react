import { useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  audienceOptions,
  buildSubmissionRecord,
  delay,
  readLessonPayload,
  type SubmissionRecord,
} from '../../lib/forms-actions-domain';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import { FormStatusProbe, PendingSubmitButton } from './FormStatusProbe';

function HistoryItem({ item }: { item: SubmissionRecord }) {
  const commits = useRenderCount();

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
        <span className="chip">{item.intent}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
        owner {item.owner} / cohort {item.cohort} / viewer commits {commits}
      </p>
    </div>
  );
}

export function ActionBasicsLab() {
  const [history, setHistory] = useState<SubmissionRecord[]>([]);

  async function createDraft(formData: FormData) {
    const payload = readLessonPayload(formData);

    await delay(380);
    setHistory((current) =>
      [buildSubmissionRecord('draft', payload), ...current].slice(0, 4),
    );
  }

  const lastRecord = history[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Form model"
          value="plain action"
          hint="У submit нет отдельного onSubmit-wrapper: форма напрямую запускает async action."
          tone="accent"
        />
        <MetricCard
          label="Submissions"
          value={String(history.length)}
          hint="История меняется только после завершения action, без промежуточного ручного effect."
          tone="cool"
        />
        <MetricCard
          label="Last draft"
          value={lastRecord ? lastRecord.title : 'ещё нет'}
          hint="Payload берётся из FormData в момент submit, а не копится в нескольких промежуточных состояниях."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Form action basics
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Обычная форма уже может быть async workflow без лишнего onSubmit-кода
            </h2>
          </div>
          <StatusPill tone={history.length > 0 ? 'success' : 'warn'}>
            {history.length > 0 ? 'action flow visible' : 'submit to inspect flow'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <form
            action={createDraft}
            className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                defaultValue="Action-driven lesson draft"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Owner</span>
              <input
                name="owner"
                defaultValue="Curriculum team"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Cohort</span>
              <input
                name="cohort"
                defaultValue="React 19"
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
                defaultValue="Форма показывает, как async submit может жить прямо в action, без отдельной ручной orchestration-логики."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <FormStatusProbe
              idleLabel="До submit форма не хранит отдельный pending state."
              pendingLabel="Форма уже отправляет payload через action."
            />

            <PendingSubmitButton
              type="submit"
              pendingLabel="Saving draft…"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Save draft with form action
            </PendingSubmitButton>
          </form>

          <div className="space-y-4">
            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">
                Что важно в этом сценарии
              </p>
              <p className="text-sm leading-6 text-cyan-950/80">
                Форма уже запускает async update напрямую. Здесь нет `preventDefault`,
                ручного сбора payload или отдельного useEffect, который синхронизирует
                submit result обратно в UI.
              </p>
            </Panel>

            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm leading-6 text-slate-500">
                  После submit здесь появится история черновиков, собранная из FormData
                  этого проекта.
                </div>
              ) : (
                history.map((item) => <HistoryItem key={item.id} item={item} />)
              )}
            </div>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Что даёт plain form action"
        items={[
          'Submit-логика переходит ближе к форме и её реальному payload.',
          'Async flow можно запускать без лишней ручной orchestration-обвязки вокруг state.',
          'Усложнять модель стоит только тогда, когда действительно нужны returned state, field errors или несколько submit outcomes.',
        ]}
      />
    </div>
  );
}
