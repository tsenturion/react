import { useMemo, useState } from 'react';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import { e2eSmells } from '../lib/e2e-domain';
import { evaluateBoundaryDecision, type BoundaryInput } from '../lib/e2e-runtime';

export function BoundariesPage() {
  const [input, setInput] = useState<BoundaryInput>({
    crossesRouting: true,
    crossesAuth: false,
    crossesData: false,
    alreadyCoveredLower: true,
  });

  const recommendation = useMemo(() => evaluateBoundaryDecision(input), [input]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Boundaries"
        title="E2E полезен там, где он страхует стык маршрутов, auth и данных, а не дублирует каждую частную ветку UI"
        copy="На этой странице можно собрать профиль кандидата в E2E и увидеть, когда браузерный слой действительно усиливает уверенность, а когда он просто повторяет уже покрытое ниже."
        aside={
          <StatusPill tone={recommendation.score >= 50 ? 'success' : 'warn'}>
            {recommendation.score}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Verdict"
          value={recommendation.verdict}
          hint="Решение зависит от архитектурной цены и ценности системного стыка."
        />
        <MetricCard
          label="Playwright vs Cypress"
          value="runner is secondary"
          hint="Главное здесь не бренд инструмента, а то, подтверждает ли сценарий целостную работу приложения."
          tone="accent"
        />
        <MetricCard
          label="Main rule"
          value="protect system seams"
          hint="E2E стоит тратить на уязвимые стыки, а не на всё подряд."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Соберите профиль сценария
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['crossesRouting', 'Путь проходит через несколько маршрутов'],
            ['crossesAuth', 'Путь зависит от авторизации'],
            ['crossesData', 'Путь зависит от загрузки или retry'],
            ['alreadyCoveredLower', 'Нижние слои уже хорошо страхуют детали'],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={input[key as keyof BoundaryInput]}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    [key as keyof BoundaryInput]: event.target.checked,
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Overkill"
        before="Через браузер повторяется каждая частная валидация, все пустые значения и каждый визуальный нюанс, уже покрытый ниже."
        afterTitle="Точечная системная страховка"
        after="E2E подтверждает только критические пути: redirect, protected route, submit на review route и восстановление после ошибки."
      />

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Частые E2E-smells</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {e2eSmells.map((smell) => (
            <div
              key={smell.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">{smell.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{smell.symptom}</p>
              <p className="mt-3 text-sm leading-6 text-slate-900">
                <strong>Цена:</strong> {smell.cost}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-900">
                <strong>Лучше:</strong> {smell.saferMove}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab.boundaries} />
      </Panel>
    </div>
  );
}
