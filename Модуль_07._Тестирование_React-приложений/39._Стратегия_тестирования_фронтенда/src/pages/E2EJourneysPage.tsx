import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { type JourneySpec } from '../lib/testing-domain';
import {
  recommendE2EScope,
  type E2ELoaderData,
  type E2EScopeInput,
} from '../lib/testing-runtime';
import { projectStudyByLab } from '../lib/project-study';

export function E2EJourneysPage() {
  const data = useLoaderData() as E2ELoaderData;
  const [selectedJourneyId, setSelectedJourneyId] = useState(data.journeys[0]?.id ?? '');
  const selectedJourney =
    data.journeys.find((item) => item.id === selectedJourneyId) ?? data.journeys[0];

  const recommendation = useMemo(() => {
    const input: E2EScopeInput = {
      touchesRouter: selectedJourney?.touchesRouter ?? false,
      touchesNetwork: selectedJourney?.touchesNetwork ?? false,
      touchesBrowserApi: selectedJourney?.touchesBrowserApi ?? false,
      criticality: selectedJourney?.criticality ?? 'low',
    };

    return recommendE2EScope(input);
  }, [selectedJourney]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="E2E Tests"
        title="E2E нужен не для каждой кнопки, а для критических браузерных пользовательских путей"
        copy="Ниже выберите путь и посмотрите, почему один сценарий требует реального браузера, а другой лучше закрывать integration tests без лишней дороговизны."
        aside={<StatusPill tone="success">{recommendation.model}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Journey count"
          value={String(data.journeys.length)}
          hint="В проекте есть отдельные E2E candidates, а не абстрактный разговор про browser tests."
        />
        <MetricCard
          label="Loaded at"
          value={data.loadedAt}
          hint="Даже эта страница получает список путей как route-owned snapshot."
          tone="accent"
        />
        <MetricCard
          label="Recommendation"
          value={recommendation.model}
          hint="Путь может требовать полноценный browser run, а может нет."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Candidate journeys
          </p>
          <div className="space-y-2">
            {data.journeys.map((journey: JourneySpec) => (
              <button
                key={journey.id}
                type="button"
                onClick={() => setSelectedJourneyId(journey.id)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  selectedJourney?.id === journey.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {journey.title}
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedJourney?.title}
          </h3>
          <p className="text-sm leading-6 text-slate-600">{selectedJourney?.whyE2E}</p>

          <ListBlock
            title="Signals"
            items={[
              `touches router: ${String(selectedJourney?.touchesRouter ?? false)}`,
              `touches network: ${String(selectedJourney?.touchesNetwork ?? false)}`,
              `touches browser api: ${String(selectedJourney?.touchesBrowserApi ?? false)}`,
              `criticality: ${selectedJourney?.criticality ?? 'low'}`,
            ]}
          />
          <ListBlock
            title="Почему здесь легко ошибиться"
            items={[selectedJourney?.commonMistake ?? '']}
          />
          <ListBlock title="Что должен покрыть E2E" items={recommendation.journeys} />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.e2e} />
      </Panel>
    </div>
  );
}
