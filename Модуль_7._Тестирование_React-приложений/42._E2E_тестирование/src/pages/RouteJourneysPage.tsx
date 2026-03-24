import { useMemo, useState } from 'react';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { RouteJourneyLab } from '../components/e2e/RouteJourneyLab';
import { projectStudyByLab } from '../lib/project-study';
import { evaluateRoutePlanning, type RoutePlanningInput } from '../lib/e2e-runtime';

export function RouteJourneysPage() {
  const [input, setInput] = useState<RoutePlanningInput>({
    spansMultipleScreens: true,
    dependsOnUrl: true,
    needsRedirects: false,
    assertsImplementationDetails: false,
  });

  const recommendation = useMemo(() => evaluateRoutePlanning(input), [input]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Route journeys"
        title="Когда маршрут и адресная строка сами становятся частью E2E-контракта"
        copy="Если смысл сценария зависит от нескольких экранов, query-параметров и redirect, браузерный путь становится отдельной ценностью, а не просто оболочкой над одним компонентом."
        aside={
          <StatusPill
            tone={
              recommendation.model === 'E2E route journey оправдан' ? 'success' : 'warn'
            }
          >
            {recommendation.score}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Decision"
          value={recommendation.model}
          hint="Оценка меняется от структуры пути, а не от любви к E2E как инструменту."
        />
        <MetricCard
          label="Score"
          value={String(recommendation.score)}
          hint="Чем больше экранов, URL-состояния и redirect, тем сильнее системная ценность браузерного теста."
          tone="accent"
        />
        <MetricCard
          label="Best assert"
          value={recommendation.nextAssertion}
          hint="Хороший E2E подтверждает финальный путь, а не private routing implementation."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Соберите профиль маршрута
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['spansMultipleScreens', 'Сценарий проходит через несколько экранов'],
            ['dependsOnUrl', 'URL сам хранит часть состояния пути'],
            ['needsRedirects', 'Путь зависит от redirect'],
            [
              'assertsImplementationDetails',
              'План теста уже лезет во внутренности роутера',
            ],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={input[key as keyof RoutePlanningInput]}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    [key as keyof RoutePlanningInput]: event.target.checked,
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <ListBlock
          title="Следующий полезный assert"
          items={[recommendation.nextAssertion]}
        />
      </Panel>

      <RouteJourneyLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.routes} />
      </Panel>
    </div>
  );
}
