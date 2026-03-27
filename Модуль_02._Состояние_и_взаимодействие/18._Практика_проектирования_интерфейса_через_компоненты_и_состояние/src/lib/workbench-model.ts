import type { LessonItem, LessonTrack, TrackFilter } from './interface-practice-domain';

export type WorkbenchSummary = {
  total: number;
  visible: number;
  favoriteCount: number;
  doneCount: number;
  activeTitle: string;
};

export function filterLessons(
  lessons: readonly LessonItem[],
  query: string,
  activeTrack: TrackFilter,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return lessons.filter((lesson) => {
    const trackMatch = activeTrack === 'all' || lesson.track === activeTrack;
    const queryMatch =
      normalizedQuery.length === 0 ||
      lesson.title.toLowerCase().includes(normalizedQuery) ||
      lesson.module.toLowerCase().includes(normalizedQuery);

    return trackMatch && queryMatch;
  });
}

export function buildWorkbenchSummary(
  lessons: readonly LessonItem[],
  visibleLessons: readonly LessonItem[],
  selectedId: string | null,
): WorkbenchSummary {
  const activeLesson =
    lessons.find((lesson) => lesson.id === selectedId) ?? visibleLessons[0] ?? null;

  return {
    total: lessons.length,
    visible: visibleLessons.length,
    favoriteCount: lessons.filter((lesson) => lesson.favorite).length,
    doneCount: lessons.filter((lesson) => lesson.status === 'done').length,
    activeTitle: activeLesson?.title ?? 'Ничего не выбрано',
  };
}

export function toggleFavorite(lessons: readonly LessonItem[], lessonId: string) {
  return lessons.map((lesson) =>
    lesson.id === lessonId ? { ...lesson, favorite: !lesson.favorite } : lesson,
  );
}

export function updateDraftMap(
  drafts: Record<string, string>,
  lessonId: string,
  nextDraft: string,
) {
  return {
    ...drafts,
    [lessonId]: nextDraft,
  };
}

export function trackLabel(track: LessonTrack) {
  if (track === 'state') return 'State';
  if (track === 'architecture') return 'Architecture';
  return 'Forms';
}
