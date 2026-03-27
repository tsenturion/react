import clsx from 'clsx';
import { useState } from 'react';

import {
  recommendStatePlacement,
  type PlacementScenario,
} from '../../lib/placement-advisor-model';
import { advisorPresets } from '../../lib/state-domain';
import { StatusPill } from '../ui';

export function PlacementAdvisorLab() {
  const [scenario, setScenario] = useState<PlacementScenario>({
    ...advisorPresets[0],
  });
  const recommendation = recommendStatePlacement(scenario);

  function isPresetActive(preset: (typeof advisorPresets)[number]) {
    return (
      scenario.sharedAcrossTree === preset.sharedAcrossTree &&
      scenario.shareableLink === preset.shareableLink &&
      scenario.serverOwned === preset.serverOwned &&
      scenario.remoteFreshness === preset.remoteFreshness &&
      scenario.affectsManyBranches === preset.affectsManyBranches &&
      scenario.ephemeralDraft === preset.ephemeralDraft
    );
  }

  function update<Key extends keyof PlacementScenario>(
    key: Key,
    value: PlacementScenario[Key],
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
            {advisorPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setScenario({ ...preset })}
                className={clsx(
                  'rounded-xl border px-3 py-3 text-left text-sm transition',
                  isPresetActive(preset)
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
          <div className="space-y-3">
            {(
              [
                ['sharedAcrossTree', 'Нужно нескольким веткам дерева'],
                ['shareableLink', 'Состояние должно жить в ссылке'],
                ['serverOwned', 'Источник истины находится на сервере'],
                ['remoteFreshness', 'Нужны refetch и актуальность данных'],
                ['affectsManyBranches', 'Изменение влияет на несколько далёких секций'],
                ['ephemeralDraft', 'Это временный черновик или раскрытие'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <input
                  type="checkbox"
                  checked={scenario[key]}
                  onChange={(event) => update(key, event.target.checked)}
                />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                Рекомендуемое место: {recommendation.primary}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {recommendation.summary}
              </p>
            </div>
            <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Почему</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {recommendation.reasons.map((reason) => (
                <li
                  key={reason}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Риск неверного выбора</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {recommendation.risks.map((risk) => (
                <li
                  key={risk}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
