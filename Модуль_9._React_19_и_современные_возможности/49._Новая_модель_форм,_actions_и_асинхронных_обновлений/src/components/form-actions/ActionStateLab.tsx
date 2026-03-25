import { useActionState } from 'react';

import {
  buildErrorActionState,
  buildSuccessActionState,
  initialFormActionState,
  validateLessonPayload,
} from '../../lib/action-state-model';
import {
  audienceOptions,
  delay,
  readLessonPayload,
} from '../../lib/forms-actions-domain';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function ActionStateLab() {
  const [state, formAction, isPending] = useActionState(
    async (previousState: typeof initialFormActionState, formData: FormData) => {
      const payload = readLessonPayload(formData);
      const issues = validateLessonPayload(payload);

      if (issues.length > 0) {
        return buildErrorActionState(previousState, issues);
      }

      await delay(520);
      return buildSuccessActionState(previousState, payload);
    },
    initialFormActionState,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Action status"
          value={state.status}
          hint="Status возвращается из action напрямую, а не собирается из нескольких setState вызовов вокруг submit."
          tone="accent"
        />
        <MetricCard
          label="Attempts"
          value={String(state.attempts)}
          hint="Каждый submit обновляет state целиком, сохраняя явную историю результата."
          tone="cool"
        />
        <MetricCard
          label="Pending"
          value={isPending ? 'pending' : 'idle'}
          hint="useActionState сразу даёт pending рядом с result state той же формы."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              useActionState
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Validation и результат submit возвращаются как новое состояние action
            </h2>
          </div>
          <StatusPill
            tone={
              state.status === 'error'
                ? 'error'
                : state.status === 'success'
                  ? 'success'
                  : 'warn'
            }
          >
            {state.status}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <form
            action={formAction}
            className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                defaultValue="React 19 forms"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Owner</span>
              <input
                name="owner"
                defaultValue="DX"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Cohort</span>
              <input
                name="cohort"
                defaultValue="19"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Audience</span>
              <select
                name="audience"
                defaultValue="cross-functional"
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
                defaultValue="Валидация и итог submit должны идти как единый returned state из action."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isPending ? 'Running action…' : 'Submit with useActionState'}
            </button>
          </form>

          <div className="space-y-4">
            <Panel
              className={
                state.status === 'error'
                  ? 'space-y-3 border-rose-200 bg-rose-50'
                  : state.status === 'success'
                    ? 'space-y-3 border-emerald-200 bg-emerald-50'
                    : 'space-y-3'
              }
            >
              <p className="text-sm font-semibold text-slate-900">
                Returned action state
              </p>
              <p className="text-sm leading-6 text-slate-700">{state.message}</p>
              {state.issues.length > 0 ? (
                <ul className="space-y-2 text-sm leading-6 text-rose-900">
                  {state.issues.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-rose-200 bg-white px-3 py-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              {state.receipt ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                  <p className="font-semibold text-slate-900">{state.receipt.title}</p>
                  <p className="mt-2">{state.receipt.message}</p>
                </div>
              ) : null}
            </Panel>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Когда нужен useActionState"
        items={[
          'Когда submit должен вернуть structured result, а не просто запустить fire-and-forget действие.',
          'Когда ошибки формы логически принадлежат самому action, а не отдельному сеттеру рядом.',
          'Когда pending, success и validation нужно хранить как одно целое около формы.',
        ]}
      />
    </div>
  );
}
