import { useState } from 'react';

import { MarketingCard } from '../components/styling/MarketingCard';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildClassNameViewModel,
  defaultClassNameControls,
  type ClassNameControls,
} from '../lib/class-name-model';
import { getProjectStudy } from '../lib/project-study';

export function ClassNamePage() {
  const [controls, setControls] = useState<ClassNameControls>(defaultClassNameControls);
  const report = buildClassNameViewModel(controls);
  const study = getProjectStudy('class-name');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="className и обычные CSS-файлы"
        copy="Это самый прямой путь стилизации в React: компонент собирает набор модификаторов через `className`, а внешний вид описан в CSS-файле. Здесь можно менять акцент, плотность и силу акцента и сразу видеть, как один и тот же JSX получает другой визуальный результат."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Параметры карточки</h2>

          {(
            [
              ['accent', ['ocean', 'amber', 'forest']],
              ['density', ['comfortable', 'compact']],
              ['emphasis', ['soft', 'strong']],
            ] as const
          ).map(([key, options]) => (
            <label key={key} className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">{key}</span>
              <select
                value={controls[key]}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Добавить outline</span>
            <input
              type="checkbox"
              checked={controls.outlined}
              onChange={(event) =>
                setControls((current) => ({ ...current, outlined: event.target.checked }))
              }
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Показывать meta-теги</span>
            <input
              type="checkbox"
              checked={controls.showMeta}
              onChange={(event) =>
                setControls((current) => ({ ...current, showMeta: event.target.checked }))
              }
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Модификаторов"
              value={String(report.modifierCount)}
              hint="Столько классов поверх базового `marketing-card` сейчас активны."
              tone="cool"
            />
            <MetricCard
              label="Подход"
              value="className"
              hint="JSX управляет только набором классов, а не самими CSS-правилами."
            />
            <MetricCard
              label="Источник стилей"
              value="CSS file"
              hint="Внешний вид живёт в отдельном stylesheet, подключённом к компоненту."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>global CSS + modifiers</StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            </div>

            <ListBlock
              title="Когда этот подход особенно удобен"
              items={[
                'Когда у компонента есть понятные визуальные модификаторы: tone, density, emphasis.',
                'Когда нужно держать JSX коротким, а сами CSS-правила читать отдельно от логики.',
                'Когда стили больше похожи на набор статических деклараций, чем на runtime-вычисления.',
              ]}
            />
          </Panel>

          <MarketingCard controls={controls} />
          <CodeBlock label="Сборка className" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
