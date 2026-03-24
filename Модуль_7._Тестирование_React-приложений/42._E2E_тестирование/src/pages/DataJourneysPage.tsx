import { useMemo, useState } from 'react';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { ReleaseQueueLab } from '../components/e2e/ReleaseQueueLab';
import { projectStudyByLab } from '../lib/project-study';
import { summarizeDataJourney, type DataJourneyInput } from '../lib/e2e-runtime';

export function DataJourneysPage() {
  const [input, setInput] = useState<DataJourneyInput>({
    coversLoading: true,
    coversRetry: true,
    coversError: true,
    usesFixedWait: false,
  });

  const summary = useMemo(() => summarizeDataJourney(input), [input]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Data journeys"
        title="Асинхронный путь в E2E должен объяснять, как экран восстанавливается после ошибки, а не просто ждать ответа"
        copy="Загрузка данных даёт системную ценность в E2E тогда, когда путь включает loading, ошибку, retry и восстановление пользовательского сценария без ложных ожиданий по времени."
        aside={
          <StatusPill tone={summary.score >= 45 ? 'success' : 'warn'}>
            {summary.score}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Verdict"
          value={summary.verdict}
          hint="Оценка зависит от того, насколько тест отражает восстановление пути, а не произвольный async smoke."
        />
        <MetricCard
          label="Retry value"
          value="observe recovery"
          hint="Retry полезен, когда подтверждает возвращение к рабочему экрану, а не просто второй запрос."
          tone="accent"
        />
        <MetricCard
          label="Anti-flake rule"
          value="wait for UI"
          hint="Ждите role, alert, status и маршрут, а не фиксированные миллисекунды."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Соберите профиль async-пути
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['coversLoading', 'Тест видит loading-state'],
            ['coversRetry', 'Тест проходит через retry'],
            ['coversError', 'Тест подтверждает user-visible ошибку'],
            ['usesFixedWait', 'Сценарий опирается на жёсткий sleep'],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={input[key as keyof DataJourneyInput]}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    [key as keyof DataJourneyInput]: event.target.checked,
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <ListBlock title="Что показывает текущая оценка" items={[summary.verdict]} />
      </Panel>

      <ReleaseQueueLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.data} />
      </Panel>
    </div>
  );
}
