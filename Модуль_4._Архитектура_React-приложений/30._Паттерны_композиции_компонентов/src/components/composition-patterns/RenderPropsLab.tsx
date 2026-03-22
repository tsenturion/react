import clsx from 'clsx';
import { useState } from 'react';

import { renderItems } from '../../lib/pattern-domain';
import { MetricCard, StatusPill } from '../ui';
import { SelectionLens } from './SelectionLens';

export function RenderPropsLab() {
  const [renderMode, setRenderMode] = useState<'cards' | 'audit' | 'story'>('cards');

  return (
    <SelectionLens items={renderItems} initialId={renderItems[0]!.id}>
      {({ items, selected, totalExamples, select }) => (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="success">success</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Render props оставляют компоненту логику, но возвращают caller-у полную
              свободу в том, как рисовать результат.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Выбор сущности
                </p>
                <div className="mt-4 grid gap-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => select(item.id)}
                      className={clsx(
                        'rounded-xl border px-3 py-3 text-left text-sm transition',
                        selected.id === item.id
                          ? 'border-blue-500 bg-blue-50 text-blue-950'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                      )}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Render mode
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(['cards', 'audit', 'story'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setRenderMode(mode)}
                      className={clsx(
                        'rounded-xl px-3 py-2 text-sm font-medium transition',
                        renderMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {renderMode === 'cards' ? (
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Card rendering</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">
                    {selected.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selected.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.examples.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {renderMode === 'audit' ? (
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Audit rendering</p>
                  <div className="mt-4 grid gap-3 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Summary
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {selected.summary}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                        Risk
                      </p>
                      <p className="mt-2 text-sm leading-6 text-amber-950">
                        {selected.risk}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {renderMode === 'story' ? (
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Story rendering</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    <strong>{selected.title}</strong> нужен там, где один и тот же слой
                    поведения должен жить дольше, чем конкретный визуальный шаблон. Прямо
                    сейчас render prop позволяет взять данные из SelectionLens и собрать
                    из них совершенно другую подачу без переписывания логики выбора.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Markup owner"
              value="Caller"
              hint="Компонент-владелец отдаёт наружу данные и действия, а caller сам решает final render."
              tone="cool"
            />
            <MetricCard
              label="Всего примеров"
              value={String(totalExamples)}
              hint="Одна логика выбора остаётся общей независимо от текущего render mode."
            />
            <MetricCard
              label="Главный риск"
              value="Noisy JSX"
              hint="Если render functions становятся слишком глубокими, API начинает шуметь сильнее, чем помогает."
              tone="accent"
            />
          </div>
        </div>
      )}
    </SelectionLens>
  );
}
