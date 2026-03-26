import { useState } from 'react';

import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildProfilingReport,
  type ProfilingScenarioId,
} from '../../lib/compiler-profiler-model';

const scenarioOptions: readonly { id: ProfilingScenarioId; label: string }[] = [
  { id: 'filter-workbench', label: 'Filter workbench' },
  { id: 'composer-pane', label: 'Composer pane' },
  { id: 'dense-grid', label: 'Dense grid' },
] as const;

function widthPercent(value: number, max: number): string {
  return `${Math.max(12, Math.round((value / max) * 100))}%`;
}

export function ProfilingDebugLab() {
  const [scenarioId, setScenarioId] = useState<ProfilingScenarioId>('filter-workbench');
  const [dataSize, setDataSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [compilerEnabled, setCompilerEnabled] = useState(true);
  const [manualMemoKept, setManualMemoKept] = useState(false);

  const report = buildProfilingReport({
    scenarioId,
    dataSize,
    compilerEnabled,
    manualMemoKept,
  });

  const maxTraceValue = Math.max(
    ...report.trace.flatMap((item) => [item.beforeMs, item.afterMs]),
  );

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {scenarioOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setScenarioId(option.id)}
                className={`chip ${scenarioId === option.id ? 'chip-active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="block font-medium">Data size</span>
              <select
                value={dataSize}
                onChange={(event) =>
                  setDataSize(event.target.value as 'small' | 'medium' | 'large')
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={compilerEnabled}
                onChange={(event) => setCompilerEnabled(event.target.checked)}
              />
              Compiler enabled
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={manualMemoKept}
                onChange={(event) => setManualMemoKept(event.target.checked)}
              />
              Keep manual memo helpers
            </label>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
            <StatusPill tone={compilerEnabled ? 'success' : 'warn'}>
              {compilerEnabled ? 'compiler on' : 'compiler off'}
            </StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{report.devtoolsSignal}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Before commit"
          value={`${report.beforeCommitMs} ms`}
          hint="Commit duration без compiler improvement для выбранного сценария."
        />
        <MetricCard
          label="After commit"
          value={`${report.afterCommitMs} ms`}
          hint="Commit duration после текущей комбинации compiler/manual memo."
          tone="accent"
        />
        <MetricCard
          label="Rerenders"
          value={`${report.beforeRerenders} -> ${report.afterRerenders}`}
          hint="Сколько повторной работы остаётся после выбранной стратегии."
          tone="cool"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {report.trace.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>Before</span>
                  <span>{item.beforeMs} ms</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-rose-400"
                    style={{ width: widthPercent(item.beforeMs, maxTraceValue) }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>After</span>
                  <span>{item.afterMs} ms</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-emerald-500"
                    style={{ width: widthPercent(item.afterMs, maxTraceValue) }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ListBlock title="Workflow" items={report.workflow} />
    </Panel>
  );
}
