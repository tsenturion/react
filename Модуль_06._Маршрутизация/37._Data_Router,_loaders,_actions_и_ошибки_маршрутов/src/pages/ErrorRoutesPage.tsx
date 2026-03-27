import { Link, useLoaderData } from 'react-router-dom';

import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import { type ErrorRouteLoaderData } from '../lib/data-router-runtime';

const errorLinks = [
  {
    href: '/error-routes/stable',
    label: 'stable',
  },
  {
    href: '/error-routes/response-404',
    label: 'response-404',
  },
  {
    href: '/error-routes/response-503',
    label: 'response-503',
  },
  {
    href: '/error-routes/throw-error',
    label: 'throw-error',
  },
] as const;

export function ErrorRoutesPage() {
  const data = useLoaderData() as ErrorRouteLoaderData;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Route Errors"
        title="Loader может бросить Response или Error до рендера route element"
        copy="В stable-режиме ниже рендерится обычный экран. Если открыть error modes, текущий route branch отдаст управление своему errorElement."
        aside={<StatusPill tone="success">{data.mode}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Mode"
          value={data.mode}
          hint="Сейчас loader отработал успешно и route element смог отрендериться."
        />
        <MetricCard
          label="Loaded at"
          value={data.loadedAt}
          hint="Даже error demo route сначала проходит через normal loader lifecycle."
          tone="accent"
        />
        <MetricCard
          label="Fallback scope"
          value="Route branch"
          hint="Ошибка этой ветки не обязана ломать весь lesson shell."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {errorLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {data.stableNotes.map((item) => (
            <div
              key={item}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab.errors} />
      </Panel>
    </div>
  );
}
