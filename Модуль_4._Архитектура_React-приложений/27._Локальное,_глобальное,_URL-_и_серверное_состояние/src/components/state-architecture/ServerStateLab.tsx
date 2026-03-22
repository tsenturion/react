import { useState } from 'react';

import { useServerPlaybookQuery } from '../../hooks/useServerPlaybookQuery';
import { filterServerItems, summarizeServerSnapshot } from '../../lib/server-state-model';
import { MetricCard, StatusPill } from '../ui';

export function ServerStateLab() {
  const { snapshot, refetch } = useServerPlaybookQuery();
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [localNote, setLocalNote] = useState('');
  const filteredItems = filterServerItems(snapshot.items, selectedTrack, '');
  const summary = summarizeServerSnapshot(snapshot);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Источник истины"
          value="Сервер"
          hint="Данные приходят извне и живут отдельно от локальных UI-переключателей."
          tone="cool"
        />
        <MetricCard
          label="Refetch"
          value={String(snapshot.requestCount)}
          hint="Server state несёт с собой loading, error, cache и обновления."
        />
        <MetricCard
          label="Локальная заметка"
          value={localNote.length > 0 ? 'Есть' : 'Пусто'}
          hint="Черновик заметки не превращает серверные данные в local state."
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{summary.headline}</p>
              <StatusPill tone={summary.tone}>{summary.tone}</StatusPill>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{summary.detail}</p>

            <button
              type="button"
              onClick={refetch}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Повторно запросить данные
            </button>

            <div className="mt-4">
              <span className="text-sm font-medium text-slate-700">
                Клиентский track filter
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {['all', 'ui', 'routing', 'data', 'infra'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedTrack(value)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                      selectedTrack === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Локальная заметка к данным
              </span>
              <textarea
                value={localNote}
                onChange={(event) => setLocalNote(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {item.track} • {item.owner}
                  </p>
                </div>
                <span className="chip">{item.syncCost}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
