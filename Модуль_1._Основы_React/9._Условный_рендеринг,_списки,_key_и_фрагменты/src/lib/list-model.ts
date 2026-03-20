import {
  formatTrack,
  lessonCatalog,
  type LessonStatus,
  type LessonTrack,
} from './lesson-data';

export type ListState = {
  query: string;
  track: LessonTrack | 'all';
  status: LessonStatus | 'all';
  withLiveReviewOnly: boolean;
  sort: 'title' | 'duration' | 'seats';
};

export type ListSurface = {
  items: typeof lessonCatalog;
  summary: string;
  emptyMessage: string | null;
  snippet: string;
};

export const defaultListState: ListState = {
  query: '',
  track: 'all',
  status: 'all',
  withLiveReviewOnly: false,
  sort: 'title',
};

export function buildListSurface(state: ListState): ListSurface {
  const query = state.query.trim().toLowerCase();

  const items = lessonCatalog
    .filter((lesson) =>
      query.length === 0
        ? true
        : `${lesson.title} ${lesson.summary}`.toLowerCase().includes(query),
    )
    .filter((lesson) => (state.track === 'all' ? true : lesson.track === state.track))
    .filter((lesson) => (state.status === 'all' ? true : lesson.status === state.status))
    .filter((lesson) => (state.withLiveReviewOnly ? lesson.hasLiveReview : true))
    .slice()
    .sort((left, right) => {
      if (state.sort === 'duration') return left.durationMinutes - right.durationMinutes;
      if (state.sort === 'seats') return left.seatsLeft - right.seatsLeft;
      return left.title.localeCompare(right.title, 'ru');
    }) as typeof lessonCatalog;

  return {
    items,
    summary:
      items.length === 0
        ? 'После текущих условий список опустел.'
        : `Отрисовано ${items.length} элементов для ${formatTrack(state.track)}.`,
    emptyMessage:
      items.length === 0
        ? 'Ни один урок не прошёл через текущие условия фильтрации.'
        : null,
    snippet: [
      '{items',
      '  .filter((lesson) => matchesFilters(lesson, state))',
      '  .map((lesson) => (',
      '    <LessonListItem key={lesson.id} lesson={lesson} />',
      '  ))}',
    ].join('\n'),
  };
}
