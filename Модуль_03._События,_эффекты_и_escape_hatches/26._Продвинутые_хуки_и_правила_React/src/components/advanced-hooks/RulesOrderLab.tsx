import clsx from 'clsx';
import { useState } from 'react';

import {
  buildHookOrder,
  compareHookOrders,
  hookRulePresets,
  type HookRulePresetId,
} from '../../lib/hook-rules-model';
import { MetricCard, StatusPill } from '../ui';

export function RulesOrderLab() {
  const [presetId, setPresetId] = useState<HookRulePresetId>('stable-top-level');
  const [firstVariant, setFirstVariant] = useState<number | boolean>(false);
  const [secondVariant, setSecondVariant] = useState<number | boolean>(true);

  const firstOrder = buildHookOrder(presetId, firstVariant);
  const secondOrder = buildHookOrder(presetId, secondVariant);
  const comparison = compareHookOrders(firstOrder, secondOrder);

  const usesCountControls = presetId === 'hook-in-loop';

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Главный принцип"
          value="Top-level only"
          hint="React связывает состояние hook-а не с именем, а с позицией вызова в дереве."
          tone="cool"
        />
        <MetricCard
          label="Симулятор"
          value="Без нарушения runtime"
          hint="Сам урок остаётся валидным, поэтому smell моделируется чистой функцией."
        />
        <MetricCard
          label="Результат"
          value={comparison.changedSlots.length === 0 ? 'Стабильно' : 'Сдвиг'}
          hint="Любой сдвиг слотов означает нарушение rules of hooks."
          tone={comparison.changedSlots.length === 0 ? 'cool' : 'accent'}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Сценарий
            </p>
            <div className="mt-4 grid gap-2">
              {hookRulePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPresetId(preset.id)}
                  className={clsx(
                    'rounded-xl border px-3 py-3 text-left text-sm transition',
                    presetId === preset.id
                      ? 'border-blue-500 bg-blue-50 text-blue-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  )}
                >
                  <span className="block font-medium">{preset.label}</span>
                  <span className="mt-1 block leading-5 text-slate-500">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Два рендера
            </p>

            {usesCountControls ? (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Render A: элементов
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={Number(firstVariant)}
                    onChange={(event) => setFirstVariant(Number(event.target.value))}
                    className="mt-2 w-full"
                  />
                  <span className="mt-2 block text-sm text-slate-600">
                    {String(firstVariant)}
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Render B: элементов
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={Number(secondVariant)}
                    onChange={(event) => setSecondVariant(Number(event.target.value))}
                    className="mt-2 w-full"
                  />
                  <span className="mt-2 block text-sm text-slate-600">
                    {String(secondVariant)}
                  </span>
                </label>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <span className="text-sm font-medium text-slate-700">Render A</span>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(firstVariant)}
                      onChange={(event) => setFirstVariant(event.target.checked)}
                    />
                    <span className="text-sm text-slate-600">
                      Включить дополнительную ветку
                    </span>
                  </div>
                </label>

                <label className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <span className="text-sm font-medium text-slate-700">Render B</span>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(secondVariant)}
                      onChange={(event) => setSecondVariant(event.target.checked)}
                    />
                    <span className="text-sm text-slate-600">
                      Включить дополнительную ветку
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl font-semibold text-slate-900">
                  {comparison.headline}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Порядок сравнивается по слотам. Если во втором рендере slot 2 уже занят
                  другим hook-ом, React больше не может безопасно сопоставить состояние.
                </p>
              </div>
              <StatusPill tone={comparison.tone}>{comparison.tone}</StatusPill>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Render A</p>
              <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {firstOrder.map((item, index) => (
                  <li
                    key={`a-${item}-${index}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    Slot {index + 1}: {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Render B</p>
              <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {secondOrder.map((item, index) => (
                  <li
                    key={`b-${item}-${index}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    Slot {index + 1}: {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Сдвинутые слоты</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {comparison.changedSlots.length > 0 ? (
                comparison.changedSlots.map((slot) => (
                  <li
                    key={`shift-${slot.slot}`}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
                  >
                    Slot {slot.slot}: было `{slot.first}`, стало `{slot.second}`
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
                  Слоты не меняются: React может безопасно сопоставить состояние.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
