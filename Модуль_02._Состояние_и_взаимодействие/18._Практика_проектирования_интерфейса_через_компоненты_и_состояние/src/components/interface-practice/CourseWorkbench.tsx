import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import {
  createDraftMap,
  createLessonCatalog,
  type LessonItem,
  type TrackFilter,
} from '../../lib/interface-practice-domain';
import {
  buildWorkbenchSummary,
  filterLessons,
  toggleFavorite,
  trackLabel,
  updateDraftMap,
} from '../../lib/workbench-model';

type CourseWorkbenchProps = {
  onTrace?: (line: string) => void;
  showSnapshot?: boolean;
  compact?: boolean;
};

export function CourseWorkbench({
  onTrace,
  showSnapshot = false,
  compact = false,
}: CourseWorkbenchProps) {
  const [lessons, setLessons] = useState(createLessonCatalog);
  const [query, setQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState<TrackFilter>('all');
  const [selectedId, setSelectedId] = useState(lessons[0]?.id ?? '');
  // Owner state намеренно поднят сюда, чтобы list, details и summary
  // смотрели на один источник истины, а не на разрозненные локальные копии.
  const [draftsById, setDraftsById] = useState(createDraftMap);

  const visibleLessons = useMemo(
    () => filterLessons(lessons, query, activeTrack),
    [activeTrack, lessons, query],
  );
  const effectiveSelectedId =
    visibleLessons.length === 0 ||
    visibleLessons.some((lesson) => lesson.id === selectedId)
      ? selectedId
      : visibleLessons[0].id;
  const selectedLesson =
    lessons.find((lesson) => lesson.id === effectiveSelectedId) ??
    visibleLessons[0] ??
    null;
  const summary = useMemo(
    () => buildWorkbenchSummary(lessons, visibleLessons, effectiveSelectedId),
    [effectiveSelectedId, lessons, visibleLessons],
  );

  useEffect(() => {
    if (!onTrace || !selectedLesson) {
      return;
    }

    const draft = draftsById[selectedLesson.id] ?? '';
    onTrace(
      `Render: query="${query}", track="${activeTrack}", visible=${visibleLessons.length}, selected="${selectedLesson.title}", draftLength=${draft.length}.`,
    );
  }, [activeTrack, draftsById, onTrace, query, selectedLesson, visibleLessons.length]);

  const handleFavoriteToggle = (lessonId: string) => {
    onTrace?.(`Action: переключён favorite у ${lessonId}.`);
    setLessons((current) => toggleFavorite(current, lessonId));
  };

  const handleSelectLesson = (lessonId: string) => {
    onTrace?.(`Action: выбран урок ${lessonId}.`);
    setSelectedId(lessonId);
  };

  const handleDraftChange = (lessonId: string, nextDraft: string) => {
    onTrace?.(`Action: изменён draft для ${lessonId}.`);
    setDraftsById((current) => updateDraftMap(current, lessonId, nextDraft));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <WorkbenchToolbar
          compact={compact}
          query={query}
          activeTrack={activeTrack}
          summary={summary}
          onQueryChange={(nextQuery) => {
            onTrace?.(`Action: изменён query на "${nextQuery}".`);
            setQuery(nextQuery);
          }}
          onTrackChange={(track) => {
            onTrace?.(`Action: выбран фильтр ${track}.`);
            setActiveTrack(track);
          }}
        />

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <LessonGrid
            compact={compact}
            lessons={visibleLessons}
            selectedId={selectedLesson?.id ?? null}
            onSelectLesson={handleSelectLesson}
            onToggleFavorite={handleFavoriteToggle}
          />
          <LessonDetails
            compact={compact}
            lesson={selectedLesson}
            draft={selectedLesson ? (draftsById[selectedLesson.id] ?? '') : ''}
            onDraftChange={(nextDraft) => {
              if (!selectedLesson) return;
              handleDraftChange(selectedLesson.id, nextDraft);
            }}
          />
        </div>
      </section>

      {showSnapshot ? (
        <StateSnapshotPanel
          query={query}
          activeTrack={activeTrack}
          visibleCount={visibleLessons.length}
          selectedLesson={selectedLesson}
          favoriteCount={summary.favoriteCount}
          draftLength={selectedLesson ? (draftsById[selectedLesson.id] ?? '').length : 0}
        />
      ) : null}
    </div>
  );
}

function WorkbenchToolbar({
  compact,
  query,
  activeTrack,
  summary,
  onQueryChange,
  onTrackChange,
}: {
  compact: boolean;
  query: string;
  activeTrack: TrackFilter;
  summary: ReturnType<typeof buildWorkbenchSummary>;
  onQueryChange: (value: string) => void;
  onTrackChange: (value: TrackFilter) => void;
}) {
  const tracks: readonly TrackFilter[] = ['all', 'state', 'architecture', 'forms'];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">Поиск по экрану</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Найти урок или модуль"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400"
          />
        </label>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            SummaryStrip
          </p>
          <div
            className={clsx('mt-3 grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-4')}
          >
            <SummaryMetric label="Всего" value={String(summary.total)} />
            <SummaryMetric label="Видно" value={String(summary.visible)} />
            <SummaryMetric label="В избранном" value={String(summary.favoriteCount)} />
            <SummaryMetric label="Done" value={String(summary.doneCount)} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {tracks.map((track) => (
          <button
            key={track}
            type="button"
            onClick={() => onTrackChange(track)}
            className={clsx('chip', activeTrack === track && 'chip-active')}
          >
            {track === 'all' ? 'Все треки' : trackLabel(track)}
          </button>
        ))}
      </div>
    </div>
  );
}

