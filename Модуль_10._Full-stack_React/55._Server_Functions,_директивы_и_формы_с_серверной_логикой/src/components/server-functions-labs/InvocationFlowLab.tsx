'use client';

import { useState } from 'react';

import { compareInvocationStrategies } from '../../lib/server-function-flow-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function InvocationFlowLab() {
  const [networkMs, setNetworkMs] = useState(110);
  const [validationComplexity, setValidationComplexity] = useState(2);
  const [selectedId, setSelectedId] = useState<
    'manual-api' | 'server-function' | 'client-only'
  >('server-function');
  const reports = compareInvocationStrategies({
    networkMs,
    validationComplexity,
  });
  const selected = reports.find((report) => report.id === selectedId) ?? reports[0];

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Invocation flow</span>
          <p className="text-sm leading-6 text-slate-600">
            Сравните путь формы до серверной мутации в трёх режимах: manual API, server
            function и purely client mock.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Network: {networkMs}ms
            </span>
            <input
              className="mt-4 w-full"
              type="range"
              min={40}
              max={240}
              step={10}
              value={networkMs}
              onChange={(event) => setNetworkMs(Number(event.target.value))}
            />
          </label>
          <label className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Validation complexity: {validationComplexity}
            </span>
            <input
              className="mt-4 w-full"
              type="range"
              min={1}
              max={4}
              step={1}
              value={validationComplexity}
              onChange={(event) => setValidationComplexity(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelectedId(report.id)}
              className={`chip ${selectedId === report.id ? 'chip-active' : ''}`}
            >
              {report.label}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Round trip"
          value={`${selected.roundTripMs}ms`}
          hint="Оценка полного пути от submit до server-side результата."
          tone="accent"
        />
        <MetricCard
          label="Handwritten glue"
          value={String(selected.handwrittenGlue)}
          hint="Чем больше число, тем больше ручного full-stack клея приходится писать."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Schema duplication
          </p>
          <div className="mt-3">
            <StatusPill
              tone={
                selected.schemaDuplicationRisk === 'high'
                  ? 'error'
                  : selected.schemaDuplicationRisk === 'low'
                    ? 'warn'
                    : 'success'
              }
            >
              {selected.schemaDuplicationRisk}
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{selected.why}</p>
        </div>
      </div>

      <Panel>
        <ListBlock title="Flow steps" items={selected.steps} />
      </Panel>
    </div>
  );
}
