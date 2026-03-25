import { useDeferredValue, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import { describeDeferredValueScenario } from '../../lib/deferred-value-model';
import { projectSearchResults, type SearchTrack } from '../../lib/search-workload-model';
import { MetricCard, Panel, StatusPill } from '../ui';
import { SearchProjectionPreview } from './SearchProjectionPreview';

export function DeferredValueLab() {
  const shellCommits = useRenderCount();
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<SearchTrack>('all');
  const [intensity, setIntensity] = useState(4);
  const deferredQuery = useDeferredValue(query);

  const diagnosis = describeDeferredValueScenario({
    query,
    deferredQuery,
  });

  const projection = projectSearchResults({
    query: deferredQuery,
    track,
    sort: 'relevance',
    intensity,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="useDeferredValue не откладывает сам input, а только его тяжёлого потребителя ниже."
          tone="accent"
        />
        <MetricCard
          label="Input query"
          value={query || 'empty'}
          hint="Это значение всегда остаётся срочным и обновляется немедленно."
          tone="cool"
        />
        <MetricCard
          label="Deferred query"
          value={deferredQuery || 'empty'}
          hint={diagnosis.detail}
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              useDeferredValue for heavy consumers
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Input остаётся быстрым, а тяжёлый consumer может догонять его чуть позже
            </h2>
          </div>
          <StatusPill tone={diagnosis.isLagging ? 'warn' : 'success'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search query</span>
              <input
                aria-label="Deferred search query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                placeholder="Например: search, analytics, draft"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Track</span>
              <select
                aria-label="Deferred track"
                value={track}
                onChange={(event) => setTrack(event.target.value as SearchTrack)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">All tracks</option>
                <option value="render">Render</option>
                <option value="data">Data</option>
                <option value="routing">Routing</option>
                <option value="forms">Forms</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Work intensity</span>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-600">{intensity}x consumer cost</p>
            </label>
          </div>

          <div className="space-y-4">
            <SearchProjectionPreview
              title="Deferred consumer results"
              summary={projection.summary}
              operations={projection.operations}
              items={projection.visibleItems}
              pendingLabel={
                diagnosis.isLagging ? 'consumer catching up' : 'consumer in sync'
              }
            />
            <Panel className="border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">{diagnosis.headline}</p>
              <p className="mt-2 text-sm leading-6 text-cyan-950/80">
                {diagnosis.detail}
              </p>
            </Panel>
          </div>
        </div>
      </Panel>
    </div>
  );
}
