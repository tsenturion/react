import { memo, useCallback, useMemo, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  describeListOptimization,
  type ListAction,
} from '../../lib/list-optimization-model';
import { memoCatalog } from '../../lib/use-memo-model';
import { MetricCard, Panel, StatusPill } from '../ui';

function filterItems(query: string) {
  const normalized = query.trim().toLowerCase();

  return memoCatalog.filter((item) => item.title.toLowerCase().includes(normalized));
}

function toggleId(current: readonly string[], nextId: string) {
  return current.includes(nextId)
    ? current.filter((item) => item !== nextId)
    : [...current, nextId];
}

function NaiveRow({
  id,
  title,
  selected,
  onToggle,
}: {
  id: string;
  title: string;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const commits = useRenderCount();

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        selected
          ? 'border-rose-300 bg-rose-50 text-rose-950'
          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{title}</span>
        <output aria-label={`Naive row commits: ${title}`} className="chip">
          {commits} commits
        </output>
      </div>
    </button>
  );
}

const OptimizedRow = memo(function OptimizedRow({
  id,
  title,
  selected,
  onToggle,
}: {
  id: string;
  title: string;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const commits = useRenderCount();

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        selected
          ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{title}</span>
        <output aria-label={`Optimized row commits: ${title}`} className="chip">
          {commits} commits
        </output>
      </div>
    </button>
  );
});

function NaiveListBoard({
  query,
  noteVersion,
  onInteraction,
}: {
  query: string;
  noteVersion: number;
  onInteraction: (action: ListAction) => void;
}) {
  const commits = useRenderCount();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const visibleItems = filterItems(query);

  const diagnosis = describeListOptimization({
    memoRows: false,
    stableCallbacks: false,
    memoizedVisibleIds: false,
    action: 'shell-note',
    visibleCount: visibleItems.length,
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-rose-200 bg-rose-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Naive list
          </p>
          <p className="mt-2 text-sm leading-6 text-rose-900">
            note version: <strong>{noteVersion}</strong>. {diagnosis.detail}
          </p>
        </div>
        <output
          aria-label="Naive list shell commits"
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-rose-700"
        >
          {commits} commits
        </output>
      </div>

      <div className="grid gap-3">
        {visibleItems.map((item) => (
          <NaiveRow
            key={item.id}
            id={item.id}
            title={item.title}
            selected={selectedIds.includes(item.id)}
            onToggle={(id) => {
              setSelectedIds((current) => toggleId(current, id));
              onInteraction('toggle-row');
            }}
          />
        ))}
      </div>
    </div>
  );
}

function OptimizedListBoard({
  query,
  noteVersion,
  onInteraction,
}: {
  query: string;
  noteVersion: number;
  onInteraction: (action: ListAction) => void;
}) {
  const commits = useRenderCount();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // useMemo здесь нужен не для "стиля", а чтобы visible slice не создавался
  // заново на каждый unrelated shell update и мог участвовать в стабильном row tree.
  const visibleItems = useMemo(() => filterItems(query), [query]);
  const stableToggle = useCallback(
    (id: string) => {
      setSelectedIds((current) => toggleId(current, id));
      onInteraction('toggle-row');
    },
    [onInteraction],
  );

  const diagnosis = describeListOptimization({
    memoRows: true,
    stableCallbacks: true,
    memoizedVisibleIds: true,
    action: 'shell-note',
    visibleCount: visibleItems.length,
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Optimized list
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-900">
            note version: <strong>{noteVersion}</strong>. {diagnosis.detail}
          </p>
        </div>
        <output
          aria-label="Optimized list shell commits"
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-emerald-700"
        >
          {commits} commits
        </output>
      </div>

      <div className="grid gap-3">
        {visibleItems.map((item) => (
          <OptimizedRow
            key={item.id}
            id={item.id}
            title={item.title}
            selected={selectedIds.includes(item.id)}
            onToggle={stableToggle}
          />
        ))}
      </div>
    </div>
  );
}

export function ListOptimizationLab() {
  const shellCommits = useRenderCount();
  const [dashboardNote, setDashboardNote] = useState(
    'Меняйте note и query, чтобы увидеть разницу между wide rerender и локальностью rows.',
  );
  const [query, setQuery] = useState('r');
  const [lastAction, setLastAction] = useState<ListAction>('shell-note');

  const visibleCount = filterItems(query).length;
  const wideDiagnosis = describeListOptimization({
    memoRows: false,
    stableCallbacks: false,
    memoizedVisibleIds: false,
    action: lastAction,
    visibleCount,
  });
  const optimizedDiagnosis = describeListOptimization({
    memoRows: true,
    stableCallbacks: true,
    memoizedVisibleIds: true,
    action: lastAction,
    visibleCount,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Один и тот же parent render может давать либо широкий cascade, либо почти нулевой след в rows."
          tone="accent"
        />
        <MetricCard
          label="Visible rows"
          value={`${visibleCount}`}
          hint="На списке даже мелкая нестабильность props быстро умножается на количество элементов."
          tone="cool"
        />
        <MetricCard
          label="Last action"
          value={lastAction}
          hint="Фильтр меняет список осознанно, а unrelated shell note не должен трогать optimized rows."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              List optimization
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              На списках быстрее всего видно, что memoization работает только как связка
            </h2>
          </div>
          <StatusPill tone={lastAction === 'filter-query' ? 'warn' : 'success'}>
            {lastAction === 'filter-query' ? 'useful list update' : 'compare breadth'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Unrelated dashboard note
              </span>
              <textarea
                aria-label="Unrelated dashboard note"
                value={dashboardNote}
                onChange={(event) => {
                  setDashboardNote(event.target.value);
                  setLastAction('shell-note');
                }}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-emerald-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">List query</span>
              <input
                aria-label="List query"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLastAction('filter-query');
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
              />
            </label>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <NaiveListBoard
              query={query}
              noteVersion={dashboardNote.length}
              onInteraction={setLastAction}
            />
            <OptimizedListBoard
              query={query}
              noteVersion={dashboardNote.length}
              onInteraction={setLastAction}
            />
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="border-rose-200 bg-rose-50">
          <p className="text-sm font-semibold text-rose-950">{wideDiagnosis.headline}</p>
          <p className="mt-2 text-sm leading-6 text-rose-950/80">
            {wideDiagnosis.nextMove}
          </p>
        </Panel>
        <Panel className="border-emerald-200 bg-emerald-50">
          <p className="text-sm font-semibold text-emerald-950">
            {optimizedDiagnosis.headline}
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-950/80">
            {optimizedDiagnosis.nextMove}
          </p>
        </Panel>
      </div>
    </div>
  );
}
