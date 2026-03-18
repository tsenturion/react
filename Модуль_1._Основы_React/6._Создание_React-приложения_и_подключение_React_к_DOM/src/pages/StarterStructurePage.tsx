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
  analyzeStarterStructure,
  starterStructures,
  type StarterStructureId,
} from '../lib/starter-structure-model';
import { projectStudy } from '../lib/project-study';

export function StarterStructurePage() {
  const [presetId, setPresetId] = useState<StarterStructureId>('recommended');
  const scenario = analyzeStarterStructure(presetId);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Starter Structure"
        title="Как выглядит первое React-приложение в файлах"
        copy="На старте важно не только создать root, но и сохранить читаемую структуру: `index.html` даёт shell, `main.tsx` подключает React к DOM, `App.tsx` открывает дерево интерфейса, а дальше начинается обычная компонентная архитектура."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {scenario.tone === 'success'
                ? 'Структура прозрачна'
                : scenario.tone === 'warn'
                  ? 'Стартовая структура уже начинает перегружаться'
                  : 'Граница HTML и React размыта'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              {scenario.preset.description}
            </p>
          </div>
        }
      />

      <Panel className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {starterStructures.map((item) => (
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

        <div className="grid gap-4 lg:grid-cols-5">
          {scenario.recommendedChain.map((part) => (
            <div
              key={part}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
            >
              {part}
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Ясность ролей"
          value={scenario.clarity}
          hint="Насколько легко глазами отделить bootstrap от UI-дерева."
          tone="accent"
        />
        <MetricCard
          label="Масштабируемость"
          value={scenario.scalability}
          hint="Насколько спокойно такая структура переживает следующие экраны и компоненты."
          tone="cool"
        />
        <MetricCard
          label="Root visibility"
          value={presetId === 'recommended' ? 'Высокая' : 'Снижается'}
          hint="Чем чище `main.tsx`, тем проще увидеть сам момент подключения React к DOM."
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Роли файлов" items={scenario.fileRoles} />
        </Panel>
        <Panel>
          <ListBlock title="Где начинаются риски" items={scenario.risks} />
        </Panel>
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Смешанные роли"
          before={scenario.before}
          afterTitle="Чёткая стартовая цепочка"
          after={scenario.after}
        />
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.structure.files}
          snippets={projectStudy.structure.snippets}
        />
      </Panel>
    </div>
  );
}
