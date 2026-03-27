import { useState } from 'react';

import {
  buildDashboardSummary,
  getVisibleCatalogItems,
  type DashboardState,
} from '../../lib/shared-dashboard-model';
import { createCatalogItems } from '../../lib/shared-state-domain';

export function SharedFilterDashboard() {
  const items = createCatalogItems();
  const [filterState, setFilterState] = useState<DashboardState>({
    query: '',
    track: 'all',
  });

  const visibleItems = getVisibleCatalogItems(items, filterState);
  const summary = buildDashboardSummary(items, filterState);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          shared state
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
          Один filter state одновременно меняет toolbar, grid и summary
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">
          <input
            value={filterState.query}
            onChange={(event) =>
              setFilterState((current) => ({
                ...current,
                query: event.target.value,
              }))
            }
            placeholder="Поиск"
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          />
          {(['all', 'state', 'architecture', 'forms'] as const).map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => setFilterState((current) => ({ ...current, track }))}
              className={filterState.track === track ? 'chip chip-active' : 'chip'}
            >
              {track}
            </button>
          ))}
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              summary
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {summary.visibleCount}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              минут: {summary.totalDuration}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm text-sm leading-6 text-slate-600">
            {summary.summary}
          </div>
        </div>

        <div className="grid gap-3">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-900">{item.title}</span>
                <span className="text-sm text-slate-600">{item.duration} мин</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                {item.track}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
