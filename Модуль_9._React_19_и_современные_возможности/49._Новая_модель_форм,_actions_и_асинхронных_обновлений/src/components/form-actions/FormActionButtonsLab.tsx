import { useState } from 'react';

import {
  audienceOptions,
  buildSubmissionRecord,
  delay,
  describeIntentOutcome,
  readLessonPayload,
  type SubmissionIntent,
  type SubmissionRecord,
} from '../../lib/forms-actions-domain';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

function IntentRecord({ item }: { item: SubmissionRecord }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
        <span className="chip">{item.intent}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
        owner {item.owner} / audience {item.audience}
      </p>
    </div>
  );
}

export function FormActionButtonsLab() {
  const [history, setHistory] = useState<SubmissionRecord[]>([]);
  const [lastIntent, setLastIntent] = useState<SubmissionIntent>('draft');

  async function runIntent(intent: SubmissionIntent, formData: FormData) {
    const payload = readLessonPayload(formData);
    const outcome = describeIntentOutcome(intent, payload);

    setLastIntent(intent);
    await delay(outcome.delayMs);
    setHistory((current) =>
      [buildSubmissionRecord(intent, payload), ...current].slice(0, 5),
    );
  }

  async function publishAction(formData: FormData) {
    await runIntent('publish', formData);
  }

  async function saveDraftAction(formData: FormData) {
    await runIntent('draft', formData);
  }

  async function sendToReviewAction(formData: FormData) {
    await runIntent('review', formData);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Default form action"
          value="publish"
          hint="У формы есть основной submit-path, но отдельные кнопки могут переопределять его своим formAction."
          tone="accent"
        />
        <MetricCard
          label="Last intent"
          value={lastIntent}
          hint="Один и тот же payload может уходить в разные async outcomes без switch-case внутри общего handler."
          tone="cool"
        />
        <MetricCard
          label="History"
          value={String(history.length)}
          hint="История показывает, как разная intent-кнопка меняет смысл submit при одинаковом наборе полей."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              formAction buttons
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Разные submit outcomes выражаются отдельными action-кнопками
            </h2>
          </div>
          <StatusPill tone="success">button-specific actions</StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <form
            action={publishAction}
            className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                defaultValue="Action branching in forms"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Owner</span>
              <input
                name="owner"
                defaultValue="Platform guild"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Cohort</span>
              <input
                name="cohort"
                defaultValue="React 19 deep dive"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Audience</span>
              <select
                name="audience"
                defaultValue="public"
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
                defaultValue="Эта форма показывает, как draft, review и publish расходятся прямо в структуре кнопок."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="grid gap-2 md:grid-cols-3">
              <button
                type="submit"
                formAction={saveDraftAction}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Save draft
              </button>
              <button
                type="submit"
                formAction={sendToReviewAction}
                className="rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900"
              >
                Send to review
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Publish
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">
                Почему formAction здесь важен
              </p>
              <p className="text-sm leading-6 text-cyan-950/80">
                В старой модели одна форма часто превращалась в общий onSubmit с
                ветвлением по типу кнопки. Здесь каждая intent-кнопка несёт свой async
                смысл напрямую.
              </p>
            </Panel>

            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm leading-6 text-slate-500">
                  После отправки история покажет, как один и тот же payload прошёл через
                  разные intents.
                </div>
              ) : (
                history.map((item) => <IntentRecord key={item.id} item={item} />)
              )}
            </div>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Когда полезен formAction"
        items={[
          'Когда одна форма поддерживает несколько реальных submit outcomes.',
          'Когда intent должен читаться из самой структуры кнопок, а не из условного кода внутри одного handler.',
          'Когда publish, draft и review имеют разную асинхронную семантику и задержку.',
        ]}
      />
    </div>
  );
}
