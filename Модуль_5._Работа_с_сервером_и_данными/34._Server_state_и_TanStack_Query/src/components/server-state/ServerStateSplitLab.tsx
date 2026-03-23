import clsx from 'clsx';
import { useState } from 'react';

import { useCatalogQuery } from '../../hooks/useCatalogQueries';
import type { LessonTrack } from '../../lib/server-state-domain';
import { LessonCatalogView } from './LessonCatalogView';

const trackFilters: readonly ('all' | LessonTrack)[] = [
  'all',
  'foundations',
  'state',
  'effects',
];

export function ServerStateSplitLab() {
  const [trackFilter, setTrackFilter] = useState<'all' | LessonTrack>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const catalogQuery = useCatalogQuery('catalog', 'all', 15_000);

  const visibleItems =
    trackFilter === 'all'
      ? (catalogQuery.data?.items ?? [])
      : (catalogQuery.data?.items ?? []).filter((item) => item.track === trackFilter);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">
            {trackFilters.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTrackFilter(value)}
                className={clsx(
                  'rounded-xl px-4 py-2 text-sm font-medium transition',
                  trackFilter === value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void catalogQuery.refetch()}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Refetch server data
            </button>
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Сбросить client state
            </button>
          </div>
        </div>

        {catalogQuery.isPending ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
            Query загружает server-owned data.
          </div>
        ) : null}

        {catalogQuery.isError ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
            {catalogQuery.error instanceof Error
              ? catalogQuery.error.message
              : 'Не удалось загрузить server state.'}
          </div>
        ) : null}

        {catalogQuery.data ? (
          <LessonCatalogView
            items={visibleItems}
            activeId={activeId}
            onSelect={(id) => setActiveId((current) => (current === id ? null : id))}
          />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Client state
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Track filter: <strong>{trackFilter}</strong>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Active card: <strong>{activeId ?? 'none'}</strong>
            </li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Server state
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Query status: <strong>{catalogQuery.status}</strong>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Request no: <strong>{catalogQuery.data?.meta.requestNo ?? '—'}</strong>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Server version:{' '}
              <strong>{catalogQuery.data?.meta.serverVersion ?? '—'}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
