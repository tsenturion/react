import clsx from 'clsx';
import { useState } from 'react';

import {
  buildDataFlowReport,
  type ClassificationChoices,
} from '../../lib/data-flow-model';

export function DataDerivedEventsLab() {
  const [choices, setChoices] = useState<ClassificationChoices>({
    filteredInState: false,
    summaryInState: false,
    selectedObjectInState: false,
  });
  const report = buildDataFlowReport(choices);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <ToggleCard
          title="filteredLessons"
          copy="Хранить в state вместо вычисления"
          checked={choices.filteredInState}
          onToggle={() =>
            setChoices((current) => ({
              ...current,
              filteredInState: !current.filteredInState,
            }))
          }
        />
        <ToggleCard
          title="summaryCounters"
          copy="Хранить в state вместо derived summary"
          checked={choices.summaryInState}
          onToggle={() =>
            setChoices((current) => ({
              ...current,
              summaryInState: !current.summaryInState,
            }))
          }
        />
        <ToggleCard
          title="selectedLesson object"
          copy="Хранить объект целиком вместо selectedId"
          checked={choices.selectedObjectInState}
          onToggle={() =>
            setChoices((current) => ({
              ...current,
              selectedObjectInState: !current.selectedObjectInState,
            }))
          }
        />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Классификация экрана
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{report.summary}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">risk</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              {report.riskCount}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {report.rows.map((row) => (
            <div
              key={row.name}
              className={clsx(
                'rounded-2xl border px-4 py-4',
                row.kind === 'duplicated'
                  ? 'border-rose-200 bg-rose-50'
                  : row.kind === 'derived'
                    ? 'border-emerald-200 bg-emerald-50'
                    : row.kind === 'event'
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-slate-200 bg-slate-50',
              )}
            >
              <p className="text-sm font-semibold text-slate-900">{row.name}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {row.kind}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{row.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToggleCard({
  title,
  copy,
  checked,
  onToggle,
}: {
  title: string;
  copy: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'rounded-[24px] border p-4 text-left transition',
        checked ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white',
      )}
    >
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {checked ? 'сейчас хранится в state' : 'сейчас вычисляется или не хранится'}
      </p>
    </button>
  );
}