function LessonGrid({
  compact,
  lessons,
  selectedId,
  onSelectLesson,
  onToggleFavorite,
}: {
  compact: boolean;
  lessons: readonly LessonItem[];
  selectedId: string | null;
  onSelectLesson: (lessonId: string) => void;
  onToggleFavorite: (lessonId: string) => void;
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        LessonGrid
      </p>
      <div className="mt-4 grid gap-3">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              compact={compact}
              selected={lesson.id === selectedId}
              onSelect={() => onSelectLesson(lesson.id)}
              onToggleFavorite={() => onToggleFavorite(lesson.id)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm leading-6 text-slate-500">
            По текущему query и фильтру ничего не найдено.
          </div>
        )}
      </div>
    </section>
  );
}

function LessonCard({
  lesson,
  compact,
  selected,
  onSelect,
  onToggleFavorite,
}: {
  lesson: LessonItem;
  compact: boolean;
  selected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <article
      className={clsx(
        'rounded-[22px] border bg-white p-4 shadow-sm transition',
        selected
          ? 'border-blue-400 ring-2 ring-blue-200'
          : 'border-slate-200 hover:border-slate-300',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {lesson.module} · {trackLabel(lesson.track)}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            {lesson.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          className={clsx(
            'rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]',
            lesson.favorite
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600',
          )}
        >
          {lesson.favorite ? 'Favorite' : 'Mark'}
        </button>
      </div>

      <div
        className={clsx(
          'mt-4 grid gap-3 text-sm',
          compact ? 'grid-cols-2' : 'grid-cols-3',
        )}
      >
        <MetaBox label="Статус" value={lesson.status} />
        <MetaBox label="Длительность" value={`${lesson.duration} мин`} />
        <MetaBox label="Прогресс" value={`${lesson.progress}%`} />
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
      >
        Открыть details
      </button>
    </article>
  );
}

function LessonDetails({
  compact,
  lesson,
  draft,
  onDraftChange,
}: {
  compact: boolean;
  lesson: LessonItem | null;
  draft: string;
  onDraftChange: (nextDraft: string) => void;
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        LessonDetails
      </p>

      {lesson ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-[22px] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Выбранный урок
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {lesson.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Модуль: {lesson.module}. Трек: {trackLabel(lesson.track)}. Статус:{' '}
              {lesson.status}.
            </p>
          </div>

          <label className="block space-y-2 text-sm text-slate-700">
            <span className="font-medium">DraftEditor</span>
            <textarea
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              rows={compact ? 6 : 8}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
            />
          </label>
        </div>
      ) : (
        <div className="mt-4 rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-8 text-sm leading-6 text-slate-500">
          Нет выбранного урока.
        </div>
      )}
    </section>
  );
}

function StateSnapshotPanel({
  query,
  activeTrack,
  visibleCount,
  selectedLesson,
  favoriteCount,
  draftLength,
}: {
  query: string;
  activeTrack: TrackFilter;
  visibleCount: number;
  selectedLesson: LessonItem | null;
  favoriteCount: number;
  draftLength: number;
}) {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        State snapshot
      </p>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
        <SnapshotLine label="query" value={query || '""'} />
        <SnapshotLine label="activeTrack" value={activeTrack} />
        <SnapshotLine label="selectedId" value={selectedLesson?.id ?? 'null'} />
        <SnapshotLine label="visibleLessons" value={String(visibleCount)} />
        <SnapshotLine label="favoriteCount" value={String(favoriteCount)} />
        <SnapshotLine label="draftLength" value={String(draftLength)} />
      </div>
    </aside>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-3 text-center shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function MetaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function SnapshotLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-xs text-slate-900">{value}</p>
    </div>
  );
}
