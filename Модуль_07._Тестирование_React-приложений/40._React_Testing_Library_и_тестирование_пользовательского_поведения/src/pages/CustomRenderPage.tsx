import { useMemo, useState } from 'react';

import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { ProviderHarnessLab } from '../components/testing-library/ProviderHarnessLab';
import { projectStudyByLab } from '../lib/project-study';
import { recommendCustomRender, type CustomRenderInput } from '../lib/rtl-runtime';
import { LessonTestPreferencesProvider } from '../state/LessonTestPreferencesContext';

export function CustomRenderPage() {
  const [input, setInput] = useState<CustomRenderInput>({
    needsRouter: true,
    needsProvider: true,
    repeatedSetup: true,
    mixesUserPaths: false,
  });

  const recommendation = useMemo(() => recommendCustomRender(input), [input]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Custom Render"
        title="Helper нужен тогда, когда он убирает повторяемый setup, а не прячет смысл теста"
        copy="Если компонент постоянно требует router и provider, helper делает тест короче. Если окружение и так простое, лишняя абстракция только мешает читать сценарий."
        aside={<StatusPill tone="success">{recommendation.model}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Setup pressure"
          value={String(
            Number(input.needsRouter) +
              Number(input.needsProvider) +
              Number(input.repeatedSetup) +
              Number(input.mixesUserPaths),
          )}
          hint="Чем больше повторяемого окружения, тем полезнее focused helper."
        />
        <MetricCard
          label="Score"
          value={String(recommendation.score)}
          hint={recommendation.rationale}
          tone="accent"
        />
        <MetricCard
          label="Main caution"
          value="no giant wrappers"
          hint={recommendation.caution}
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Нагрузите test setup и посмотрите, нужен ли helper
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['needsRouter', 'Компонент читает route state'],
            ['needsProvider', 'Компонент зависит от provider'],
            ['repeatedSetup', 'Один и тот же setup повторяется во многих тестах'],
            ['mixesUserPaths', 'Тестам нужны разные initial route и user path'],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={input[key as keyof CustomRenderInput]}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    [key as keyof CustomRenderInput]: event.target.checked,
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <ListBlock
          title="Рекомендация"
          items={[recommendation.rationale, recommendation.caution]}
        />
      </Panel>

      <BeforeAfter
        beforeTitle="Без helper"
        before="Каждый тест вручную подключает router, provider и initial state, из-за чего сценарий теряется среди setup-кода."
        afterTitle="С focused helper"
        after="Тест сразу описывает пользовательский путь, а повторяемая инфраструктура вынесена в одно понятное место."
      />

      <LessonTestPreferencesProvider
        initialState={{ density: 'compact', reviewMode: 'guidance' }}
      >
        <ProviderHarnessLab />
      </LessonTestPreferencesProvider>

      <Panel>
        <ProjectStudy {...projectStudyByLab['custom-render']} />
      </Panel>
    </div>
  );
}
