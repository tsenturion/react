export type BoardLesson = {
  id: string;
  title: string;
  done: boolean;
  notes: string[];
};

export type LearningBoard = {
  title: string;
  lessons: BoardLesson[];
  summary: {
    done: number;
    total: number;
  };
};

const seedLessons = (): BoardLesson[] => [
  {
    id: 'spread',
    title: 'Spread для массива и объекта',
    done: false,
    notes: ['копия верхнего уровня', 'новая ссылка'],
  },
  {
    id: 'reduce',
    title: 'Reduce как сводка интерфейса',
    done: true,
    notes: ['агрегация', 'derived data'],
  },
  {
    id: 'fetch',
    title: 'Async данные без скрытых мутаций',
    done: false,
    notes: ['loading', 'error', 'success'],
  },
];

const countDone = (lessons: BoardLesson[]) =>
  lessons.reduce((total, lesson) => total + Number(lesson.done), 0);

const buildSummary = (lessons: BoardLesson[]) => ({
  done: countDone(lessons),
  total: lessons.length,
});

export const createLearningBoard = (): LearningBoard => {
  const lessons = seedLessons();

  return {
    title: 'JS data model',
    lessons,
    summary: buildSummary(lessons),
  };
};

export const mutateLessonInPlace = (board: LearningBoard, lessonId: string) => {
  const lesson = board.lessons.find((item) => item.id === lessonId);

  if (lesson) {
    lesson.done = !lesson.done;
  }

  board.summary.done = countDone(board.lessons);
  return board;
};

export const toggleLessonImmutably = (board: LearningBoard, lessonId: string) => {
  const lessons = board.lessons.map((lesson) =>
    lesson.id === lessonId ? { ...lesson, done: !lesson.done } : lesson,
  );

  return {
    ...board,
    lessons,
    summary: buildSummary(lessons),
  };
};

export const buildStrategyPreview = (board: LearningBoard, lessonId: string) => {
  const mutableBase = {
    ...board,
    lessons: board.lessons.map((lesson) => ({ ...lesson })),
    summary: { ...board.summary },
  };
  const mutableNext = mutateLessonInPlace(mutableBase, lessonId);
  const immutableNext = toggleLessonImmutably(board, lessonId);

  return {
    mutable: {
      sameRoot: Object.is(mutableBase, mutableNext),
      sameLessonsArray: Object.is(mutableBase.lessons, mutableNext.lessons),
    },
    immutable: {
      sameRoot: Object.is(board, immutableNext),
      sameLessonsArray: Object.is(board.lessons, immutableNext.lessons),
    },
  };
};
