import { Link, useLocation, useParams } from 'react-router-dom';

import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';
import { findRouteLesson, routeParamLessons } from '../lib/routing-domain';

export function ParamsPage() {
  const { lessonId = '' } = useParams();
  const location = useLocation();
  const lesson = findRouteLesson(lessonId);
  const study = projectStudies.params;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Параметры маршрутов"
        copy="Один и тот же экран читается как шаблон маршрута, а конкретная сущность приходит через `:lessonId`. Поэтому повторно используется не только компонент, но и сам пользовательский сценарий."
        aside={
          <div className="space-y-3">
            <StatusPill tone={lesson ? 'success' : 'warn'}>
              {lesson ? 'Matched param' : 'Unknown param'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">{location.pathname}</p>
          </div>
        }
      />

      <Panel className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {routeParamLessons.map((item) => (
            <Link
              key={item.id}
              to={`/params/${item.id}`}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {item.id}
            </Link>
          ))}
        </div>

        {lesson ? (
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {lesson.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.focus}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Модуль: <strong>{lesson.module}</strong>. Параметр URL:{' '}
              <strong>{lessonId}</strong>.
            </p>
          </div>
        ) : (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            Для этого `lessonId` в демо нет данных. Компонент остался тем же, но параметр
            маршрута привёл его в состояние "не найдено".
          </div>
        )}
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Template route"
          value="/params/:lessonId"
          hint="Маршрут задаёт структуру URL, а не один конкретный адрес."
          tone="cool"
        />
        <MetricCard
          label="Current param"
          value={lessonId || 'missing'}
          hint="Компонент читает param и строит экран уже из значения URL."
        />
        <MetricCard
          label="Reuse"
          value="One screen, many entities"
          hint="Один экран обслуживает несколько сущностей без дублирования маршрутов и компонентов."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
