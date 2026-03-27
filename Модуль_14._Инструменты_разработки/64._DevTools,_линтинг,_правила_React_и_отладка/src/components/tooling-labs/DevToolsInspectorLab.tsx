import { useMemo, useState } from 'react';

import {
  explainRenderReason,
  inspectorTakeaways,
} from '../../lib/devtools-inspector-model';
import { CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type InspectorTab = 'all' | 'warnings' | 'performance';
type InspectorTheme = 'classic' | 'contrast';

const nodeLabels = {
  'filter-panel': 'FilterPanel',
  'result-list': 'ResultList',
  'detail-pane': 'DetailPane',
} as const;

export function DevToolsInspectorLab() {
  const [filter, setFilter] = useState('deps');
  const [selectedTab, setSelectedTab] = useState<InspectorTab>('warnings');
  const [theme, setTheme] = useState<InspectorTheme>('classic');
  const [selectedNode, setSelectedNode] =
    useState<keyof typeof nodeLabels>('result-list');

  const explanation = explainRenderReason({
    nodeId: selectedNode,
    filter,
    selectedTab,
    theme,
  });

  // Snapshot собран как plain object, чтобы лаборатория показывала тот же разрез,
  // который обычно нужен в DevTools: props, state и context отдельно от DOM.
  const snapshot = useMemo(
    () => ({
      props:
        selectedNode === 'filter-panel'
          ? { filterPlaceholder: 'Search findings', selectedTab }
          : selectedNode === 'result-list'
            ? { filter, selectedTab, visibleRows: Math.max(3, 9 - filter.length) }
            : { selectedIssue: filter || 'missing-dependency', selectedTab },
      state:
        selectedNode === 'filter-panel'
          ? { draftFilter: filter, expandedGroups: selectedTab === 'all' ? 3 : 1 }
          : selectedNode === 'result-list'
            ? {
                highlightedIndex: filter.length % 3,
                pinnedWarnings: selectedTab === 'warnings',
              }
            : { panelOpen: true, inspectedSignal: explanation.title },
      context: {
        theme,
        devtoolsMode:
          selectedTab === 'performance' ? 'render-reasons' : 'snapshot-inspection',
      },
    }),
    [explanation.title, filter, selectedNode, selectedTab, theme],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Panel className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <label className="min-w-56 flex-1 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Filter input
              </span>
              <input
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Type to change props/state snapshot"
              />
            </label>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Active tab
              </span>
              <div className="flex flex-wrap gap-2">
                {(['all', 'warnings', 'performance'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setSelectedTab(tab);
                    }}
                    className={selectedTab === tab ? 'chip chip-active' : 'chip'}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Theme context
              </span>
              <div className="flex gap-2">
                {(['classic', 'contrast'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setTheme(option);
                    }}
                    className={theme === option ? 'chip chip-active' : 'chip'}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                React component tree
              </p>
              {(Object.entries(nodeLabels) as [keyof typeof nodeLabels, string][]).map(
                ([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setSelectedNode(id);
                    }}
                    className={[
                      'w-full rounded-[22px] border px-4 py-4 text-left transition',
                      selectedNode === id
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white',
                    ].join(' ')}
                  >
                    <span className="block text-sm font-semibold">{label}</span>
                    <span
                      className={[
                        'mt-1 block text-xs leading-5',
                        selectedNode === id ? 'text-blue-100' : 'text-slate-500',
                      ].join(' ')}
                    >
                      {id === 'filter-panel' &&
                        'Controlled input + tabs: источник локального UI-state.'}
                      {id === 'result-list' &&
                        'Пропсы и context показывают, почему список обновился именно сейчас.'}
                      {id === 'detail-pane' &&
                        'Комбинированная ветка: props, selected tab и theme в одной точке.'}
                    </span>
                  </button>
                ),
              )}
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  label="Selected node"
                  value={nodeLabels[selectedNode]}
                  hint="Сначала находите компонент, затем читаете его входы и причины обновления."
                  tone="cool"
                />
                <MetricCard
                  label="Visible rows"
                  value={String(Math.max(3, 9 - filter.length))}
                  hint="Меняется из props filter. Это видно ещё до просмотра DOM."
                  tone="accent"
                />
                <MetricCard
                  label="Inspector mode"
                  value={snapshot.context.devtoolsMode}
                  hint="Контекст тоже часть диагностического снимка, а не только визуальная тема."
                  tone="dark"
                />
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {explanation.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Это симуляция того, как DevTools помогает перевести symptom в render
                      reason: через props, state и context snapshot.
                    </p>
                  </div>
                  <StatusPill tone={explanation.tone}>
                    {explanation.tone === 'success'
                      ? 'Readable reason'
                      : explanation.tone === 'warn'
                        ? 'Needs inspection'
                        : 'Broken signal'}
                  </StatusPill>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                  {explanation.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                {(
                  Object.entries(snapshot) as [
                    keyof typeof snapshot,
                    Record<string, string | number | boolean>,
                  ][]
                ).map(([bucket, values]) => (
                  <div
                    key={bucket}
                    className="rounded-[24px] border border-slate-200 bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {bucket}
                    </p>
                    <div className="mt-3 space-y-2">
                      {Object.entries(values).map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {key}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <ListBlock title="What to look for in DevTools" items={inspectorTakeaways} />
          <CodeBlock
            label="render reason model"
            code={`const explanation = explainRenderReason({
  nodeId: selectedNode,
  filter,
  selectedTab,
  theme,
});`}
          />
        </div>
      </div>
    </div>
  );
}
