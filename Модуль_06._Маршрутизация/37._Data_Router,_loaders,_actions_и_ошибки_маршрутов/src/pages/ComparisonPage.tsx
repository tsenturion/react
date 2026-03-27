import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import {
  buildComparisonScenario,
  type ComparisonLoaderData,
  type ComparisonScenario,
} from '../lib/data-router-runtime';

const scenarioLabels: Record<ComparisonScenario, string> = {
  'first-render': 'first render',
  'param-change': 'param change',
  submit: 'submit',
  'error-handling': 'error handling',
};

export function ComparisonPage() {
  const data = useLoaderData() as ComparisonLoaderData;
  const [scenario, setScenario] = useState<ComparisonScenario>('first-render');
  const comparison = buildComparisonScenario(scenario);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Route Request vs Component Request"
        title="Запрос из маршрута и запрос после рендера компонента создают разную ментальную модель"
        copy="Когда данные определяют сам экран, loader делает их частью navigation lifecycle. Когда fetch стартует уже после рендера компонента, orchestration и гонки чаще оказываются в локальной логике."
        aside={<StatusPill tone="success">{scenarioLabels[scenario]}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Loader scenarios"
          value={String(data.scenarios.length)}
          hint="Сценарии ниже показывают, что route request меняет не только API layer, но и всю модель экрана."
        />
        <MetricCard
          label="Current scenario"
          value={scenarioLabels[scenario]}
          hint="Переключайте сценарии и сравнивайте timeline двух подходов."
          tone="accent"
        />
        <MetricCard
          label="Loaded at"
          value={data.loadedAt}
          hint="Даже эта страница получает базовую модель от route loader, а не из component effect."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {data.scenarios.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setScenario(item)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                scenario === item
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {scenarioLabels[item]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-emerald-300/60 bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Route request
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-emerald-950">
              {comparison.routeSteps.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-emerald-200 bg-white px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-rose-300/60 bg-rose-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              Component request
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-rose-950">
              {comparison.componentSteps.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Запрос стартует после первого рендера"
        before="Компоненту приходится самому orchestrate loading, error, cancel и повторную синхронизацию при смене URL или submit."
        afterTitle="Маршрут владеет route-critical данными"
        after="Loader и action встраивают данные прямо в lifecycle navigation, поэтому экран получает более устойчивую и предсказуемую модель."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.comparison} />
      </Panel>
    </div>
  );
}
