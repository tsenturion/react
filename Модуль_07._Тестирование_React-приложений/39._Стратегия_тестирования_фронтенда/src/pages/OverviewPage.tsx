import { Form, Link, useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import type { TestingFocus } from '../lib/testing-domain';
import type { OverviewLoaderData } from '../lib/testing-runtime';
import { projectStudyByLab } from '../lib/project-study';

const focuses: readonly TestingFocus[] = [
  'all',
  'unit',
  'component',
  'integration',
  'e2e',
  'strategy',
] as const;

export function OverviewPage() {
  const data = useLoaderData() as OverviewLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Testing Strategy"
        title="Тесты дают разную уверенность на разных слоях, и именно в этом их ценность"
        copy="В этой лаборатории overview loader читает query string, фильтрует test guides и показывает, как unit, component, integration и E2E распределяются по смысловым задачам, а не по формальному списку инструментов."
        aside={<StatusPill tone="success">focus: {data.focus}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Guides"
          value={String(data.cards.length)}
          hint="Количество карточек меняется через query-driven focus и loader snapshot."
        />
        <MetricCard
          label="Request URL"
          value={data.requestUrl}
          hint="Даже фильтрация стратегии уже живёт в URL и может быть воспроизведена как route state."
          tone="accent"
        />
        <MetricCard
          label="Loaded at"
          value={data.loadedAt}
          hint="Страница получает готовую модель от loader, а не собирает её эффектом после рендера."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Filter by layer
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Переключайте focus через GET Form и сравнивайте, для каких рисков нужен
              каждый уровень тестов.
            </p>
          </div>
          <Link
            to="/component-behavior"
            className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Открыть component behavior lab
          </Link>
        </div>

        <Form method="get" className="grid gap-4 lg:grid-cols-[240px_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Focus</span>
            <select
              name="focus"
              defaultValue={data.focus}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
            >
              {focuses.map((focus) => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Применить filter
            </button>
            <Link
              to="/testing-strategy-overview?focus=all"
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Сбросить focus
            </Link>
          </div>
        </Form>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {data.cards.map((item) => (
          <Panel key={item.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                {item.focus}
              </span>
            </div>

            <ListBlock title="Когда это лучший слой" items={[item.bestFor]} />
            <ListBlock title="Когда это не лучшая ставка" items={[item.avoidWhen]} />
            <ListBlock title="Типичные ошибки" items={item.pitfalls} />
          </Panel>
        ))}
      </div>

      <Panel>
        <ProjectStudy {...projectStudyByLab.overview} />
      </Panel>
    </div>
  );
}
