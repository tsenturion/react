import { useState } from 'react';

import { GlobalScopeDemo } from '../components/styling/GlobalScopeDemo';
import { ModulePreviewCard } from '../components/styling/ModulePreviewCard';
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
  buildCssModulesReport,
  defaultCssModulesControls,
  type CssModulesControls,
} from '../lib/css-modules-model';
import { getProjectStudy } from '../lib/project-study';

export function CssModulesPage() {
  const [controls, setControls] = useState<CssModulesControls>(defaultCssModulesControls);
  const report = buildCssModulesReport(controls);
  const study = getProjectStudy('modules');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="CSS Modules и изоляция стилей"
        copy="CSS Modules нужны не ради новой синтаксической формы, а ради локальности. Здесь рядом живут глобальный `.title` и module-класс `.title`, и можно увидеть, как module-вариант изолируется от общего CSS."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Настройки module-компонента
          </h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Tone</span>
            <select
              value={controls.tone}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  tone: event.target.value as CssModulesControls['tone'],
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {(['teal', 'amber', 'slate'] as const).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {(
            [
              ['compact', 'Сделать компактным'],
              ['withRibbon', 'Показать ribbon'],
              ['loudGlobalTitle', 'Усилить глобальный `.title`'],
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
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }))
                }
              />
            </label>
          ))}
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Локальных правил"
              value={String(report.isolatedRules)}
              hint="Столько модульных CSS-правил влияет на компонент прямо сейчас."
              tone="cool"
            />
            <MetricCard
              label="Изоляция"
              value="hashed names"
              hint="Module-классы превращаются в локальные имена и не пересекаются с глобальными."
            />
            <MetricCard
              label="Риск конфликта"
              value={controls.loudGlobalTitle ? 'под контролем' : 'пока низкий'}
              hint="Даже при шумном глобальном `.title` локальная версия не меняется."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>style isolation</StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.collisionRisk}</p>
            </div>

            <ListBlock
              title="Где CSS Modules особенно сильны"
              items={[
                'Когда у прикладного компонента есть локальные `.title`, `.note`, `.badge` и подобные имена.',
                'Когда хочется писать обычный CSS, но без страха случайно задеть соседние экраны.',
                'Когда компонент живёт долго и должен быть изолирован от внешнего stylesheet-шумa.',
              ]}
            />
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <GlobalScopeDemo loud={controls.loudGlobalTitle} />
            <ModulePreviewCard
              tone={controls.tone}
              compact={controls.compact}
              withRibbon={controls.withRibbon}
            />
          </div>

          <CodeBlock label="Подключение CSS Module" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
