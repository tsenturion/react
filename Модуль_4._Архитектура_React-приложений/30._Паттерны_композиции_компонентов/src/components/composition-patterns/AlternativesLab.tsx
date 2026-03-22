import clsx from 'clsx';
import { useState } from 'react';

import { requirementPresets, type PatternRequirements } from '../../lib/pattern-domain';
import { recommendCompositionPattern } from '../../lib/pattern-recommendation-model';
import { MetricCard, StatusPill } from '../ui';

function isPresetActive(
  current: PatternRequirements,
  preset: (typeof requirementPresets)[number],
) {
  return (
    current.sharedSubparts === preset.sharedSubparts &&
    current.callerControlsMarkup === preset.callerControlsMarkup &&
    current.logicReuseOnly === preset.logicReuseOnly &&
    current.needInjectIntoChildren === preset.needInjectIntoChildren &&
    current.legacyInterop === preset.legacyInterop &&
    current.strongTypingPriority === preset.strongTypingPriority
  );
}

export function AlternativesLab() {
  const [requirements, setRequirements] = useState<PatternRequirements>({
    ...requirementPresets[0]!,
  });
  const recommendation = recommendCompositionPattern(requirements);

  function update<Key extends keyof PatternRequirements>(
    key: Key,
    value: PatternRequirements[Key],
  ) {
    setRequirements((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Быстрые пресеты
          </p>
          <div className="mt-4 grid gap-2">
            {requirementPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setRequirements({ ...preset })}
                className={clsx(
                  'rounded-xl border px-3 py-3 text-left text-sm transition',
                  isPresetActive(requirements, preset)
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
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={requirements.sharedSubparts}
                onChange={(event) => update('sharedSubparts', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Есть связанный набор subcomponents
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={requirements.callerControlsMarkup}
                onChange={(event) => update('callerControlsMarkup', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Caller должен полностью контролировать markup
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={requirements.logicReuseOnly}
                onChange={(event) => update('logicReuseOnly', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Нужно переиспользовать только поведение
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={requirements.needInjectIntoChildren}
                onChange={(event) =>
                  update('needInjectIntoChildren', event.target.checked)
                }
              />
              <span className="text-sm text-slate-700">
                Нужно модифицировать прямых children
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={requirements.legacyInterop}
                onChange={(event) => update('legacyInterop', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Есть legacy/framework wrapper-требование
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={requirements.strongTypingPriority}
                onChange={(event) => update('strongTypingPriority', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Важна строгая и прозрачная типизация API
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                Рекомендуемый подход: {recommendation.primary}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {recommendation.summary}
              </p>
            </div>
            <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Shared parts"
            value={requirements.sharedSubparts ? 'yes' : 'no'}
            hint="Compound pattern нужен только там, где части действительно составляют одну surface-модель."
            tone="cool"
          />
          <MetricCard
            label="Markup control"
            value={requirements.callerControlsMarkup ? 'caller' : 'component'}
            hint="Render props оправданы там, где caller должен полностью владеть итоговым markup."
          />
          <MetricCard
            label="Legacy pressure"
            value={requirements.legacyInterop ? 'present' : 'none'}
            hint="HOC чаще всего всплывают как адаптер к уже существующему или legacy-коду."
            tone="accent"
          />
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
            <p className="text-sm font-semibold text-slate-900">Что рассмотреть рядом</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {recommendation.alternatives.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
