import { unique } from './common';
import { lessonCards, type LessonCard, type LessonLevel } from './js-module-catalog';

export type CollectionLevel = LessonLevel | 'all';

export type CollectionFilters = {
  level: CollectionLevel;
  query: string;
  readyOnly: boolean;
  tag: string;
};

export const collectionLevels = ['all', 'base', 'applied', 'async', 'data'] as const;
export const collectionTags = unique(lessonCards.flatMap((lesson) => lesson.tags)).sort();

const matchesQuery = (query: string, lesson: LessonCard) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [lesson.title, lesson.summary, ...lesson.tags]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
};

export const buildCollectionView = (filters: CollectionFilters) => {
  const visibleLessons = lessonCards
    .filter((lesson) => (filters.level === 'all' ? true : lesson.level === filters.level))
    .filter((lesson) => (filters.readyOnly ? lesson.ready : true))
    .filter((lesson) =>
      filters.tag === 'all' ? true : lesson.tags.includes(filters.tag),
    )
    .filter((lesson) => matchesQuery(filters.query, lesson));

  const metrics = visibleLessons.reduce(
    (acc, lesson) => ({
      totalVisible: acc.totalVisible + 1,
      totalDuration: acc.totalDuration + lesson.duration,
      readyCount: acc.readyCount + Number(lesson.ready),
    }),
    { totalVisible: 0, totalDuration: 0, readyCount: 0 },
  );

  const levelBreakdown = visibleLessons.reduce<Record<string, number>>((acc, lesson) => {
    acc[lesson.level] = (acc[lesson.level] ?? 0) + 1;
    return acc;
  }, {});

  return {
    visibleLessons,
    metrics,
    levelBreakdown,
    codePreview: `const visibleLessons = lessonCards
  .filter(matchesLevel)
  .filter(matchesTag)
  .filter(matchesQuery);

const metrics = visibleLessons.reduce((acc, lesson) => ({
  totalVisible: acc.totalVisible + 1,
  totalDuration: acc.totalDuration + lesson.duration,
  readyCount: acc.readyCount + Number(lesson.ready),
}), { totalVisible: 0, totalDuration: 0, readyCount: 0 });`,
  };
};
