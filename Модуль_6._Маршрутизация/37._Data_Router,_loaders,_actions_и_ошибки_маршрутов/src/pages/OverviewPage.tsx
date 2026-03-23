import { Form, Link, useLoaderData, useNavigation } from 'react-router-dom';

import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import { type DataTrack } from '../lib/data-router-domain';
import { type OverviewLoaderData } from '../lib/data-router-runtime';

const tracks: readonly DataTrack[] = ['all', 'loaders', 'actions', 'errors'];

export function OverviewPage() {
  const data = useLoaderData() as OverviewLoaderData;
  const navigation = useNavigation();

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Data Router Basics"
        title="Loader получает request и подготавливает экран до его рендера"
        copy="В этой лаборатории route loader читает query string, фильтрует набор route playbooks и отдаёт экрану готовые данные. Экран не стартует отдельный fetch после рендера."
        aside={<StatusPill tone="success">track: {data.track}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Cards from loader"
          value={String(data.metrics.cards)}
          hint="Количество карточек уже вычислено route loader-ом до рендера страницы."
        />
        <MetricCard
          label="Request URL"
          value={data.requestUrl}
          hint="Loader работает с полноценным request и видит search params ещё до появления JSX."
          tone="accent"
        />
        <MetricCard
          label="Router state"
          value={navigation.state}
          hint="Pending navigation здесь управляется маршрутизатором, а не локальным effect loading state."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Filter via GET form
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              GET-форма ниже меняет URL, запускает loader заново и даёт новый snapshot
              данных без ручного orchestration в компоненте.
            </p>
          </div>
          <StatusPill tone={navigation.state === 'idle' ? 'success' : 'warn'}>
            {navigation.state === 'idle' ? 'loader idle' : 'loader pending'}
          </StatusPill>
        </div>

        <Form method="get" className="grid gap-4 lg:grid-cols-[220px_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Track</span>
            <select
              name="track"
              defaultValue={data.track}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
            >
              {tracks.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Применить через loader
            </button>
            <Link
              to="/data-router-overview?track=all"
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Сбросить query
            </Link>
          </div>
        </Form>

        <div className="grid gap-4 lg:grid-cols-2">
          {data.cards.map((item) => (
            <article
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {item.track}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">
                {item.routeDataRole}
              </p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab.overview} />
      </Panel>
    </div>
  );
}
