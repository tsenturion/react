import { useOptimistic, useState } from 'react';

import {
  buildFeedEntry,
  channelOptions,
  delay,
  deliveryModeOptions,
  initialFeedEntries,
  readAnnouncementPayload,
  validateAnnouncementPayload,
  type DeliveryMode,
  type FeedEntry,
} from '../../lib/modern-form-hooks-domain';
import { MetricCard, Panel, StatusPill } from '../ui';
import { PendingSubmitButton } from './FormStatusProbe';

type Notice = {
  tone: 'success' | 'error';
  text: string;
};

export function OptimisticQueueLab() {
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('success');
  const [entries, setEntries] = useState<FeedEntry[]>(() => [...initialFeedEntries]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [optimisticEntries, addOptimisticEntry] = useOptimistic(
    entries,
    (currentEntries, optimisticEntry: FeedEntry) => [optimisticEntry, ...currentEntries],
  );

  async function queueOptimisticUpdate(formData: FormData) {
    const payload = readAnnouncementPayload(formData);
    const issues = validateAnnouncementPayload(payload);

    if (issues.length > 0) {
      setNotice({ tone: 'error', text: issues[0] });
      return;
    }

    addOptimisticEntry(buildFeedEntry(payload, 'sending'));
    await delay(680);

    if (deliveryMode === 'failure') {
      // При отказе сервера переизлучаем подтверждённую базовую версию данных,
      // чтобы optimistic overlay исчез и UI снова совпал с server truth.
      setEntries((current) => [...current]);
      setNotice({
        tone: 'error',
        text: `Сервер отклонил "${payload.title}". Оптимистичная карточка была локальной и поэтому откатилась.`,
      });
      return;
    }

    setEntries((current) =>
      [buildFeedEntry(payload, 'confirmed'), ...current].slice(0, 6),
    );
    setNotice({
      tone: 'success',
      text: `Сервер подтвердил "${payload.title}". Теперь запись стала частью базового состояния.`,
    });
  }

  const optimisticCount = optimisticEntries.filter(
    (item) => item.state === 'sending',
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Transport mode"
          value={deliveryMode}
          hint="Переключайте подтверждение и отказ сервера, чтобы увидеть цену мгновенного UI."
          tone="accent"
        />
        <MetricCard
          label="Optimistic cards"
          value={String(optimisticCount)}
          hint="sending-card существует только локально, пока сервер не подтвердил действие."
          tone="cool"
        />
        <MetricCard
          label="Confirmed cards"
          value={String(entries.length)}
          hint="Базовое состояние отражает только подтверждённые сервером записи."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <form
            action={queueOptimisticUpdate}
            className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Server behaviour
              </span>
              {deliveryModeOptions.map((item) => (
                <label
                  key={item.value}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <input
                    type="radio"
                    name="optimistic-delivery"
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

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                defaultValue="Optimistic release note"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Summary</span>
              <textarea
                name="summary"
                rows={4}
                defaultValue="UI показывает новую карточку ещё до ответа сервера, но явно помечает её как sending."
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
                defaultValue="При public release optimistic feedback особенно заметен, потому что пользователь ждёт мгновенного отклика."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <PendingSubmitButton
              type="submit"
              pendingLabel="Adding optimistic card…"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Add optimistic update
            </PendingSubmitButton>
          </form>

          <div className="space-y-4">
            <Panel className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Rendered feed</p>
                <StatusPill tone={notice?.tone === 'error' ? 'error' : 'success'}>
                  {optimisticCount > 0 ? 'overlay active' : 'server truth'}
                </StatusPill>
              </div>
              {notice ? (
                <div
                  className={
                    notice.tone === 'error'
                      ? 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900'
                      : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900'
                  }
                >
                  {notice.text}
                </div>
              ) : null}

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
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {item.channelLabel}
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </Panel>
    </div>
  );
}
