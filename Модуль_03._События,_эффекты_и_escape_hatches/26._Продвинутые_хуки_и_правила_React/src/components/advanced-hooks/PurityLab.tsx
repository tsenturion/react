import clsx from 'clsx';
import { useState } from 'react';

import {
  defaultPurityState,
  evaluatePurityState,
  type PuritySignal,
} from '../../lib/purity-model';
import { MetricCard, StatusPill } from '../ui';

const puritySignals: readonly { key: PuritySignal; label: string }[] = [
  { key: 'readsRandomInRender', label: 'Читать случайное значение прямо в рендере' },
  { key: 'mutatesRefInRender', label: 'Мутировать ref во время рендера' },
  { key: 'setsStateInRender', label: 'Вызывать setState в рендере' },
  { key: 'derivesInRender', label: 'Оставить derived вычисления в рендере' },
] as const;

export function PurityLab() {
  const [state, setState] = useState(defaultPurityState);
  const summary = evaluatePurityState(state);

  function toggleSignal(key: PuritySignal) {
    setState((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Render-phase сигналы
          </p>
          <div className="mt-4 space-y-3">
            {puritySignals.map((signal) => (
              <button
                key={signal.key}
                type="button"
                onClick={() => toggleSignal(signal.key)}
                className={clsx(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                  state[signal.key]
                    ? 'border-blue-300 bg-blue-50 text-blue-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                )}
              >
                <span className="text-sm font-medium">{signal.label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {state[signal.key] ? 'on' : 'off'}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setState(defaultPurityState)}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Сбросить сценарий
          </button>
        </div>

        <div className="grid gap-3">
          <MetricCard
            label="Нарушений"
            value={String(summary.issues.length)}
            hint="Чем больше нарушений в render-phase, тем менее объяснимым становится компонент."
            tone={summary.issues.length > 0 ? 'accent' : 'cool'}
          />
          <MetricCard
            label="Derived в render"
            value={state.derivesInRender ? 'Да' : 'Нет'}
            hint="Чистое вычисление безопаснее хранить в рендере, а не синхронизировать effect-ом."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">{summary.headline}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                React ожидает, что компонент ведёт себя как чистая функция от входных
                данных. Как только в render-phase появляются скрытые side effects, порядок
                вычислений становится менее предсказуемым.
              </p>
            </div>
            <StatusPill tone={summary.tone}>{summary.tone}</StatusPill>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Текущие проблемы</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {summary.issues.length > 0 ? (
              summary.issues.map((issue) => (
                <li
                  key={issue}
                  className="rounded-xl border border-rose-200 bg-white px-4 py-3"
                >
                  {issue}
                </li>
              ))
            ) : (
              <li className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-900">
                Нарушений нет: компонент остаётся предсказуемым.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">Безопасные ходы</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {summary.safeMoves.map((move) => (
              <li
                key={move}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {move}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
