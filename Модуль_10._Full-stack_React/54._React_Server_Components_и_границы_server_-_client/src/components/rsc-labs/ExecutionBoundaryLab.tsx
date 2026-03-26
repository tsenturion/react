import { useState } from 'react';

import {
  analyzeBoundaryWorkspace,
  boundaryPresets,
  getBoundaryPreset,
  type BoundaryNodeId,
  type BoundaryPresetId,
  type BoundaryWorkspace,
  type ComponentLayer,
} from '../../lib/rsc-boundary-model';
import { MetricCard, Panel, StatusPill } from '../ui';

function applyLayer(
  workspace: BoundaryWorkspace,
  nodeId: BoundaryNodeId,
  layer: ComponentLayer,
): BoundaryWorkspace {
  return {
    ...workspace,
    [nodeId]: layer,
  };
}

export function ExecutionBoundaryLab() {
  const [presetId, setPresetId] = useState<BoundaryPresetId | 'custom'>(
    'balanced-islands',
  );
  const [workspace, setWorkspace] = useState<BoundaryWorkspace>(
    getBoundaryPreset('balanced-islands'),
  );
  const report = analyzeBoundaryWorkspace(workspace);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Execution map</span>
          <p className="text-sm leading-6 text-slate-600">
            Перекладывайте узлы между server и client и сразу смотрите, как меняются
            bundle, hydration pressure, bridge-запросы и архитектурные ошибки.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(boundaryPresets) as BoundaryPresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setPresetId(id);
                setWorkspace(getBoundaryPreset(id));
              }}
              className={`chip ${presetId === id ? 'chip-active' : ''}`}
            >
              {boundaryPresets[id].label}
            </button>
          ))}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Текущий режим
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {presetId === 'custom'
              ? 'Custom boundary map. Значения уже не совпадают с готовым preset.'
              : boundaryPresets[presetId].description}
          </p>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Client bundle, kB"
          value={String(report.clientBundleKb)}
          hint="Суммарный JS, который уезжает в браузер после выбора текущих client islands."
          tone="accent"
        />
        <MetricCard
          label="Hydration units"
          value={String(report.hydrationUnits)}
          hint="Каждый client узел требует hydration и добавляет работу браузеру."
          tone="cool"
        />
        <MetricCard
          label="Server bridges"
          value={String(report.bridgeCount)}
          hint="Столько узлов теперь требуют мост между client логикой и серверными данными/мутациями."
        />
        <MetricCard
          label="Invalid placements"
          value={String(report.invalidCount)}
          hint="Сервер не может исполнять client hooks. Такие узлы считаются ошибкой архитектуры."
          tone={report.invalidCount > 0 ? 'dark' : 'default'}
        />
      </div>

      <Panel className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Сводка по текущей границе
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{report.summary}</p>
          </div>
          <StatusPill tone={report.invalidCount > 0 ? 'error' : 'success'}>
            {report.invalidCount > 0 ? 'Есть ошибки границы' : 'Граница рабочая'}
          </StatusPill>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {report.nodes.map((node) => (
          <div
            key={node.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{node.label}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Recommended layer: {node.recommended}
                </p>
              </div>
              <StatusPill tone={node.tone}>
                {node.layer === 'server' ? 'server' : 'client'}
              </StatusPill>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setPresetId('custom');
                  setWorkspace((current) => applyLayer(current, node.id, 'server'));
                }}
                className={`chip ${node.layer === 'server' ? 'chip-active' : ''}`}
              >
                Server
              </button>
              <button
                type="button"
                onClick={() => {
                  setPresetId('custom');
                  setWorkspace((current) => applyLayer(current, node.id, 'client'));
                }}
                className={`chip ${node.layer === 'client' ? 'chip-active' : ''}`}
              >
                Client
              </button>
            </div>

            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">{node.explanation}</p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Server upside
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  {node.serverBenefit}
                </p>
              </div>
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Client upside
                </p>
                <p className="mt-2 text-sm leading-6 text-sky-950">
                  {node.clientBenefit}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Типичная ошибка
              </p>
              <p className="mt-2 text-sm leading-6 text-rose-950">
                {node.failureWhenMisplaced}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
