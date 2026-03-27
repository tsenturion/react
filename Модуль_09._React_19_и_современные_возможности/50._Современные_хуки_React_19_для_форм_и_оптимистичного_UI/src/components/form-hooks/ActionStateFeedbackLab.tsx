import { useState, useActionState } from 'react';

import {
  buildFailureState,
  buildSuccessState,
  buildValidationState,
  initialHookActionState,
} from '../../lib/action-hooks-state-model';
import {
  channelOptions,
  deliveryModeOptions,
  delay,
  readAnnouncementPayload,
  validateAnnouncementPayload,
  type DeliveryMode,
} from '../../lib/modern-form-hooks-domain';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

const latencyOptions = [
  { value: 260, label: 'Fast' },
  { value: 780, label: 'Slow' },
] as const;

export function ActionStateFeedbackLab() {
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('success');
  const [latencyMs, setLatencyMs] = useState<number>(260);
  const [state, formAction, isPending] = useActionState(
    async (previousState: typeof initialHookActionState, formData: FormData) => {
      const payload = readAnnouncementPayload(formData);
      const issues = validateAnnouncementPayload(payload);

      if (issues.length > 0) {
        return buildValidationState(previousState, payload, issues);
      }

      // Возвращаемый action-state становится единственным итогом submit:
      // здесь не нужен дополнительный effect, который потом "догоняет" серверный ответ.
      await delay(latencyMs);

      if (deliveryMode === 'failure') {
        return buildFailureState(previousState, payload);
      }

      return buildSuccessState(previousState, payload);
    },
    initialHookActionState,
  );

  const tone =
    state.status === 'error' ? 'error' : state.status === 'success' ? 'success' : 'warn';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Action status"
          value={state.status}
          hint="Статус приходит из returned state action, а не собирается из раздельных setPending/setError/setSuccess."
          tone="accent"
        />
        <MetricCard
          label="Attempts"
          value={String(state.attempts)}
          hint="Каждая отправка формирует новый снимок submit-result, который можно анализировать отдельно."
          tone="cool"
        />
        <MetricCard
          label="Pending"
          value={isPending ? 'pending' : 'idle'}
          hint="useActionState сразу даёт pending рядом с returned state этой же формы."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Server mode
              </p>
              <div className="mt-3 space-y-2">
                {deliveryModeOptions.map((item) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <input
                      type="radio"
                      name="delivery-mode"
                      checked={deliveryMode === item.value}
                      onChange={() => {
                        setDeliveryMode(item.value);
                      }}
                    />
                    <span className="text-sm leading-6 text-slate-700">
                      <strong className="block text-slate-900">{item.label}</strong>
                      {item.hint}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Latency
              </span>
              <select
                value={latencyMs}
                onChange={(event) => {
                  setLatencyMs(Number(event.target.value));
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                {latencyOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            <form
              action={formAction}
              className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Title</span>
                <input
                  name="title"
                  defaultValue="Async hooks rollout"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Summary</span>
                <textarea
                  name="summary"
                  rows={4}
                  defaultValue="Форма должна локально показать pending, итоговый result и ошибку без внешнего orchestration-кода."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Channel</span>
                <select
                  name="channel"
                  defaultValue="beta"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                >
                  {channelOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Note</span>
                <textarea
                  name="note"
                  rows={3}
                  defaultValue="Pending и result принадлежат самой форме, а не отдельному loading-store."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
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
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Returned state
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Последний title: {state.lastSubmittedTitle}
                  </p>
                </div>
                <StatusPill tone={tone}>{state.status}</StatusPill>
              </div>

              <Panel
                className={
                  state.status === 'error'
                    ? 'space-y-4 border-rose-200 bg-rose-50'
                    : state.status === 'success'
                      ? 'space-y-4 border-emerald-200 bg-emerald-50'
                      : 'space-y-4'
                }
              >
                <p className="text-sm leading-6 text-slate-700">{state.message}</p>
                {state.issues.length > 0 ? (
                  <ul className="space-y-2 text-sm leading-6 text-rose-950">
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
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700">
                    <p className="font-semibold text-slate-900">
                      {state.receipt.headline}
                    </p>
                    <p className="mt-2">{state.receipt.detail}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {state.receipt.ticket}
                    </p>
                  </div>
                ) : null}
              </Panel>
            </div>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Типичные ошибки"
        items={[
          'Дублировать pending и result во внешнем state рядом с useActionState, хотя hook уже отдаёт итог submit.',
          'Пытаться через useActionState решать fire-and-forget действие, у которого вообще нет returned UI state.',
          'Оставлять старый success message после новой ошибки. Returned state должен быть целостным снимком результата формы.',
        ]}
      />
    </div>
  );
}
