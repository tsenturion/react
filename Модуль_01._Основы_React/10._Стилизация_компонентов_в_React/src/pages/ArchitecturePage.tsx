import { useState } from 'react';

import { RecipeButton } from '../components/styling/RecipeButton';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  architecturePresets,
  buildArchitectureReport,
  defaultArchitectureControls,
  type ArchitectureControls,
  type ArchitecturePresetId,
} from '../lib/styling-architecture-model';
import { getProjectStudy } from '../lib/project-study';

export function ArchitecturePage() {
  const [controls, setControls] = useState<ArchitectureControls>(
    defaultArchitectureControls,
  );
  const [activePreset, setActivePreset] = useState<ArchitecturePresetId | 'custom'>(
    'ui-kit',
  );
  const report = buildArchitectureReport(controls);
  const study = getProjectStudy('architecture');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Архитектура стилизации и выбор подхода"
        copy="У стилизации нет одного правильного инструмента на все случаи. Здесь можно переключать требования компонента и смотреть, почему для одной задачи достаточно `className + CSS`, а для другой лучше CSS Modules, inline styles или гибридная схема с recipe-функциями."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Быстрые пресеты</h2>
            {(
              Object.entries(architecturePresets) as [
                ArchitecturePresetId,
                (typeof architecturePresets)[ArchitecturePresetId],
              ][]
            ).map(([id, preset]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setControls(preset.state);
                  setActivePreset(id);
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  activePreset === id
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-sm font-semibold">{preset.label}</span>
              </button>
            ))}
          </div>

          {(
            [
              ['isolated', 'Нужна изоляция стилей'],
              ['manyStates', 'Много визуальных состояний'],
              ['runtimeValues', 'Есть runtime-числа'],
              ['sharedTheme', 'Есть общая тема'],
              ['pseudoStates', 'Нужны hover/focus/active'],
              ['crossProjectReuse', 'Нужно переиспользование'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-medium">{label}</span>
              <input
                type="checkbox"
                checked={controls[key]}
                onChange={(event) => {
                  setControls((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }));
                  setActivePreset('custom');
                }}
              />
            </label>
          ))}
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Рекомендация"
              value={report.recommended.title}
              hint="Подход выбран по текущим требованиям, а не по абстрактной популярности."
              tone="cool"
            />
            <MetricCard
              label="Лучший score"
              value={String(report.recommended.score)}
              hint="Это итоговая оценка по изоляции, состояниям, темам и runtime-значениям."
            />
            <MetricCard
              label="Preset"
              value={
                activePreset === 'custom'
                  ? 'custom'
                  : architecturePresets[activePreset].label
              }
              hint="Можно начать с пресета, а затем вручную менять требования."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>{report.recommended.title}</StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {report.approaches.map((approach) => (
                <div
                  key={approach.id}
                  className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {approach.title}
                    </p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {approach.score}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {approach.reason}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <BeforeAfter
            beforeTitle="Если смешать всё в JSX"
            before="Состояния, варианты и визуальные условия быстро превращаются в длинную строку классов с вложенными тернарными операторами."
            afterTitle="Если вынести recipe"
            after="Варианты и состояние описываются маленькими словарями и предсказуемо собираются в один `className`."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <CodeBlock label="Анти-паттерн" code={report.antiPattern} />
            <CodeBlock label="Более чистый recipe" code={report.cleanPattern} />
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Recipe component</h2>
            <RecipeButton
              tone={
                controls.sharedTheme
                  ? 'brand'
                  : controls.manyStates
                    ? 'danger'
                    : 'neutral'
              }
              density={controls.crossProjectReuse ? 'comfortable' : 'compact'}
              selected={controls.manyStates}
              disabled={controls.runtimeValues && !controls.sharedTheme}
            />
          </Panel>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
