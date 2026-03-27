import { Form, useLoaderData } from 'react-router-dom';

import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import type { GuideFocus } from '../lib/async-testing-domain';
import { projectStudyByLab } from '../lib/project-study';
import type { OverviewLoaderData } from '../lib/async-testing-runtime';

const focusLabels: Record<GuideFocus, string> = {
  all: 'Все',
  'async-ui': 'Async UI',
  'http-mocks': 'HTTP mocks',
  providers: 'Providers',
  environment: 'Environment',
  'anti-fragility': 'Anti-fragility',
};

export function OverviewPage() {
  const data = useLoaderData() as OverviewLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Async testing"
        title="Асинхронный тест устойчив тогда, когда вы ждёте наблюдаемый результат, а не время"
        copy="Эта карта темы помогает разложить async UI, mocked HTTP, provider harness и test environment по отдельным слоям, а затем собрать их обратно в один устойчивый тестовый сценарий."
        aside={<StatusPill tone="success">{focusLabels[data.focus]}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Guide Cards"
          value={String(data.guides.length)}
          hint="Фильтр через URL меняет предметную карту урока, а не декоративный слой интерфейса."
        />
        <MetricCard
          label="Setup Cards"
          value={String(data.setupCards.length)}
          hint="Здесь собраны минимальные элементы устойчивого async test environment."
          tone="accent"
        />
        <MetricCard
          label="Focus"
          value={focusLabels[data.focus]}
          hint="Один и тот же урок можно читать через async UI, через mock boundary или через среду выполнения."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Focus Filter
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Отфильтруйте карту темы прямо через URL
            </h2>
          </div>
          <Form method="get" className="flex flex-wrap gap-2">
            {(Object.keys(focusLabels) as GuideFocus[]).map((focus) => (
              <button
                key={focus}
                type="submit"
                name="focus"
                value={focus}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  data.focus === focus
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {focusLabels[focus]}
              </button>
            ))}
          </Form>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {data.guides.map((guide) => (
            <div
              key={guide.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {focusLabels[guide.focus]}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {guide.title}
                  </h3>
                </div>
                <StatusPill tone="success">route-owned</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{guide.summary}</p>
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Где работает хорошо
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">
                  {guide.practicalUse}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Типичная ловушка
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-950">{guide.trap}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Environment Backbone
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Эти три элемента удерживают async suite предсказуемым
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {data.setupCards.map((card) => (
            <div
              key={card.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab.overview} />
      </Panel>
    </div>
  );
}
