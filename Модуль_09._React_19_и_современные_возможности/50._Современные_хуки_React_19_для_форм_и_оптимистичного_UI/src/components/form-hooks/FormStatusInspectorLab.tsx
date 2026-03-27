import { useState } from 'react';

import {
  buildReceipt,
  channelOptions,
  delay,
  readAnnouncementPayload,
} from '../../lib/modern-form-hooks-domain';
import { ListBlock, MetricCard, Panel } from '../ui';
import { FormStatusProbe, PendingSubmitButton } from './FormStatusProbe';

const latencyOptions = [
  { value: 320, label: 'Short pending' },
  { value: 960, label: 'Long pending' },
] as const;

export function FormStatusInspectorLab() {
  const [latencyMs, setLatencyMs] = useState(320);
  const [activityLog, setActivityLog] = useState<string[]>([]);

  async function submitAnnouncement(formData: FormData) {
    const payload = readAnnouncementPayload(formData);
    const receipt = buildReceipt(payload);

    await delay(latencyMs);
    setActivityLog((current) =>
      [`${receipt.headline} (${receipt.ticket})`, ...current].slice(0, 4),
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Nearest form"
          value="context live"
          hint="useFormStatus читает состояние ближайшей формы, а не глобальный loading-store."
          tone="accent"
        />
        <MetricCard
          label="Latency"
          value={`${latencyMs} ms`}
          hint="Изменяйте длину pending и смотрите, как дочерние элементы формы получают тот же status snapshot."
          tone="cool"
        />
        <MetricCard
          label="Log entries"
          value={String(activityLog.length)}
          hint="После submit confirmed запись попадает в activity log, но pending UI живёт прямо внутри формы."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <form
            action={submitAnnouncement}
            className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Latency profile</span>
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

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                defaultValue="Status context demo"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Summary</span>
              <textarea
                name="summary"
                rows={4}
                defaultValue="Вложенные элементы формы должны видеть pending и текущий payload без ручных loading-props."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Channel</span>
              <select
                name="channel"
                defaultValue="team"
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
                defaultValue="Кнопка и статус-панель читают один и тот же snapshot ближайшей формы."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="space-y-3">
              <FormStatusProbe
                idleLabel="Форма простаивает"
                pendingLabel="Форма сейчас отправляет title"
              />
              <PendingSubmitButton
                type="submit"
                pendingLabel="Sending from nearest form…"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Submit with useFormStatus
              </PendingSubmitButton>
            </div>
          </form>

          <div className="space-y-4">
            <FormStatusProbe
              idleLabel="Канал пока не отправляется"
              pendingLabel="Сейчас отправляется channel"
              fieldName="channel"
            />
            <FormStatusProbe
              idleLabel="Заметка простаивает"
              pendingLabel="Сейчас отправляется note"
              fieldName="note"
              emptyValue="пустая заметка"
            />

            <Panel className="space-y-3">
              <p className="text-sm font-semibold text-slate-900">Activity log</p>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {activityLog.length === 0 ? (
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    После отправки здесь появится подтверждённый сервером результат.
                  </li>
                ) : (
                  activityLog.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {item}
                    </li>
                  ))
                )}
              </ul>
            </Panel>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Где useFormStatus особенно полезен"
        items={[
          'Когда loading-состояние нужно показывать в кнопке, сайдбаре или вспомогательном блоке внутри формы.',
          'Когда важно читать snapshot именно текущего submit, а не сохранять копию введённых полей в отдельном state.',
          'Когда хочется избежать props drilling ради простого pending индикатора для дочернего элемента формы.',
        ]}
      />
    </div>
  );
}
