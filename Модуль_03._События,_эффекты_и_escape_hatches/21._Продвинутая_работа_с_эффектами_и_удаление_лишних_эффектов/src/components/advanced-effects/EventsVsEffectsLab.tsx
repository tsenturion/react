import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { EventSeparationMode } from '../../lib/event-effect-model';
import { Panel, StatusPill } from '../ui';

const modes: readonly { id: EventSeparationMode; label: string; note: string }[] = [
  {
    id: 'effect-driven',
    label: 'effect-driven',
    note: 'публикация начинается не в момент клика, а из состояния',
  },
  {
    id: 'event-driven',
    label: 'event-driven',
    note: 'действие выполняется прямо в обработчике события',
  },
];

export function EventsVsEffectsLab() {
  const [mode, setMode] = useState<EventSeparationMode>('effect-driven');
  const [title, setTitle] = useState('Advanced Effects Digest');
  const [audience, setAudience] = useState('team');
  const [publishIntentId, setPublishIntentId] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (mode !== 'effect-driven' || publishIntentId === 0) {
      return;
    }

    const snapshot = `${title} -> ${audience}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPublishedCount((current) => current + 1);
    setLogs((current) =>
      [`effect publish #${publishIntentId} -> ${snapshot}`, ...current].slice(0, 8),
    );
  }, [audience, mode, publishIntentId, title]);

  function handlePublish() {
    if (mode === 'effect-driven') {
      setPublishIntentId((current) => current + 1);
      return;
    }

    const snapshot = `${title} -> ${audience}`;
    setPublishedCount((current) => current + 1);
    setLogs((current) => [`event publish -> ${snapshot}`, ...current].slice(0, 8));
  }

  function resetCycle() {
    setPublishIntentId(0);
    setPublishedCount(0);
    setLogs([]);
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              mode === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Заголовок</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Аудитория</span>
              <select
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
              >
                <option value="team">team</option>
                <option value="newsletter">newsletter</option>
                <option value="public">public</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePublish}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Опубликовать
            </button>
            <button
              type="button"
              onClick={resetCycle}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Сбросить цикл
            </button>
            <StatusPill tone={mode === 'event-driven' ? 'success' : 'error'}>
              {mode}
            </StatusPill>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Сколько публикаций ушло
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {publishedCount}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              В effect-driven режиме правка `title` или `audience` после клика снова
              удовлетворяет условиям effect-а и может отправить действие повторно.
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Журнал действий
          </p>
          <div className="mt-4 space-y-2">
            {logs.map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
