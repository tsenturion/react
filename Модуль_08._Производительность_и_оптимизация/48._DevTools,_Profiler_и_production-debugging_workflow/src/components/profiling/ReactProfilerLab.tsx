import {
  Profiler,
  memo,
  useCallback,
  useMemo,
  useState,
  type ProfilerOnRenderCallback,
} from 'react';

import {
  formatDurationMs,
  summarizeProfilerCommits,
  type ProfilerCommit,
} from '../../lib/profiler-model';
import {
  projectPerformanceCases,
  type CaseSort,
  type PerformanceArea,
  type PerformanceCase,
} from '../../lib/performance-cases-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

const ProfiledViewport = memo(function ProfiledViewport({
  id,
  items,
  scope,
  onRender,
}: {
  id: string;
  items: readonly PerformanceCase[];
  scope: 'list' | 'workspace';
  onRender: ProfilerOnRenderCallback;
}) {
  const cards = (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <span className="chip">{item.area}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            impact {item.impact} / average {item.averageDuration} ms / frequency{' '}
            {item.frequency}
          </p>
        </div>
      ))}
    </div>
  );

  if (scope === 'workspace') {
    return (
      <Profiler id={id} onRender={onRender}>
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Workspace shell</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Профайлер оборачивает весь экран и потому учитывает не только список, но и
              shell cards.
            </p>
          </div>
          {cards}
        </div>
      </Profiler>
    );
  }

  return (
    <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Workspace shell</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Здесь профайлер оборачивает только expensive subtree, а shell остаётся вне
          замера.
        </p>
      </div>
      <Profiler id={id} onRender={onRender}>
        <div className="space-y-3">{cards}</div>
      </Profiler>
    </div>
  );
});

export function ReactProfilerLab() {
  const [query, setQuery] = useState('render');
  const [area, setArea] = useState<PerformanceArea>('all');
  const [sort, setSort] = useState<CaseSort>('impact');
  const [intensity, setIntensity] = useState(3);
  const [scope, setScope] = useState<'list' | 'workspace'>('list');
  const [commits, setCommits] = useState<ProfilerCommit[]>([]);

  const projection = useMemo(
    () =>
      projectPerformanceCases({
        query,
        area,
        sort,
        intensity,
      }),
    [area, intensity, query, sort],
  );

  // Callback intentionally stays referentially stable. Иначе обновление таблицы commit-логов
  // само начнёт ломать эксперимент и профайлер будет ловить лишние commits от панели анализа.
  const handleRender = useCallback<ProfilerOnRenderCallback>(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      setCommits((current) =>
        [
          {
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
            interaction: `${query || 'empty'} / ${area} / ${scope}`,
          },
          ...current,
        ].slice(0, 8),
      );
    },
    [area, query, scope],
  );

  const summary = summarizeProfilerCommits(commits);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Commits"
          value={String(summary.commitCount)}
          hint="Profiler нужен не для абстрактных ощущений, а для конкретных commits и их стоимости."
          tone="accent"
        />
        <MetricCard
          label="Average actual duration"
          value={formatDurationMs(summary.averageActualDuration)}
          hint="actualDuration отражает реальную стоимость конкретного commit, а не гипотетический максимум."
          tone="cool"
        />
        <MetricCard
          label="Slowest commit"
          value={
            summary.slowestCommit
              ? formatDurationMs(summary.slowestCommit.actualDuration)
              : '0.0 ms'
          }
          hint={summary.hotspot}
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              React Profiler
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Commit timing показывает, где именно React тратит время
            </h2>
          </div>
          <StatusPill tone={summary.slowestCommit ? 'warn' : 'success'}>
            {scope === 'list' ? 'profile list subtree' : 'profile whole workspace'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Profiler scope</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setScope('list')}
                  className={scope === 'list' ? 'chip chip-active' : 'chip'}
                >
                  Results only
                </button>
                <button
                  type="button"
                  onClick={() => setScope('workspace')}
                  className={scope === 'workspace' ? 'chip chip-active' : 'chip'}
                >
                  Whole workspace
                </button>
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Profiler query</span>
              <input
                aria-label="Profiler query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Area</span>
              <select
                aria-label="Profiler area"
                value={area}
                onChange={(event) => setArea(event.target.value as PerformanceArea)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">All</option>
                <option value="render">Render</option>
                <option value="routing">Routing</option>
                <option value="network">Network</option>
                <option value="forms">Forms</option>
                <option value="data">Data</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Sort mode</span>
              <select
                aria-label="Profiler sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as CaseSort)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="impact">Impact</option>
                <option value="duration">Duration</option>
                <option value="frequency">Frequency</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Synthetic load</span>
              <input
                aria-label="Profiler intensity"
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-600">{intensity}x list projection cost</p>
            </label>

            <button
              type="button"
              onClick={() => setCommits([])}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Clear profiler feed
            </button>
          </div>

          <div className="space-y-4">
            <ProfiledViewport
              id={scope === 'list' ? 'ResultsList' : 'WorkspaceShell'}
              items={projection.visibleItems}
              scope={scope}
              onRender={handleRender}
            />

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Latest commits</p>
                <span className="chip">{projection.operations} projection ops</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="pb-2 pr-4">Profiler id</th>
                      <th className="pb-2 pr-4">Phase</th>
                      <th className="pb-2 pr-4">Actual</th>
                      <th className="pb-2 pr-4">Base</th>
                      <th className="pb-2">Interaction</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {commits.length === 0 ? (
                      <tr>
                        <td className="py-3 pr-4" colSpan={5}>
                          Измените query, filters или scope, чтобы React Profiler записал
                          commits.
                        </td>
                      </tr>
                    ) : (
                      commits.map((item, index) => (
                        <tr key={`${item.id}-${item.commitTime}-${index}`}>
                          <td className="border-t border-slate-100 py-3 pr-4">
                            {item.id}
                          </td>
                          <td className="border-t border-slate-100 py-3 pr-4">
                            {item.phase}
                          </td>
                          <td className="border-t border-slate-100 py-3 pr-4">
                            {formatDurationMs(item.actualDuration)}
                          </td>
                          <td className="border-t border-slate-100 py-3 pr-4">
                            {formatDurationMs(item.baseDuration)}
                          </td>
                          <td className="border-t border-slate-100 py-3">
                            {item.interaction}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Как читать Profiler"
        items={[
          'Сначала ищите конкретный slow commit, а не средний FPS “на глаз”.',
          'Сравнивайте actualDuration и baseDuration: так видно, помогает ли memoization или проблема в самом объёме работы.',
          'Профилируйте suspect subtree отдельно от whole workspace, чтобы не смешивать shell cost и локальный bottleneck.',
        ]}
      />
    </div>
  );
}
