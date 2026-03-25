import { useActionState, useOptimistic, useState } from 'react';

import {
  buildFailureState,
  buildSuccessState,
  buildValidationState,
  initialHookActionState,
} from '../../lib/action-hooks-state-model';
import {
  buildFeedEntry,
  channelOptions,
  delay,
  initialFeedEntries,
  readAnnouncementPayload,
  validateAnnouncementPayload,
  type DeliveryMode,
  type FeedEntry,
} from '../../lib/modern-form-hooks-domain';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import { FormStatusProbe, PendingSubmitButton } from './FormStatusProbe';

export function UnifiedFeedbackFlowLab() {
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('success');
  const [entries, setEntries] = useState<FeedEntry[]>(() => [...initialFeedEntries]);
  const [optimisticEntries, addOptimisticEntry] = useOptimistic(
    entries,
    (currentEntries, optimisticEntry: FeedEntry) => [optimisticEntry, ...currentEntries],
  );
  const [state, formAction, isPending] = useActionState(
    async (previousState: typeof initialHookActionState, formData: FormData) => {
      const payload = readAnnouncementPayload(formData);
      const issues = validateAnnouncementPayload(payload);

      if (issues.length > 0) {
        return buildValidationState(previousState, payload, issues);
      }

      addOptimisticEntry(buildFeedEntry(payload, 'sending'));
      await delay(560);

      if (deliveryMode === 'failure') {
        setEntries((current) => [...current]);
        return buildFailureState(previousState, payload);
      }

      setEntries((current) =>
        [buildFeedEntry(payload, 'confirmed'), ...current].slice(0, 6),
      );
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
          label="Combined hooks"
          value="3 APIs"
          hint="Один submit использует returned state, nearest form status и optimistic overlay одновременно."
          tone="accent"
        />
        <MetricCard
          label="Pending"
          value={isPending ? 'pending' : 'idle'}
          hint="Pending приходит из submit-потока формы, а не из внешнего orchestrator-компонента."
          tone="cool"
        />
        <MetricCard
          label="Sending cards"
          value={String(
            optimisticEntries.filter((item) => item.state === 'sending').length,
          )}
          hint="sending-card существует только локально до ответа сервера."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <form
            action={formAction}
            className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Server behaviour
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMode('success');
                  }}
                  className={deliveryMode === 'success' ? 'chip chip-active' : 'chip'}
                >
                  confirm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMode('failure');
                  }}
                  className={deliveryMode === 'failure' ? 'chip chip-active' : 'chip'}
                >
                  reject
                </button>
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                defaultValue="Unified async flow"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Summary</span>
              <textarea
                name="summary"
                rows={4}
                defaultValue="Форма сразу создаёт optimistic card, pending читает nearest status, а итог success/error приходит из useActionState."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Channel</span>
              <select
                name="channel"
                defaultValue="public"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
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
                defaultValue="Эта форма нужна, когда пользователю важны и мгновенный отклик, и явный server result."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="space-y-3">
              <FormStatusProbe
                idleLabel="Форма ждёт отправки"
                pendingLabel="Сейчас отправляется title"
              />
              <PendingSubmitButton
                type="submit"
                pendingLabel="Submitting full workflow…"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Run full workflow
              </PendingSubmitButton>
            </div>
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Workflow result
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{state.message}</p>
              </div>
              <StatusPill tone={tone}>{state.status}</StatusPill>
            </div>

            {state.receipt ? (
              <Panel className="space-y-3 border-emerald-200 bg-emerald-50">
                <p className="text-sm font-semibold text-slate-900">
                  {state.receipt.headline}
                </p>
                <p className="text-sm leading-6 text-slate-700">{state.receipt.detail}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {state.receipt.ticket}
                </p>
              </Panel>
            ) : null}

            {state.issues.length > 0 ? (
              <Panel className="space-y-2 border-rose-200 bg-rose-50">
                {state.issues.map((item) => (
                  <p key={item} className="text-sm leading-6 text-rose-900">
                    {item}
                  </p>
                ))}
              </Panel>
            ) : null}

            <Panel className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Visible feed</p>
                <StatusPill
                  tone={
                    optimisticEntries.some((item) => item.state === 'sending')
                      ? 'warn'
                      : 'success'
                  }
                >
                  {optimisticEntries.some((item) => item.state === 'sending')
                    ? 'optimistic'
                    : 'confirmed'}
                </StatusPill>
              </div>
              <ul className="space-y-3">
                {optimisticEntries.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <StatusPill tone={item.state === 'sending' ? 'warn' : 'success'}>
                        {item.state}
                      </StatusPill>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.summary}
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Когда связка hooks оправдана"
        items={[
          'Нужно одновременно показать мгновенный отклик, pending у кнопки и итог success/error после ответа сервера.',
          'Откат optimistic overlay должен быть явно виден и не должен смешиваться с подтверждённым базовым состоянием.',
          'Форма важна как самостоятельный async workflow, а не как случайный click-handler с несколькими побочными state update.',
        ]}
      />
    </div>
  );
}
