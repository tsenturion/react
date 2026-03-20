import clsx from 'clsx';
import { useMemo, useState } from 'react';

import { createDraftMap, createLessonCatalog } from '../../lib/interface-practice-domain';
import { buildSourceTruthReport, type SourcePreset } from '../../lib/source-truth-model';
import { CourseWorkbench } from './CourseWorkbench';

const lessons = createLessonCatalog();

export function SourceOfTruthLab() {
  const [preset, setPreset] = useState<SourcePreset>('root-owned');
  const report = buildSourceTruthReport(preset);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[
          ['root-owned', 'Единый источник'],
          ['duplicated-selection', 'Дублированный selection'],
          ['local-draft', 'Local draft в details'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setPreset(value as SourcePreset)}
            className={clsx('chip', preset === value && 'chip-active')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {preset === 'root-owned' ? (
            <CourseWorkbench compact />
          ) : preset === 'duplicated-selection' ? (
            <DuplicatedSelectionPreview />
          ) : (
            <LocalDraftPreview />
          )}
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Архитектурный разбор
          </p>
          <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
            {report.title}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">{report.summary}</p>

          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Score
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              {report.score}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Owners
            </p>
            {report.owners.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Симптомы
            </p>
            {report.symptoms.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function DuplicatedSelectionPreview() {
  const [gridSelectedId, setGridSelectedId] = useState(lessons[0].id);
  const [detailsSelectedId, setDetailsSelectedId] = useState(lessons[1].id);

  const gridLesson = lessons.find((lesson) => lesson.id === gridSelectedId) ?? lessons[0];
  const detailsLesson =
    lessons.find((lesson) => lesson.id === detailsSelectedId) ?? lessons[1];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Broken preview
      </p>
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            LessonGrid local selected
          </p>
          <div className="mt-4 space-y-3">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setGridSelectedId(lesson.id)}
                className={clsx(
                  'block w-full rounded-2xl border px-4 py-3 text-left text-sm',
                  gridSelectedId === lesson.id
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 bg-white',
                )}
              >
                {lesson.title}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            LessonDetails local selected
          </p>
          <p className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
            {detailsLesson.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Grid считает выбранным: {gridLesson.title}
          </p>
          <button
            type="button"
            onClick={() => setDetailsSelectedId(gridSelectedId)}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Синхронизировать details вручную
          </button>
        </div>
      </div>
    </section>
  );
}

function LocalDraftPreview() {
  const [selectedId, setSelectedId] = useState(lessons[0].id);
  const selectedLesson = lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Local draft preview
      </p>
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">LessonGrid</p>
          <div className="mt-4 space-y-3">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedId(lesson.id)}
                className={clsx(
                  'block w-full rounded-2xl border px-4 py-3 text-left text-sm',
                  selectedId === lesson.id
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 bg-white',
                )}
              >
                {lesson.title}
              </button>
            ))}
          </div>
        </div>

        <DraftResetPanel key={selectedLesson.id} lessonId={selectedLesson.id} />
      </div>
    </section>
  );
}

function DraftResetPanel({ lessonId }: { lessonId: string }) {
  const lesson = useMemo(
    () => lessons.find((item) => item.id === lessonId) ?? lessons[0],
    [lessonId],
  );
  const [draft, setDraft] = useState(createDraftMap()[lesson.id]);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">LessonDetails local draft</p>
      <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
        {lesson.title}
      </p>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={7}
        className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
      />
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Переключите урок: панель пересоздаётся и draft начинается заново.
      </p>
    </div>
  );
}
