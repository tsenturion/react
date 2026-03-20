import { useState } from 'react';

import { StateDemoButton } from '../components/styling/StateDemoButton';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildConditionalStyleReport,
  defaultConditionalStyleControls,
  type ConditionalStyleControls,
} from '../lib/conditional-style-model';
import { getProjectStudy } from '../lib/project-study';

export function ConditionalStylingPage() {
  const [controls, setControls] = useState<ConditionalStyleControls>(
    defaultConditionalStyleControls,
  );
  const report = buildConditionalStyleReport(controls);
  const study = getProjectStudy('conditional');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Conditional styling и влияние состояния на внешний вид"
        copy="Состояние меняет не только текст и поведение компонента, но и его визуальную форму. Здесь можно комбинировать `selected`, `busy`, `disabled`, `compact` и смотреть, как один и тот же компонент собирает разные классы без потери читаемости."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Состояния</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Tone</span>
            <select
              value={controls.tone}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  tone: event.target.value as ConditionalStyleControls['tone'],
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {(['neutral', 'success', 'danger'] as const).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {(
            [
              ['selected', 'Отметить как selected'],
              ['busy', 'Показать busy-состояние'],
              ['disabled', 'Заблокировать компонент'],
              ['compact', 'Сделать компактным'],
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
              label="Активных состояний"
              value={String(report.activeStateCount)}
              hint="Чем их больше, тем важнее держать variant map отдельно от JSX."
              tone="cool"
            />
            <MetricCard
              label="Tone"
              value={controls.tone}
              hint="Базовая палитра тоже часть variant system."
            />
            <MetricCard
              label="Риск"
              value={controls.disabled && controls.busy ? 'конфликт' : 'контроль'}
              hint="Некоторые комбинации состояний лучше подсвечивать явно, а не прятать в CSS."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>state → appearance</StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
              {report.warning}
            </div>
          </Panel>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
            <StateDemoButton controls={controls} />
          </Panel>

          <CodeBlock label="Conditional className" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
