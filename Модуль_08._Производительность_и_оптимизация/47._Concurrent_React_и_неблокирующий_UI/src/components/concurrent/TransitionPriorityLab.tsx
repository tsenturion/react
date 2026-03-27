import { useState, useTransition } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import { projectSearchResults, type SearchTrack } from '../../lib/search-workload-model';
import {
  describeTransitionPriority,
  type TransitionAction,
  type TransitionMode,
} from '../../lib/transition-priority-model';
import { MetricCard, Panel, StatusPill } from '../ui';
import { SearchProjectionPreview } from './SearchProjectionPreview';

export function TransitionPriorityLab() {
  const shellCommits = useRenderCount();
  const [draftQuery, setDraftQuery] = useState('');
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<SearchTrack>('all');
  const [intensity, setIntensity] = useState(3);
  const [mode, setMode] = useState<TransitionMode>('transition');
  const [lastAction, setLastAction] = useState<TransitionAction>('typing');
  const [isPending, startTransition] = useTransition();

  const projection = projectSearchResults({
    query,
    track,
    sort: 'relevance',
    intensity,
  });

  const diagnosis = describeTransitionPriority({
    mode,
    action: lastAction,
    isPending,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Parent shell ререндерится в любом случае. Важен приоритет тяжёлого subtree, который живёт ниже."
          tone="accent"
        />
        <MetricCard
          label="Urgent state"
          value={draftQuery || 'empty input'}
          hint={diagnosis.urgentChannel}
          tone="cool"
        />
        <MetricCard
          label="Background state"
          value={query || 'empty query'}
          hint={diagnosis.backgroundChannel}
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              useTransition priority split
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Срочный ввод и тяжёлый список можно отделить по приоритету
            </h2>
          </div>
          <StatusPill tone={mode === 'transition' ? 'success' : 'warn'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Update mode</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'transition', label: 'useTransition' },
                  { value: 'direct', label: 'Direct update' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMode(item.value as TransitionMode)}
                    className={mode === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search query</span>
              <input
                aria-label="Search query"
                value={draftQuery}
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setDraftQuery(nextQuery);
                  setLastAction('typing');

                  // Срочный feedback остаётся в input немедленно, а дорогое обновление списка
                  // мы переводим в transition только в соответствующем режиме лаборатории.
                  if (mode === 'transition') {
                    startTransition(() => setQuery(nextQuery));
                    return;
                  }

                  setQuery(nextQuery);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                placeholder="Например: search, router, draft"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Track</span>
              <select
                aria-label="Priority track"
                value={track}
                onChange={(event) => {
                  const nextTrack = event.target.value as SearchTrack;
                  setLastAction('track-change');

                  if (mode === 'transition') {
                    startTransition(() => setTrack(nextTrack));
                    return;
                  }

                  setTrack(nextTrack);
                }}
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
              <p className="text-sm text-slate-600">{intensity}x synthetic list cost</p>
            </label>
          </div>

          <div className="space-y-4">
            <SearchProjectionPreview
              title="Priority-split results"
              summary={projection.summary}
              operations={projection.operations}
              items={projection.visibleItems}
              pendingLabel={isPending ? 'transition pending' : 'stable'}
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
