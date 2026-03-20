import { useState } from 'react';

import { ConditionalLessonPanel } from '../components/lists/ConditionalLessonPanel';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildConditionalViewModel,
  defaultConditionalControls,
  type ConditionalControls,
} from '../lib/conditional-model';
import { getProjectStudy } from '../lib/project-study';

const toggleLabels: Record<
  keyof Pick<
    ConditionalControls,
    'isLoading' | 'showReviewBadge' | 'showMentor' | 'isArchived'
  >,
  string
> = {
  isLoading: 'Показать состояние загрузки',
  showReviewBadge: 'Показать badge live review',
  showMentor: 'Показать ментора',
  isArchived: 'Показать архивную заметку',
};

export function ConditionalRenderingPage() {
  const [controls, setControls] = useState<ConditionalControls>(
    defaultConditionalControls,
  );
  const viewModel = buildConditionalViewModel(controls);
  const study = getProjectStudy('conditions');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Условия через if, ternary и &&"
        copy="Условный рендеринг не означает хаотичные ветки внутри JSX. Здесь можно отдельно включать загрузку, badge live review, блок ментора и архивную заметку, а затем сразу видеть, какой синтаксис за что отвечает."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Условия</h2>

          {(
            [
              ['isLoading', controls.isLoading],
              ['showReviewBadge', controls.showReviewBadge],
              ['showMentor', controls.showMentor],
              ['isArchived', controls.isArchived],
            ] as const
          ).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-medium">{toggleLabels[key]}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }))
                }
              />
            </label>
          ))}

          <label className="space-y-2 text-sm text-slate-700">
            <span className="flex items-center justify-between font-medium">
              Осталось мест
              <span className="text-slate-500">{controls.seatsLeft}</span>
            </span>
            <input
              type="range"
              min={0}
              max={16}
              value={controls.seatsLeft}
              onChange={(event) =>
                setControls((current) => ({
                  ...current,
                  seatsLeft: Number(event.target.value),
                }))
              }
              className="w-full"
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Видимых блоков"
              value={String(viewModel.visibleBlocks.length)}
              hint="Сколько веток интерфейса попало в финальный рендер."
              tone="cool"
            />
            <MetricCard
              label="Количество веток"
              value={String(viewModel.branchCount)}
              hint="Даже простая карточка использует несколько независимых условий."
            />
            <MetricCard
              label="Статус мест"
              value={controls.seatsLeft > 0 ? 'запись открыта' : 'только waitlist'}
              hint="Этот блок меняется через тернарный оператор."
              tone="accent"
            />
          </div>

          <ConditionalLessonPanel viewModel={viewModel} />
          <CodeBlock label="Условный рендеринг в компоненте" code={viewModel.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
