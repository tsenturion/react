import { Form, useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import type { OverviewLoaderData } from '../lib/rtl-runtime';

export function OverviewPage() {
  const data = useLoaderData() as OverviewLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="React Testing Library"
        title="Тест должен следовать за поведением пользователя, а не за внутренним устройством компонента"
        copy="Этот урок помогает увидеть разницу между тестом, который устойчиво проверяет UX, и тестом, который ломается от любого внутреннего рефакторинга."
        aside={<StatusPill tone="success">{data.focus}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Guide cards"
          value={String(data.cards.length)}
          hint="Фильтр по focus меняет не макет, а предметную карту user-centric RTL-подхода."
        />
        <MetricCard
          label="Loaded at"
          value={data.loadedAt}
          hint="Даже обзор темы приходит как route-owned snapshot."
          tone="accent"
        />
        <MetricCard
          label="Request URL"
          value={data.requestUrl}
          hint="URL хранит активный focus и делает обзор воспроизводимым."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Focus filter
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Отфильтруйте карту темы через URL
            </h2>
          </div>
          <Form method="get" className="flex flex-wrap gap-2">
            {['all', 'queries', 'interactions', 'forms', 'providers', 'strategy'].map(
              (focus) => (
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
                  {focus}
                </button>
              ),
            )}
          </Form>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {data.cards.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {item.focus}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                </div>
                <StatusPill tone="success">user-centric</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
              <ListBlock title="Лучше всего подходит для" items={[item.bestFor]} />
              <ListBlock
                title="Когда не стоит идти этим путём"
                items={[item.avoidWhen]}
              />
              <ListBlock title="Типичные ошибки" items={item.pitfalls} />
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
