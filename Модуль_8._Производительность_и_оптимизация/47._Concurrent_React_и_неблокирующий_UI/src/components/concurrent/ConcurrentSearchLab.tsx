import { useDeferredValue, useState, useTransition } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  projectSearchResults,
  type SearchSort,
  type SearchTrack,
} from '../../lib/search-workload-model';
import { MetricCard, Panel, StatusPill } from '../ui';
import { SearchProjectionPreview } from './SearchProjectionPreview';

export function ConcurrentSearchLab() {
  const shellCommits = useRenderCount();
  const [draftQuery, setDraftQuery] = useState('');
  const [track, setTrack] = useState<SearchTrack>('all');
  const [sort, setSort] = useState<SearchSort>('relevance');
  const [shellNote, setShellNote] = useState(
    'Этот сценарий объединяет срочный input, deferred query и transition для тяжёлых filter controls.',
  );
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(draftQuery);

  const projection = projectSearchResults({
    query: deferredQuery,
    track,
    sort,
    intensity: 5,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Shell note и input остаются срочными, even when list projection below is heavy."
          tone="accent"
        />
        <MetricCard
          label="Urgent query"
          value={draftQuery || 'empty'}
          hint="Символы в поле ввода не ждут тяжёлый projection списка."
          tone="cool"
        />
        <MetricCard
          label="Search status"
          value={
            isPending
              ? 'transition pending'
              : draftQuery !== deferredQuery
                ? 'deferred sync'
                : 'stable'
          }
          hint="Это combined сценарий, где concurrent APIs работают вместе, а не изолированно."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Integrated concurrent search
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Реальный search UI обычно комбинирует несколько уровней приоритета сразу
            </h2>
          </div>
          <StatusPill
            tone={isPending || draftQuery !== deferredQuery ? 'warn' : 'success'}
          >
            {isPending
              ? 'filters in transition'
              : draftQuery !== deferredQuery
                ? 'results catching up'
                : 'fully aligned'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search input</span>
              <input
                aria-label="Integrated search input"
                value={draftQuery}
                onChange={(event) => setDraftQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                placeholder="Например: search, draft, router"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Shell note</span>
              <textarea
                aria-label="Concurrent shell note"
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Track</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'render', 'data', 'routing', 'forms'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => startTransition(() => setTrack(item as SearchTrack))}
                    className={track === item ? 'chip chip-active' : 'chip'}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Sort</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'relevance', label: 'Relevance' },
                  { value: 'sessions', label: 'Sessions' },
                  { value: 'complexity', label: 'Complexity' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      startTransition(() => setSort(item.value as SearchSort))
                    }
                    className={sort === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SearchProjectionPreview
              title="Non-blocking search results"
              summary={projection.summary}
              operations={projection.operations}
              items={projection.visibleItems}
              pendingLabel={
                isPending
                  ? 'filter transition pending'
                  : draftQuery !== deferredQuery
                    ? 'query deferred'
                    : 'stable'
              }
            />
            <Panel className="border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">
                Срочные обновления: input и shell note. Несрочные: track, sort и expensive
                results projection.
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-950/80">
                Именно так concurrent features помогают в real search UI: они не убирают
                тяжёлую работу, а делают так, чтобы она не ломала основной interaction
                loop.
              </p>
            </Panel>
          </div>
        </div>
      </Panel>
    </div>
  );
}
