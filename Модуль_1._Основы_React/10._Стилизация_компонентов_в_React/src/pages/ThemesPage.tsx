import { useState } from 'react';

import { ThemeStage } from '../components/styling/ThemeStage';
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
  buildThemeReport,
  defaultThemeControls,
  type ThemeControls,
} from '../lib/theme-model';
import { getProjectStudy } from '../lib/project-study';

export function ThemesPage() {
  const [controls, setControls] = useState<ThemeControls>(defaultThemeControls);
  const report = buildThemeReport(controls);
  const study = getProjectStudy('themes');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Переключение тем и CSS variables"
        copy="Когда тема собрана через CSS variables, компоненту не нужно знать точные цвета каждой темы. Достаточно читать токены из контейнера, и одно и то же дерево интерфейса получает новый внешний вид без смены JSX."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Тема контейнера</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Theme</span>
            <select
              value={controls.theme}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  theme: event.target.value as ThemeControls['theme'],
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {(['paper', 'graphite', 'signal'] as const).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Density</span>
            <select
              value={controls.density}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  density: event.target.value as ThemeControls['density'],
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {(['comfortable', 'compact'] as const).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Поднять поверхности тенью</span>
            <input
              type="checkbox"
              checked={controls.elevated}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  elevated: event.target.checked,
                }))
              }
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Токенов"
              value={String(report.tokenCount)}
              hint="Столько переменных тема отдаёт компонентам прямо сейчас."
              tone="cool"
            />
            <MetricCard
              label="Theme"
              value={controls.theme}
              hint="Компонент читает тему из контейнера через data-атрибут."
            />
            <MetricCard
              label="Поверхности"
              value={controls.elevated ? 'elevated' : 'flat'}
              hint="Один дополнительный флаг меняет ощущение глубины без переписывания разметки."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>CSS variables</StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            </div>

            <ListBlock
              title="Текущие токены темы"
              items={report.tokens.map((token) => `${token.name}: ${token.value}`)}
            />
          </Panel>

          <ThemeStage controls={controls} />
          <CodeBlock label="Контейнер темы" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
