import { useState } from 'react';

import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  diagnoseStartupIssue,
  diagnosticPresets,
  type DiagnosticPresetId,
} from '../lib/startup-diagnostics-model';
import { projectStudy } from '../lib/project-study';

export function DiagnosticsPage() {
  const [presetId, setPresetId] = useState<DiagnosticPresetId>('missing-root');
  const scenario = diagnoseStartupIssue(presetId);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Startup Diagnostics"
        title="Типовые ошибки подключения React к DOM"
        copy="Не каждая ошибка старта ломает приложение одинаково. Иногда React вовсе не монтируется, иногда root создаётся повторно, а иногда проблема заметна только потому, что StrictMode в development показывает нечистый код. Выберите тип сбоя и посмотрите, что именно происходит."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>{scenario.preset.label}</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              {scenario.preset.description}
            </p>
          </div>
        }
      />

      <Panel className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {diagnosticPresets.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPresetId(item.id)}
              className={`chip ${presetId === item.id ? 'chip-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Симптом"
          value={
            scenario.tone === 'error' ? 'Старт блокируется' : 'Поведение нестабильно'
          }
          hint={scenario.symptom}
          tone="accent"
        />
        <MetricCard
          label="Где искать"
          value={scenario.whereToLook.join(', ')}
          hint="Это файлы текущего проекта, где аналогичная точка уже реализована корректно."
          tone="cool"
        />
        <MetricCard
          label="Тип исправления"
          value={scenario.tone === 'error' ? 'Bootstrap fix' : 'Runtime discipline'}
          hint={scenario.fix}
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock
            title="Что именно ломается"
            items={[scenario.symptom, scenario.cause]}
          />
        </Panel>
        <Panel>
          <ListBlock
            title="Как чинить"
            items={[scenario.fix, `Смотрите файлы: ${scenario.whereToLook.join(' → ')}`]}
          />
        </Panel>
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Проблемное состояние"
          before={scenario.before}
          afterTitle="Исправленное состояние"
          after={scenario.after}
        />
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.diagnostics.files}
          snippets={projectStudy.diagnostics.snippets}
        />
      </Panel>
    </div>
  );
}
