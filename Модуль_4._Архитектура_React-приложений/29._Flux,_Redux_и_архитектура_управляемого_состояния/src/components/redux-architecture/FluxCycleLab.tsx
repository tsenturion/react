import clsx from 'clsx';
import { useState } from 'react';

import { buildFluxReport } from '../../lib/flux-loop-model';
import { actionPresets } from '../../lib/redux-domain';
import { MetricCard, StatusPill } from '../ui';

export function FluxCycleLab() {
  const [selectedActionId, setSelectedActionId] = useState(actionPresets[0]!.id);
  const report = buildFluxReport(selectedActionId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={report.tone}>{report.tone}</StatusPill>
        <p className="text-sm leading-6 text-slate-600">
          Один action проходит полный цикл Flux без двунаправленных обновлений и скрытых
          связей.
        </p>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-2">
          {actionPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedActionId(preset.id)}
              className={clsx(
                'rounded-xl px-4 py-3 text-sm font-medium transition',
                selectedActionId === preset.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Action type"
          value={report.actionType}
          hint="Action — единственный способ выразить намерение изменить централизованное состояние."
          tone="cool"
        />
        <MetricCard
          label="Шагов цикла"
          value={String(report.steps.length)}
          hint="View → Action → Store → Reducer → Selector → View update."
        />
        <MetricCard
          label="Суть Flux"
          value="One-way"
          hint="Данные всегда идут в одном направлении, а не хаотично меняются в разных точках UI."
          tone="accent"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {report.steps.map((step, index) => (
          <article
            key={`${step.phase}-${index}`}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {index + 1}. {step.phase}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{step.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
