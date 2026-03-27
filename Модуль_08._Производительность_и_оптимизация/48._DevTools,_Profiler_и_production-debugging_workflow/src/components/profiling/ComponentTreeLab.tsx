import { type ReactNode, useMemo, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  analyzeComponentTree,
  type RenderTrigger,
  type TreeBranch,
  type TreeMode,
} from '../../lib/component-tree-model';
import {
  projectPerformanceCases,
  type PerformanceArea,
} from '../../lib/performance-cases-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

function BranchCard({
  title,
  subtitle,
  tone,
  children,
}: {
  title: string;
  subtitle: string;
  tone: 'warm' | 'cool' | 'dark';
  children: ReactNode;
}) {
  const commits = useRenderCount();

  return (
    <div
      className={[
        'rounded-[24px] border p-4',
        tone === 'warm' && 'border-amber-300/60 bg-amber-100/60',
        tone === 'cool' && 'border-cyan-300/60 bg-cyan-100/60',
        tone === 'dark' && 'border-slate-800 bg-slate-950 text-white',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p
            className={[
              'mt-1 text-xs uppercase tracking-[0.18em]',
              tone === 'dark' ? 'text-slate-300' : 'text-slate-500',
            ].join(' ')}
          >
            {subtitle}
          </p>
        </div>
        <span
          className={[
            'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
            tone === 'dark'
              ? 'border-white/15 text-slate-200'
              : 'border-slate-300 bg-white text-slate-700',
          ].join(' ')}
        >
          {commits} commits
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ToolbarBranch({ query, area }: { query: string; area: PerformanceArea }) {
  return (
    <BranchCard title="Toolbar branch" subtitle="input + filters" tone="warm">
      <p className="text-sm leading-6 text-slate-700">
        Query: <strong>{query || 'empty'}</strong>
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Area filter: <strong>{area}</strong>
      </p>
    </BranchCard>
  );
}

function SidebarBranch({
  query,
  area,
  treeMode,
  shellPulse,
}: {
  query: string;
  area: PerformanceArea;
  treeMode: TreeMode;
  shellPulse: number;
}) {
  return (
    <BranchCard title="Sidebar branch" subtitle="summary + shell signals" tone="cool">
      <p className="text-sm leading-6 text-slate-700">
        Shell pulse: <strong>{shellPulse}</strong>
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {treeMode === 'wide-parent'
          ? `Sidebar всё ещё видит query "${query || 'empty'}" и потому переоценивается чаще.`
          : `Sidebar живёт на area "${area}" и не зависит от локального draft input.`}
      </p>
    </BranchCard>
  );
}

function ResultsBranch({
  query,
  area,
  intensity,
}: {
  query: string;
  area: PerformanceArea;
  intensity: number;
}) {
  const projection = useMemo(
    () =>
      projectPerformanceCases({
        query,
        area,
        sort: 'impact',
        intensity,
      }),
    [area, intensity, query],
  );

  return (
    <BranchCard title="Results branch" subtitle="heavy projection" tone="dark">
      <p className="text-sm leading-6 text-slate-300">
        Projection operations: <strong>{projection.operations}</strong>
      </p>
      <div className="mt-3 space-y-2">
        {projection.visibleItems.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">{item.summary}</p>
          </div>
        ))}
      </div>
    </BranchCard>
  );
}

export function ComponentTreeLab() {
  const [treeMode, setTreeMode] = useState<TreeMode>('wide-parent');
  const [highlightedBranch, setHighlightedBranch] = useState<TreeBranch>('list');
  const [trigger, setTrigger] = useState<RenderTrigger>('typing');
  const [query, setQuery] = useState('render');
  const [area, setArea] = useState<PerformanceArea>('all');
  const [shellPulse, setShellPulse] = useState(1);
  const [themePulse, setThemePulse] = useState(false);

  const analysis = analyzeComponentTree({
    treeMode,
    trigger,
    highlightedBranch,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Tree mode"
          value={
            treeMode === 'wide-parent' ? 'wide parent state' : 'isolated branch state'
          }
          hint="DevTools tree полезен именно для чтения ownership: где живёт state и кто из sibling branches втягивается в update."
          tone="accent"
        />
        <MetricCard
          label="Current trigger"
          value={trigger}
          hint="Меняйте тип действия и смотрите, какие ветки действительно должны обновляться."
          tone="cool"
        />
        <MetricCard
          label="Inspection focus"
          value={highlightedBranch}
          hint="Highlight updates и render counters должны подтверждать именно эту ветку, а не весь экран сразу."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Component tree analysis
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Дерево компонентов показывает не только форму UI, но и траекторию обновлений
            </h2>
          </div>
          <StatusPill tone={analysis.tone}>{analysis.headline}</StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Tree mode</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTreeMode('wide-parent')}
                  className={treeMode === 'wide-parent' ? 'chip chip-active' : 'chip'}
                >
                  Wide parent
                </button>
                <button
                  type="button"
                  onClick={() => setTreeMode('isolated-branch')}
                  className={treeMode === 'isolated-branch' ? 'chip chip-active' : 'chip'}
                >
                  Isolated branch
                </button>
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search query</span>
              <input
                aria-label="Component tree query"
                value={query}
                onChange={(event) => {
                  setTrigger('typing');
                  setHighlightedBranch('list');
                  setQuery(event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Area filter</span>
              <select
                aria-label="Component tree area"
                value={area}
                onChange={(event) => {
                  setTrigger('filter');
                  setHighlightedBranch('list');
                  setArea(event.target.value as PerformanceArea);
                }}
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
              <span className="text-sm font-medium text-slate-700">Inspect branch</span>
              <select
                aria-label="Highlighted branch"
                value={highlightedBranch}
                onChange={(event) =>
                  setHighlightedBranch(event.target.value as TreeBranch)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="toolbar">Toolbar</option>
                <option value="sidebar">Sidebar</option>
                <option value="list">List</option>
              </select>
            </label>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setTrigger('route-change');
                  setHighlightedBranch('sidebar');
                  setShellPulse((value) => value + 1);
                }}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Simulate route change
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrigger('theme-toggle');
                  setHighlightedBranch('sidebar');
                  setThemePulse((value) => !value);
                }}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Toggle shell theme ({themePulse ? 'night' : 'day'})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <ToolbarBranch query={query} area={area} />
              <SidebarBranch
                query={query}
                area={area}
                treeMode={treeMode}
                shellPulse={shellPulse}
              />
              <ResultsBranch
                query={query}
                area={area}
                intensity={treeMode === 'wide-parent' ? 3 : 2}
              />
            </div>

            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">{analysis.headline}</p>
              <p className="text-sm leading-6 text-cyan-950/80">{analysis.explanation}</p>
              <p className="text-sm leading-6 text-cyan-950/80">
                {analysis.devtoolsClue}
              </p>
            </Panel>
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Что смотреть в React DevTools"
        items={[
          'Какая ветка дерева меняется при конкретном действии пользователя.',
          'Какие sibling components обновляются без прямой зависимости от текущего действия.',
          'Где state поднят слишком высоко и делает component tree шумным для расследования.',
        ]}
      />
    </div>
  );
}
