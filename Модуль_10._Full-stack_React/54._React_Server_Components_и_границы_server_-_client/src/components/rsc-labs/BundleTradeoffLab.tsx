import { useState } from 'react';

import {
  analyzeBoundaryWorkspace,
  boundaryPresets,
  type BoundaryPresetId,
} from '../../lib/rsc-boundary-model';
import {
  compareArchitecturePresets,
  describeBundlePressure,
} from '../../lib/rsc-tradeoff-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function BundleTradeoffLab() {
  const [presetId, setPresetId] = useState<BoundaryPresetId>('balanced-islands');
  const comparison = compareArchitecturePresets();
  const selected = comparison.find((item) => item.presetId === presetId) ?? comparison[0];
  const deepReport = analyzeBoundaryWorkspace(boundaryPresets[presetId].workspace);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Bundle & data trade-offs</span>
          <p className="text-sm leading-6 text-slate-600">
            Здесь сравниваются не отдельные компоненты, а целые архитектурные варианты:
            server-first, balanced islands и client-heavy.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {comparison.map((item) => (
            <button
              key={item.presetId}
              type="button"
              onClick={() => setPresetId(item.presetId)}
              className={`rounded-[24px] border p-5 text-left shadow-sm transition ${
                item.presetId === presetId
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
                <StatusPill tone={item.invalidCount > 0 ? 'error' : 'success'}>
                  {item.invalidCount > 0 ? 'Есть ошибки' : 'Рабочая схема'}
                </StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              <div className="mt-4 grid gap-2 text-sm leading-6 text-slate-700">
                <p>Bundle: {item.clientBundleKb}kB</p>
                <p>Hydration units: {item.hydrationUnits}</p>
                <p>Bridge points: {item.bridgeCount}</p>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Preset"
          value={selected.label}
          hint="Текущий архитектурный профиль смешанного приложения."
          tone="accent"
        />
        <MetricCard
          label="Bundle"
          value={`${selected.clientBundleKb}kB`}
          hint={describeBundlePressure(selected.clientBundleKb)}
          tone="cool"
        />
        <MetricCard
          label="Bridge points"
          value={String(selected.bridgeCount)}
          hint="Столько client узлов требуют отдельный bridge к серверной логике или данным."
        />
        <MetricCard
          label="Hydration units"
          value={String(selected.hydrationUnits)}
          hint="Hydration pressure растёт вместе с количеством client islands."
        />
      </div>

      <Panel className="space-y-4">
        <p className="text-sm leading-6 text-slate-700">{selected.summary}</p>
        <ListBlock
          title="Как выглядит выбранная схема"
          items={deepReport.nodes.map(
            (node) => `${node.label}: ${node.layer.toUpperCase()} — ${node.explanation}`,
          )}
        />
      </Panel>
    </div>
  );
}
