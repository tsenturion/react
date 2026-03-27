import { memo, useMemo, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  describeUseMemoScenario,
  memoCatalog,
  projectCatalog,
  type CatalogTrack,
} from '../../lib/use-memo-model';
import { MetricCard, Panel, StatusPill } from '../ui';

const MemoizedProjectionCard = memo(function MemoizedProjectionCard({
  title,
  projection,
  outputLabel,
}: {
  title: string;
  projection: ReturnType<typeof projectCatalog>;
  outputLabel: string;
}) {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{projection.summary}</p>
        </div>
        <output aria-label={outputLabel} className="chip">
          {commits} commits
        </output>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            operations
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {projection.operations}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            total seats
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {projection.totalSeats}
          </p>
        </div>
      </div>
    </div>
  );
});

export function UseMemoDerivedLab() {
  const shellCommits = useRenderCount();
  const [shellNote, setShellNote] = useState(
    'Меняйте shell note, не трогая фильтры, и смотрите на direct vs useMemo projection.',
  );
  const [track, setTrack] = useState<CatalogTrack>('all');
  const [minComplexity, setMinComplexity] = useState(3);
  const [lastAction, setLastAction] = useState<'shell-note' | 'filters'>('shell-note');

  const directProjection = projectCatalog(memoCatalog, {
    track,
    minComplexity,
  });

  // useMemo нужен здесь не "для порядка", а потому что downstream memo-card
  // сравнивает projection по ссылке и может реально не ререндериться на shell-state.
  const memoProjection = useMemo(
    () =>
      projectCatalog(memoCatalog, {
        track,
        minComplexity,
      }),
    [minComplexity, track],
  );

  const directDiagnosis = describeUseMemoScenario({
    usesMemoForProjection: false,
    unrelatedStateChanged: lastAction === 'shell-note',
  });
  const memoDiagnosis = describeUseMemoScenario({
    usesMemoForProjection: true,
    unrelatedStateChanged: lastAction === 'shell-note',
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Parent render не исчезает. Важно, пересобирается ли expensive derived value без причины."
          tone="accent"
        />
        <MetricCard
          label="Filter signature"
          value={`${track} / >= ${minComplexity}`}
          hint="Именно эти входные данные должны управлять derived projection."
          tone="cool"
        />
        <MetricCard
          label="Current trigger"
          value={lastAction === 'shell-note' ? 'unrelated state' : 'filter change'}
          hint="useMemo ничего не экономит при реальном изменении dependencies."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              useMemo and derived data
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              useMemo полезен там, где derived object участвует в downstream сравнении или
              сам пересчёт уже ощутим
            </h2>
          </div>
          <StatusPill tone={lastAction === 'shell-note' ? 'warn' : 'success'}>
            {lastAction === 'shell-note' ? 'compare stability' : 'useful recompute'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Unrelated shell note
              </span>
              <textarea
                aria-label="Unrelated shell note"
                value={shellNote}
                onChange={(event) => {
                  setShellNote(event.target.value);
                  setLastAction('shell-note');
                }}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Track filter</span>
              <select
                aria-label="Track filter"
                value={track}
                onChange={(event) => {
                  setTrack(event.target.value as CatalogTrack);
                  setLastAction('filters');
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">All tracks</option>
                <option value="render">Render</option>
                <option value="data">Data</option>
                <option value="routing">Routing</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Минимальная сложность
              </span>
              <input
                aria-label="Минимальная сложность"
                type="range"
                min="1"
                max="5"
                value={minComplexity}
                onChange={(event) => {
                  setMinComplexity(Number(event.target.value));
                  setLastAction('filters');
                }}
                className="w-full"
              />
              <p className="text-sm text-slate-600">
                {'>= '} {minComplexity}
              </p>
            </label>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-3">
              <MemoizedProjectionCard
                title="Direct derive on every render"
                projection={directProjection}
                outputLabel="Direct projection commits"
              />
              <Panel className="border-amber-200 bg-amber-50">
                <p className="text-sm font-semibold text-amber-950">
                  {directDiagnosis.headline}
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-950/80">
                  {directDiagnosis.detail}
                </p>
              </Panel>
            </div>

            <div className="space-y-3">
              <MemoizedProjectionCard
                title="Derived object through useMemo"
                projection={memoProjection}
                outputLabel="Memo projection commits"
              />
              <Panel className="border-emerald-200 bg-emerald-50">
                <p className="text-sm font-semibold text-emerald-950">
                  {memoDiagnosis.headline}
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950/80">
                  {memoDiagnosis.detail}
                </p>
              </Panel>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
