import { useState } from 'react';

import { BoundaryMap } from '../components/architecture/BoundaryMap';
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
  analyzeComponentArchitecture,
  decompositionStrategies,
  screenPresets,
  type DecompositionStrategy,
  type ScreenPresetId,
} from '../lib/component-architecture-model';
import { projectStudy } from '../lib/project-study';

export function ThinkingComponentsPage() {
  const [presetId, setPresetId] = useState<ScreenPresetId>('catalog');
  const [strategy, setStrategy] = useState<DecompositionStrategy>('balanced');

  const scenario = analyzeComponentArchitecture(presetId, strategy);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Thinking in Components"
        title="Где проводить границы компонентов"
        copy="Правильное деление экрана не ищет максимальное число файлов и не складывает всё в один render. Оно ищет границы ответственности: где меняются данные, где начинается отдельная часть UI и где компонент действительно становится независимым."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {scenario.tone === 'success'
                ? 'Границы близки к рабочим'
                : scenario.tone === 'warn'
                  ? 'Монолит начинает мешать'
                  : 'Дерево дробится слишком сильно'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Сейчас выбран экран «{scenario.preset.label}» и стратегия деления «
              {decompositionStrategies.find((item) => item.id === strategy)?.label}
              ».
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Тип экрана</p>
            <div className="flex flex-wrap gap-2">
              {screenPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPresetId(preset.id)}
                  className={`chip ${presetId === preset.id ? 'chip-active' : ''}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {scenario.preset.description}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Стратегия деления</p>
            <div className="flex flex-wrap gap-2">
              {decompositionStrategies.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStrategy(item.id)}
                  className={`chip ${strategy === item.id ? 'chip-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {decompositionStrategies.find((item) => item.id === strategy)?.description}
            </p>
          </div>
        </div>

        <BoundaryMap parts={scenario.parts} groups={scenario.groups} />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Число компонентов"
          value={scenario.componentCount}
          hint="Важно не количество само по себе, а осмысленные границы дерева."
          tone="accent"
        />
        <MetricCard
          label="Поверхность props"
          value={scenario.propSurface}
          hint="Сколько связей между узлами приходится удерживать глазами."
          tone="cool"
        />
        <MetricCard
          label="Изоляция изменений"
          value={scenario.changeIsolation}
          hint="Насколько локально можно менять одну часть экрана, не ломая остальное."
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Компонентный состав" items={scenario.componentList} />
        </Panel>
        <Panel>
          <ListBlock title="Что выигрываете" items={scenario.wins} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Где начинаются проблемы" items={scenario.risks} />
        </Panel>
        <Panel>
          <BeforeAfter
            beforeTitle="Неудачная граница"
            before={scenario.before}
            afterTitle="Осмысленная граница"
            after={scenario.after}
          />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy
          files={projectStudy.architecture.files}
          snippets={projectStudy.architecture.snippets}
        />
      </Panel>
    </div>
  );
}
