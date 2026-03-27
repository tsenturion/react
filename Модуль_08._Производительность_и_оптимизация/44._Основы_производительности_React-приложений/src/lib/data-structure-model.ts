export type Track = 'ui' | 'data' | 'tests';
export type Level = 'intro' | 'practice' | 'deep';
export type SortMode = 'title' | 'duration';
export type SizePreset = 'small' | 'medium' | 'large';

export type CatalogLesson = {
  id: string;
  title: string;
  sectionId: string;
  sectionTitle: string;
  track: Track;
  level: Level;
  minutes: number;
  keywords: readonly string[];
};

export type CatalogSection = {
  id: string;
  title: string;
  lessons: readonly CatalogLesson[];
};

export type CatalogIndex = {
  allLessons: readonly CatalogLesson[];
  byTrack: Record<Track, readonly CatalogLesson[]>;
  byLevel: Record<Level, readonly CatalogLesson[]>;
};

export type CatalogFilters = {
  query: string;
  track: Track | 'all';
  level: Level | 'all';
  sort: SortMode;
};

export type ProjectionResult = {
  visibleCount: number;
  totalMinutes: number;
  operations: number;
  sampleTitles: readonly string[];
};

export const sizePresetConfig: Record<
  SizePreset,
  { sections: number; lessonsPerSection: number }
> = {
  small: { sections: 6, lessonsPerSection: 8 },
  medium: { sections: 12, lessonsPerSection: 14 },
  large: { sections: 20, lessonsPerSection: 18 },
};

const titleSeeds = [
  'Component tree audit',
  'Router state mapping',
  'Query ownership',
  'Render pipeline',
  'Accessibility pass',
  'HTTP retry flow',
  'Testing harness',
  'Profiling checklist',
] as const;

const trackCycle: readonly Track[] = ['ui', 'data', 'tests'];
const levelCycle: readonly Level[] = ['intro', 'practice', 'deep'];

export function createCatalog(
  sectionCount: number,
  lessonsPerSection: number,
): readonly CatalogSection[] {
  return Array.from({ length: sectionCount }, (_, sectionIndex) => {
    const sectionId = `section-${sectionIndex + 1}`;
    const sectionTitle = `Поток ${sectionIndex + 1}`;

    const lessons = Array.from({ length: lessonsPerSection }, (_, lessonIndex) => {
      const seed = titleSeeds[(sectionIndex + lessonIndex) % titleSeeds.length];
      const track = trackCycle[(sectionIndex + lessonIndex) % trackCycle.length];
      const level = levelCycle[(sectionIndex * 2 + lessonIndex) % levelCycle.length];

      return {
        id: `${sectionId}-lesson-${lessonIndex + 1}`,
        title: `${seed} ${sectionIndex + 1}.${lessonIndex + 1}`,
        sectionId,
        sectionTitle,
        track,
        level,
        minutes: 10 + (((sectionIndex + 1) * (lessonIndex + 2)) % 35),
        keywords: [track, level, seed.split(' ')[0].toLowerCase(), 'react'],
      } satisfies CatalogLesson;
    });

    return {
      id: sectionId,
      title: sectionTitle,
      lessons,
    } satisfies CatalogSection;
  });
}

export function buildCatalogIndex(sections: readonly CatalogSection[]): CatalogIndex {
  const allLessons = sections.flatMap((section) => section.lessons);

  return {
    allLessons,
    byTrack: {
      ui: allLessons.filter((lesson) => lesson.track === 'ui'),
      data: allLessons.filter((lesson) => lesson.track === 'data'),
      tests: allLessons.filter((lesson) => lesson.track === 'tests'),
    },
    byLevel: {
      intro: allLessons.filter((lesson) => lesson.level === 'intro'),
      practice: allLessons.filter((lesson) => lesson.level === 'practice'),
      deep: allLessons.filter((lesson) => lesson.level === 'deep'),
    },
  };
}

function matchesLesson(lesson: CatalogLesson, filters: CatalogFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const matchesQuery =
    normalizedQuery.length === 0 ||
    lesson.title.toLowerCase().includes(normalizedQuery) ||
    lesson.keywords.some((item) => item.includes(normalizedQuery));
  const matchesTrack = filters.track === 'all' || lesson.track === filters.track;
  const matchesLevel = filters.level === 'all' || lesson.level === filters.level;

  return matchesQuery && matchesTrack && matchesLevel;
}

function sortLessons(lessons: readonly CatalogLesson[], sort: SortMode) {
  if (sort === 'duration') {
    return [...lessons].sort((left, right) => right.minutes - left.minutes);
  }

  return [...lessons].sort((left, right) => left.title.localeCompare(right.title, 'ru'));
}

function projectSummary(
  visible: readonly CatalogLesson[],
  operations: number,
): ProjectionResult {
  return {
    visibleCount: visible.length,
    totalMinutes: visible.reduce((total, lesson) => total + lesson.minutes, 0),
    operations,
    sampleTitles: visible.slice(0, 5).map((lesson) => lesson.title),
  };
}

export function projectNested(
  sections: readonly CatalogSection[],
  filters: CatalogFilters,
): ProjectionResult {
  let operations = 0;
  const visible: CatalogLesson[] = [];

  for (const section of sections) {
    operations += 1;

    for (const lesson of section.lessons) {
      operations += 1;

      if (matchesLesson(lesson, filters)) {
        visible.push(lesson);
      }
    }
  }

  operations += Math.ceil(visible.length * Math.log2(Math.max(visible.length, 1) + 1));

  return projectSummary(sortLessons(visible, filters.sort), operations);
}

export function projectIndexed(
  index: CatalogIndex,
  filters: CatalogFilters,
): ProjectionResult {
  let operations = 1;
  let base: readonly CatalogLesson[] = index.allLessons;

  if (filters.track !== 'all' && filters.level !== 'all') {
    const byTrack = index.byTrack[filters.track];
    const byLevel = index.byLevel[filters.level];

    base = byTrack.length < byLevel.length ? byTrack : byLevel;
    operations += 2;
  } else if (filters.track !== 'all') {
    base = index.byTrack[filters.track];
    operations += 1;
  } else if (filters.level !== 'all') {
    base = index.byLevel[filters.level];
    operations += 1;
  }

  const visible: CatalogLesson[] = [];

  for (const lesson of base) {
    operations += 1;

    if (matchesLesson(lesson, filters)) {
      visible.push(lesson);
    }
  }

  operations += Math.ceil(visible.length * Math.log2(Math.max(visible.length, 1) + 1));

  return projectSummary(sortLessons(visible, filters.sort), operations);
}
