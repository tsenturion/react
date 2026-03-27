import { Link, useLoaderData } from 'react-router-dom';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import { shellAccessibilitySurfaces } from '../lib/accessibility-domain';
import type { OverviewLoaderData } from '../lib/accessibility-runtime';

export function OverviewPage() {
  const data = useLoaderData() as OverviewLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Accessibility overview"
        title="Доступность становится частью качества только тогда, когда требования к имени, фокусу, роли и поведению встроены в сам интерфейс"
        copy="Этот урок показывает accessibility как системное свойство приложения. Здесь важно не просто добавить `aria-*`, а построить компонент, который понятен по имени, доступен с клавиатуры, читабелен через landmarks и проверяем тестами по реальному поведению."
        aside={<StatusPill tone="success">{data.focus}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Guide cards"
          value={String(data.guides.length)}
          hint="Фокус в URL меняет смысловую карту темы и удерживает обзор воспроизводимым."
        />
        <MetricCard
          label="Shell surfaces"
          value={String(shellAccessibilitySurfaces.length)}
          hint="Shell урока сам показывает skip link, landmarks и route announcement."
          tone="accent"
        />
        <MetricCard
          label="Request URL"
          value={data.requestUrl}
          hint="URL помогает сохранять текущий фокус темы и делает навигацию предсказуемой."
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
          <div className="flex flex-wrap gap-2">
            {['all', 'labels', 'keyboard', 'semantics', 'testing', 'architecture'].map(
              (focus) => (
                <Link
                  key={focus}
                  to={`/a11y-overview?focus=${focus}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    data.focus === focus
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {focus}
                </Link>
              ),
            )}
          </div>
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
                    {guide.focus}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {guide.title}
                  </h3>
                </div>
                <StatusPill tone="success">quality signal</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{guide.summary}</p>
              <ListBlock title="Почему это важно" items={[guide.signal]} />
              <ListBlock title="Где возникает сбой" items={[guide.caution]} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Accessibility уже есть в shell урока
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {shellAccessibilitySurfaces.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.purpose}</p>
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
