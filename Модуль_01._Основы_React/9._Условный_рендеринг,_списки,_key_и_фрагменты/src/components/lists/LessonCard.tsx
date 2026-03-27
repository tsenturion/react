import type { ReactNode } from 'react';

import type { LessonRecord } from '../../lib/lesson-data';
import { formatStatus, formatTrack } from '../../lib/lesson-data';

export function LessonCard({
  lesson,
  children,
}: {
  lesson: LessonRecord;
  children?: ReactNode;
}) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span>{formatTrack(lesson.track)}</span>
          <span>{formatStatus(lesson.status)}</span>
          <span>{lesson.durationMinutes} мин</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">{lesson.title}</h3>
        <p className="text-sm leading-6 text-slate-600">{lesson.summary}</p>
      </header>

      <div className="flex flex-wrap gap-2 text-sm text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-2">
          Мест: {lesson.seatsLeft}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-2">
          Ментор: {lesson.mentor}
        </span>
      </div>

      {children ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm">{children}</div>
      ) : null}
    </article>
  );
}
