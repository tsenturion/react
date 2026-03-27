import { useState } from 'react';

import { InlineSurface } from '../components/styling/InlineSurface';
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
  buildInlineStyleReport,
  defaultInlineControls,
  type InlineControls,
} from '../lib/inline-style-model';
import { getProjectStudy } from '../lib/project-study';

export function InlineStylesPage() {
  const [controls, setControls] = useState<InlineControls>(defaultInlineControls);
  const report = buildInlineStyleReport(controls);
  const study = getProjectStudy('inline');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Inline styles и динамические значения"
        copy="`style={{...}}` полезен там, где внешний вид зависит от чисел в рантайме: прогресса, hue, радиуса, позиции, transform и подобных значений. Здесь можно менять параметры и сразу видеть, как JSX передаёт новые style-объекты в компонент."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Runtime-параметры</h2>

          {(
            [
              ['hue', 0, 320],
              ['radius', 12, 40],
              ['progress', 12, 100],
              ['glow', 8, 56],
            ] as const
          ).map(([key, min, max]) => (
            <label key={key} className="space-y-2 text-sm text-slate-700">
              <span className="flex items-center justify-between font-medium">
                {key}
                <span className="text-slate-500">{controls[key]}</span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                value={controls[key]}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    [key]: Number(event.target.value),
                  }))
                }
                className="w-full"
              />
            </label>
          ))}
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Свойств style"
              value={String(report.stylePropertyCount)}
              hint="Столько runtime-свойств сейчас собирает компонент."
              tone="cool"
            />
            <MetricCard
              label="Цветовая зона"
              value={report.accentLabel}
              hint="Оттенок вычисляется прямо из числового hue."
            />
            <MetricCard
              label="Режим"
              value="runtime values"
              hint="Здесь inline styles полезнее, чем длинный набор одноразовых классов."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>style={'{...}'}</StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            </div>

            <ListBlock
              title="Границы подхода"
              items={[
                'Удобно для чисел и коротких runtime-вычислений.',
                'Неудобно для `:hover`, media queries и длинных variant systems.',
                'Лучше сочетать с обычными классами, если часть стилей статична.',
              ]}
            />
          </Panel>

          <InlineSurface controls={controls} />
          <CodeBlock label="Inline style object" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
