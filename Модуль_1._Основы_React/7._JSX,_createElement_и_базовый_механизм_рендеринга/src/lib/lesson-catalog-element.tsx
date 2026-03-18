import type { ReactElement } from 'react';

import type { RenderSurface } from './render-description-model';

export function buildLessonCatalogElement(surface: RenderSurface): ReactElement {
  if (surface.lessons.length === 0) {
    return (
      <section className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Пустой результат</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{surface.emptyMessage}</p>
      </section>
    );
  }

  if (surface.rootType === 'ul') {
    return (
      <ul className="grid gap-4 lg:grid-cols-2">
        {surface.lessons.map((lesson) => (
          <li
            key={lesson.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {lesson.level === 'base' ? 'Base' : 'Advanced'}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {lesson.title}
                </h3>
              </div>
              <span
                className={
                  lesson.available
                    ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'
                    : 'rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700'
                }
              >
                {lesson.available ? 'Открыт' : 'Закрыт'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {lesson.duration} мин
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {lesson.price} ₽
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4">
      {surface.lessons.map((lesson) => (
        <article
          key={lesson.id}
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>{lesson.level === 'base' ? 'Base' : 'Advanced'}</span>
            <span>{lesson.duration} мин</span>
            <span>{lesson.price} ₽</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{lesson.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{lesson.summary}</p>
        </article>
      ))}
    </div>
  );
}
