import { useState } from 'react';

import { BooleanSoupCallout } from '../components/composition/BooleanSoupCallout';
import { Callout } from '../components/composition/Callout';
import {
  BeforeAfter,
  CodeBlock,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildApiComparison,
  defaultBooleanSoupState,
  defaultCleanApiState,
  type BooleanSoupState,
  type CleanApiState,
} from '../lib/api-design-model';
import { getProjectStudy } from '../lib/project-study';

export function ApiDesignPage() {
  const [badState, setBadState] = useState<BooleanSoupState>(defaultBooleanSoupState);
  const [goodState, setGoodState] = useState<CleanApiState>(defaultCleanApiState);
  const comparison = buildApiComparison(badState, goodState);
  const study = getProjectStudy('api-design');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Как проектировать API компонента"
        copy="Хороший API делает смысл компонента явным. Плохой API заставляет угадывать, какой из десятка флагов важнее и как они должны сочетаться между собой."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Boolean soup</h2>
          {(
            [
              ['isInfo', badState.isInfo],
              ['isSuccess', badState.isSuccess],
              ['isWarning', badState.isWarning],
              ['isDanger', badState.isDanger],
              ['dense', badState.dense],
              ['centered', badState.centered],
              ['withBorder', badState.withBorder],
            ] as const
          ).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-medium">{key}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(event) =>
                  setBadState((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }))
                }
              />
            </label>
          ))}

          <h2 className="pt-2 text-lg font-semibold text-slate-900">Чистый API</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">tone</span>
            <select
              value={goodState.tone}
              onChange={(event) =>
                setGoodState((current) => ({
                  ...current,
                  tone: event.target.value as CleanApiState['tone'],
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['info', 'success', 'warning', 'danger'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">density</span>
            <select
              value={goodState.density}
              onChange={(event) =>
                setGoodState((current) => ({
                  ...current,
                  density: event.target.value as CleanApiState['density'],
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['comfortable', 'compact'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">align</span>
            <select
              value={goodState.align}
              onChange={(event) =>
                setGoodState((current) => ({
                  ...current,
                  align: event.target.value as CleanApiState['align'],
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['start', 'center'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-2">
            <BooleanSoupCallout title="Проблемный API" {...badState}>
              Компонент вынужден сам разрешать конфликты между флагами.
            </BooleanSoupCallout>
            <Callout title="Явный API" {...goodState}>
              Один проп отвечает за смысловой вариант, другие за layout и плотность.
            </Callout>
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Проблемы boolean soup
            </h2>
            {comparison.badWarnings.length > 0 ? (
              <div className="space-y-3">
                {comparison.badWarnings.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-emerald-300 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                Конфликтов нет, но API всё равно сложнее для чтения, чем явные `tone`,
                `density` и `align`.
              </div>
            )}
          </Panel>

          <BeforeAfter
            beforeTitle="Набор флагов"
            before="`isInfo`, `isSuccess`, `isDanger` и другие булевы props растут без общего контракта. Компоненту приходится разруливать конфликты самостоятельно."
            afterTitle="Явный контракт"
            after="`tone`, `density`, `align` и `border` дают один способ выразить намерение. API легче документировать, типизировать и расширять."
          />

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Плохой API" code={comparison.badSnippet} />
            <CodeBlock label="Хороший API" code={comparison.goodSnippet} />
          </div>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
