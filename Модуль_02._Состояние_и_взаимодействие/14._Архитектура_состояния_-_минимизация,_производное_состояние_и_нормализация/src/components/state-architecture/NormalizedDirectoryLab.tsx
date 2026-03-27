import { useMemo, useState } from 'react';

import {
  buildNormalizationArchitectureReport,
  renameTeacherInDuplicatedDirectory,
  renameTeacherInNormalizedDirectory,
} from '../../lib/normalization-architecture-model';
import {
  createDuplicatedDirectory,
  createNormalizedDirectory,
} from '../../lib/state-architecture-domain';
import { StatusPill } from '../ui';

export function NormalizedDirectoryLab() {
  const [duplicated, setDuplicated] = useState(createDuplicatedDirectory);
  const [normalized, setNormalized] = useState(createNormalizedDirectory);
  const report = buildNormalizationArchitectureReport(duplicated, normalized);

  const normalizedCards = useMemo(
    () =>
      normalized.cardOrder.map((cardId) => {
        const card = normalized.cardsById[cardId];
        const teacher = normalized.teachersById[card.teacherId];

        return {
          ...card,
          teacherName: teacher.name,
        };
      }),
    [normalized],
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[28px] border border-rose-300 bg-rose-50/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              duplicated branches
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-rose-950">
              cards + spotlight хранят teacher отдельно
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.duplicatedConsistency}</StatusPill>
        </div>

        <div className="mt-5 rounded-[22px] bg-white px-4 py-4 text-sm text-rose-950">
          spotlight teacher: {duplicated.spotlightTeacher.name}
        </div>

        <div className="mt-5 space-y-3">
          {duplicated.cards.map((card) => (
            <div
              key={card.id}
              className="rounded-[22px] border border-rose-200 bg-white px-4 py-4 text-sm text-rose-950"
            >
              {card.title} • {card.teacherName}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setDuplicated((current) =>
                renameTeacherInDuplicatedDirectory(current, 'teacher-1'),
              )
            }
            className="chip"
          >
            Rename teacher-1
          </button>
          <button
            type="button"
            onClick={() => setDuplicated(createDuplicatedDirectory())}
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
              normalized entities
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-emerald-950">
              cardsById + teachersById + spotlightTeacherId
            </h3>
          </div>
          <StatusPill tone="success">{report.normalizedConsistency}</StatusPill>
        </div>

        <div className="mt-5 rounded-[22px] bg-white px-4 py-4 text-sm text-emerald-950">
          spotlight teacher: {normalized.teachersById[normalized.spotlightTeacherId].name}
        </div>

        <div className="mt-5 space-y-3">
          {normalizedCards.map((card) => (
            <div
              key={card.id}
              className="rounded-[22px] border border-emerald-200 bg-white px-4 py-4 text-sm text-emerald-950"
            >
              {card.title} • {card.teacherName}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setNormalized((current) =>
                renameTeacherInNormalizedDirectory(current, 'teacher-1'),
              )
            }
            className="chip"
          >
            Rename teacher-1
          </button>
          <button
            type="button"
            onClick={() => setNormalized(createNormalizedDirectory())}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>
    </div>
  );
}
