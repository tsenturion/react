import clsx from 'clsx';
import { useState } from 'react';

import { useQueryParamState } from '../../hooks/useQueryParamState';
import { useServerPlaybookQuery } from '../../hooks/useServerPlaybookQuery';
import { filterServerItems } from '../../lib/server-state-model';
import { useArchitecturePreferences } from '../../state/useArchitecturePreferences';
import { MetricCard } from '../ui';

const tracks = ['all', 'ui', 'routing', 'data', 'infra'] as const;

export function IntegratedArchitectureLab() {
  const { density, lens } = useArchitecturePreferences();
  const [track, setTrack] = useQueryParamState<(typeof tracks)[number]>(
    'archTrack',
    'all',
    tracks,
  );
  const { snapshot, refetch } = useServerPlaybookQuery();
  const [selectedId, setSelectedId] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const visibleItems = filterServerItems(snapshot.items, track, '');
  const selectedItem =
    visibleItems.find((item) => item.id === selectedId) ?? visibleItems[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Global"
          value={density}
          hint="Плотность списка приходит из общего preference store."
          tone="cool"
        />
        <MetricCard
          label="URL"
          value={track}
          hint="Track filter живёт в адресной строке и делится ссылкой."
        />
        <MetricCard
          label="Server"
          value={snapshot.status}
          hint="Данные каталога приходят извне и переживают refetch."
          tone="accent"
        />
        <MetricCard
          label="Local"
          value={draftNote.length > 0 ? 'draft' : 'empty'}
          hint="Заметка к выбранной записи остаётся локальной деталью этой панели."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Архитектурная панель
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tracks.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTrack(value)}
                  className={clsx(
                    'rounded-xl px-3 py-2 text-sm font-medium transition',
                    track === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={refetch}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Refetch server data
            </button>

            <button
              type="button"
              onClick={() => setIsDrawerOpen((current) => !current)}
              className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              {isDrawerOpen ? 'Скрыть локальную панель' : 'Открыть локальную панель'}
            </button>
          </div>

          {isDrawerOpen ? (
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">
                Локальная заметка к выбранной записи
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Эта заметка не попадает в URL, не становится global preference и не
                подменяет серверные данные.
              </p>
              <textarea
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                rows={5}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <div className="grid gap-3">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={clsx(
                  'rounded-[24px] border text-left transition',
                  density === 'compact' ? 'p-3' : 'p-5',
                  selectedItem?.id === item.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                )}
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
              </button>
            ))}
          </div>

          <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Почему этот экран устойчив
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Global: `density` и `lens` нужны нескольким далёким веткам.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                URL: `archTrack` должен воспроизводиться по ссылке.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Server: каталог приходит извне и живёт в слое загрузки.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Local: заметка к выбранной записи нужна только этой боковой панели.
              </li>
            </ul>
            <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              Текущий lens: <strong>{lens}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
