import { useState } from 'react';

import {
  archiveLesson,
  buildDuplicateStateReport,
  createBadSelectionState,
  createGoodSelectionState,
  deriveSelectedLesson,
  renameLesson,
} from '../../lib/duplicate-state-model';
import { createLessonRecords } from '../../lib/state-architecture-domain';
import { StatusPill } from '../ui';

export function SelectionDriftLab() {
  const [badState, setBadState] = useState(() =>
    createBadSelectionState(createLessonRecords()),
  );
  const [goodState, setGoodState] = useState(() =>
    createGoodSelectionState(createLessonRecords()),
  );

  const report = buildDuplicateStateReport(badState, goodState);
  const badSelected = deriveSelectedLesson(badState.lessons, badState.selectedId);
  const goodSelected = deriveSelectedLesson(goodState.lessons, goodState.selectedId);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[28px] border border-rose-300 bg-rose-50/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              duplicated state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-rose-950">
              selectedId + selectedTitle + selectedMentor
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.badLabel}</StatusPill>
        </div>

        <div className="mt-5 space-y-3">
          {badState.lessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() =>
                setBadState((current) => ({
                  ...current,
                  selectedId: lesson.id,
                  selectedTitle: lesson.title,
                  selectedMentor: lesson.mentor,
                }))
              }
              className={`w-full rounded-[22px] border px-4 py-4 text-left text-sm ${
                badState.selectedId === lesson.id
                  ? 'border-rose-300 bg-white text-rose-950'
                  : 'border-rose-200 bg-white/80 text-rose-900'
              }`}
            >
              {lesson.title} • {lesson.mentor}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[24px] bg-white px-4 py-4 text-sm leading-6 text-rose-950">
          derived lesson: {badSelected?.title ?? 'missing'}
          <br />
          stored title copy: {badState.selectedTitle ?? 'missing'}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              if (!badState.selectedId) return;
              setBadState((current) => ({
                ...current,
                lessons: renameLesson(current.lessons, current.selectedId!),
              }));
            }}
            className="chip"
          >
            Rename selected
          </button>
          <button
            type="button"
            onClick={() => {
              if (!badState.selectedId) return;
              setBadState((current) => ({
                ...current,
                lessons: archiveLesson(current.lessons, current.selectedId!),
              }));
            }}
            className="chip"
          >
            Archive selected
          </button>
          <button
            type="button"
            onClick={() => setBadState(createBadSelectionState(createLessonRecords()))}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>

      <article className="rounded-[28px] border border-emerald-300 bg-emerald-50/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              single source of truth
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-emerald-950">
              selectedId + deriveSelectedLesson(...)
            </h3>
          </div>
          <StatusPill tone="success">{goodSelected?.title ?? 'none'}</StatusPill>
        </div>

        <div className="mt-5 space-y-3">
          {goodState.lessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() =>
                setGoodState((current) => ({ ...current, selectedId: lesson.id }))
              }
              className={`w-full rounded-[22px] border px-4 py-4 text-left text-sm ${
                goodState.selectedId === lesson.id
                  ? 'border-emerald-300 bg-white text-emerald-950'
                  : 'border-emerald-200 bg-white/80 text-emerald-900'
              }`}
            >
              {lesson.title} • {lesson.mentor}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[24px] bg-white px-4 py-4 text-sm leading-6 text-emerald-950">
          selected lesson: {goodSelected?.title ?? 'ничего не выбрано'}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              if (!goodState.selectedId) return;
              setGoodState((current) => ({
                ...current,
                lessons: renameLesson(current.lessons, current.selectedId!),
              }));
            }}
            className="chip"
          >
            Rename selected
          </button>
          <button
            type="button"
            onClick={() => {
              if (!goodState.selectedId) return;
              setGoodState((current) => ({
                ...current,
                lessons: archiveLesson(current.lessons, current.selectedId!),
              }));
            }}
            className="chip"
          >
            Archive selected
          </button>
          <button
            type="button"
            onClick={() => setGoodState(createGoodSelectionState(createLessonRecords()))}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>
    </div>
  );
}
