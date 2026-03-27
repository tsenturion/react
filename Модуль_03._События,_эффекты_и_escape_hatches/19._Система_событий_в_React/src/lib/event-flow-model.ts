import type { EventLessonItem } from './event-domain';

export type EventFlowState = {
  onlyUnhandled: boolean;
  selectedId: string | null;
  lessons: EventLessonItem[];
};

export type EventFlowSnapshot = {
  visibleCount: number;
  handledCount: number;
  selectedTitle: string;
  snippet: string;
};

export function filterEventLessons(
  lessons: readonly EventLessonItem[],
  onlyUnhandled: boolean,
) {
  return onlyUnhandled ? lessons.filter((item) => !item.handled) : [...lessons];
}

export function buildEventFlowSnapshot(state: EventFlowState): EventFlowSnapshot {
  const visible = filterEventLessons(state.lessons, state.onlyUnhandled);
  const selected =
    state.lessons.find((item) => item.id === state.selectedId) ?? visible[0] ?? null;

  return {
    visibleCount: visible.length,
    handledCount: state.lessons.filter((item) => item.handled).length,
    selectedTitle: selected?.title ?? 'Ничего не выбрано',
    snippet: [
      'setOnlyUnhandled((current) => !current);',
      'const visible = filterEventLessons(lessons, nextOnlyUnhandled);',
      'const selected = lessons.find((item) => item.id === selectedId) ?? visible[0] ?? null;',
    ].join('\n'),
  };
}

export function toggleHandled(lessons: readonly EventLessonItem[], lessonId: string) {
  return lessons.map((item) =>
    item.id === lessonId
      ? { ...item, handled: !item.handled, clicks: item.clicks + 1 }
      : item,
  );
}
