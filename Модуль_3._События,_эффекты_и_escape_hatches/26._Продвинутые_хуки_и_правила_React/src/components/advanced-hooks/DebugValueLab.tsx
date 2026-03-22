import clsx from 'clsx';

import { useRuleDiagnostics } from '../../hooks/useRuleDiagnostics';
import { diagnosticsLabels } from '../../lib/debug-value-model';
import { MetricCard, StatusPill } from '../ui';

export function DebugValueLab() {
  const diagnostics = useRuleDiagnostics();

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Rule toggles
          </p>
          <div className="mt-4 space-y-3">
            {Object.entries(diagnosticsLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  diagnostics.toggleCheck(key as keyof typeof diagnosticsLabels)
                }
                className={clsx(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                  diagnostics.state[key as keyof typeof diagnostics.state]
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                    : 'border-rose-300 bg-rose-50 text-rose-950',
                )}
              >
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {diagnostics.state[key as keyof typeof diagnostics.state]
                    ? 'ok'
                    : 'off'}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={diagnostics.reset}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Вернуть базовое состояние
          </button>
        </div>

        <div className="grid gap-3">
          <MetricCard
            label="Проверок пройдено"
            value={`${diagnostics.summary.passed}/${diagnostics.summary.total}`}
            hint="Это же число используется и в debug label."
          />
          <MetricCard
            label="Blockers"
            value={String(diagnostics.summary.blockers.length)}
            hint="Количество непройденных ограничений помогает быстро увидеть масштаб проблемы."
            tone={diagnostics.summary.blockers.length > 0 ? 'accent' : 'cool'}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                {diagnostics.summary.headline}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                `useDebugValue` не меняет поведение hook-а, но делает его понятнее в React
                DevTools. Здесь показана та же сводка, которую hook отдаёт в DevTools
                через formatter.
              </p>
            </div>
            <StatusPill tone={diagnostics.summary.tone}>
              {diagnostics.summary.tone}
            </StatusPill>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Debug label preview
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {`${diagnostics.summary.passed}/${diagnostics.summary.total} safe • ${diagnostics.summary.blockers.length} blockers`}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Это короткое значение удобно, когда custom hook сложный и его нужно быстро
            диагностировать в дереве hooks.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Текущие blockers</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {diagnostics.summary.blockers.length > 0 ? (
              diagnostics.summary.blockers.map((key) => (
                <li
                  key={key}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {diagnosticsLabels[key]}
                </li>
              ))
            ) : (
              <li className="rounded-xl border border-emerald-300 bg-white px-4 py-3 text-emerald-900">
                Все ограничения сейчас зелёные.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
