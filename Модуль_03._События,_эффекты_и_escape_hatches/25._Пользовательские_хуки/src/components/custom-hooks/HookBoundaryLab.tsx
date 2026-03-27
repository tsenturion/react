import clsx from 'clsx';
import { useState } from 'react';

import { boundaryPresets, type BoundaryScenario } from '../../lib/custom-hooks-domain';
import { assessHookBoundary } from '../../lib/hook-boundary-model';
import { StatusPill } from '../ui';

export function HookBoundaryLab() {
  const [scenario, setScenario] = useState<BoundaryScenario>({ ...boundaryPresets[0] });
  const assessment = assessHookBoundary(scenario);

  function updateScenario<Key extends keyof BoundaryScenario>(
    key: Key,
    value: BoundaryScenario[Key],
  ) {
    setScenario((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Быстрые пресеты
          </p>
          <div className="mt-4 grid gap-2">
            {boundaryPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setScenario({ ...preset })}
                className={clsx(
                  'rounded-xl border px-3 py-3 text-left text-sm transition',
                  scenario.id === preset.id
                    ? 'border-blue-500 bg-blue-50 text-blue-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                )}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Название сценария
              </span>
              <input
                value={scenario.title}
                onChange={(event) => updateScenario('title', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Повторяемость</span>
              <select
                value={scenario.repetition}
                onChange={(event) =>
                  updateScenario(
                    'repetition',
                    event.target.value as BoundaryScenario['repetition'],
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              >
                <option value="single">single</option>
                <option value="multiple">multiple</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Сложность</span>
              <select
                value={scenario.complexity}
                onChange={(event) =>
                  updateScenario(
                    'complexity',
                    event.target.value as BoundaryScenario['complexity'],
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              >
                <option value="tiny">tiny</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={scenario.sideEffects}
                onChange={(event) => updateScenario('sideEffects', event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Есть внешняя синхронизация</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={scenario.internalState}
                onChange={(event) =>
                  updateScenario('internalState', event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Есть скрытое состояние</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={scenario.shareableAcrossComponents}
                onChange={(event) =>
                  updateScenario('shareableAcrossComponents', event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Нужно нескольким компонентам</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">{assessment.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {assessment.explanation}
              </p>
            </div>
            <StatusPill tone={assessment.tone}>{assessment.tone}</StatusPill>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Сигналы решения
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {assessment.signals.map((signal) => (
              <li
                key={signal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                {signal}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">
            Почему здесь нет ещё одного hook-а
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Эта лаборатория intentionally держит decision-логику в pure function
            `assessHookBoundary(...)`. Если behaviour ещё не повторяется как
            React-сценарий, честнее начать с helper-функции, а не автоматически создавать
            новый hook.
          </p>
        </div>
      </div>
    </div>
  );
}
