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
import { routeScreens } from '../lib/e2e-domain';
import type { OverviewLoaderData } from '../lib/e2e-runtime';

export function OverviewPage() {
  const data = useLoaderData() as OverviewLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="End-to-End"
        title="Системный тест нужен там, где одно действие пользователя запускает путь через несколько экранов и слоёв приложения"
        copy="Этот урок показывает E2E не как самый верхний формальный уровень, а как точечный инструмент проверки реальных пользовательских journeys через маршруты, авторизацию, формы и данные."
        aside={<StatusPill tone="success">{data.focus}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Guide cards"
          value={String(data.guides.length)}
          hint="Фокус меняет не витрину, а смысловую карту системных сценариев."
        />
        <MetricCard
          label="Critical routes"
          value={String(routeScreens.length)}
          hint="Урок специально включает скрытые экраны, которые проходят реальные browser journeys."
          tone="accent"
        />
        <MetricCard
          label="Request URL"
          value={data.requestUrl}
          hint="URL удерживает активный focus и делает обзор воспроизводимым."
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
              Отфильтруйте карту E2E-слоя через URL
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'routes', 'auth', 'forms', 'data', 'boundaries'].map((focus) => (
              <Link
                key={focus}
                to={`/e2e-overview?focus=${focus}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  data.focus === focus
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {focus}
              </Link>
            ))}
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
                <StatusPill tone="success">system path</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{guide.summary}</p>
              <ListBlock
                title="Когда это сильный кандидат в E2E"
                items={[guide.signal]}
              />
              <ListBlock title="Где легко переборщить" items={[guide.caution]} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Реальные точки системного пути
        </h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {routeScreens.map((screen) => (
            <div
              key={screen.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {screen.path}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {screen.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{screen.purpose}</p>
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
