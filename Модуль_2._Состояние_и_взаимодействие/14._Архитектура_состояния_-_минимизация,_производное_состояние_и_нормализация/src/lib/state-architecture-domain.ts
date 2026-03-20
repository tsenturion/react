export type PlanningTask = {
  id: string;
  title: string;
  done: boolean;
  track: 'state' | 'architecture' | 'performance';
  estimate: number;
};

export function createPlanningTasks(): PlanningTask[] {
  return [
    {
      id: 'task-1',
      title: 'Свести state к минимальному ядру',
      done: false,
      track: 'state',
      estimate: 2,
    },
    {
      id: 'task-2',
      title: 'Убрать duplicated filters',
      done: true,
      track: 'architecture',
      estimate: 1,
    },
    {
      id: 'task-3',
      title: 'Оставить totals производными',
      done: false,
      track: 'performance',
      estimate: 3,
    },
  ];
}

export type PricingLine = {
  id: string;
  title: string;
  qty: number;
  price: number;
};

export function createPricingLines(): PricingLine[] {
  return [
    { id: 'line-1', title: 'Практикум по state', qty: 1, price: 120 },
    { id: 'line-2', title: 'Разбор derived state', qty: 2, price: 80 },
  ];
}

export type LessonRecord = {
  id: string;
  title: string;
  mentor: string;
  level: 'base' | 'advanced';
};

export function createLessonRecords(): LessonRecord[] {
  return [
    { id: 'lesson-1', title: 'Минимальный state', mentor: 'Анна', level: 'base' },
    { id: 'lesson-2', title: 'Colocated state', mentor: 'Борис', level: 'advanced' },
    { id: 'lesson-3', title: 'Normalization', mentor: 'Вера', level: 'advanced' },
  ];
}

export type SectionCard = {
  id: string;
  title: string;
  summary: string;
};

export function createSectionCards(): SectionCard[] {
  return [
    {
      id: 'card-1',
      title: 'Фильтры каталога',
      summary: 'Обычно нужны и toolbar, и list.',
    },
    {
      id: 'card-2',
      title: 'Открыт ли help-блок',
      summary: 'Часто нужен только одному leaf-компоненту.',
    },
    {
      id: 'card-3',
      title: 'Результат поиска',
      summary: 'Как правило, вычисляется из query и items.',
    },
  ];
}

export type PlacementScenario = {
  onlyOneLeafUsesIt: boolean;
  neededBySiblings: boolean;
  derivedFromOtherState: boolean;
  serverOwned: boolean;
  mustPersistAcrossPages: boolean;
  duplicatedAcrossBranches: boolean;
};

export function createPlacementScenario(): PlacementScenario {
  return {
    onlyOneLeafUsesIt: true,
    neededBySiblings: false,
    derivedFromOtherState: false,
    serverOwned: false,
    mustPersistAcrossPages: false,
    duplicatedAcrossBranches: false,
  };
}

export type DuplicatedTeacherCard = {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
};

export type DuplicatedDirectoryState = {
  cards: DuplicatedTeacherCard[];
  spotlightTeacher: { id: string; name: string };
};

export function createDuplicatedDirectory(): DuplicatedDirectoryState {
  return {
    cards: [
      {
        id: 'card-a',
        title: 'State design review',
        teacherId: 'teacher-1',
        teacherName: 'Анна',
      },
      {
        id: 'card-b',
        title: 'Derived values workshop',
        teacherId: 'teacher-1',
        teacherName: 'Анна',
      },
      {
        id: 'card-c',
        title: 'Normalization clinic',
        teacherId: 'teacher-2',
        teacherName: 'Борис',
      },
    ],
    spotlightTeacher: {
      id: 'teacher-1',
      name: 'Анна',
    },
  };
}

export type NormalizedTeacher = {
  id: string;
  name: string;
};

export type NormalizedLessonCard = {
  id: string;
  title: string;
  teacherId: string;
};

export type NormalizedDirectoryState = {
  cardOrder: string[];
  cardsById: Record<string, NormalizedLessonCard>;
  teachersById: Record<string, NormalizedTeacher>;
  spotlightTeacherId: string;
};

export function createNormalizedDirectory(): NormalizedDirectoryState {
  return {
    cardOrder: ['card-a', 'card-b', 'card-c'],
    cardsById: {
      'card-a': {
        id: 'card-a',
        title: 'State design review',
        teacherId: 'teacher-1',
      },
      'card-b': {
        id: 'card-b',
        title: 'Derived values workshop',
        teacherId: 'teacher-1',
      },
      'card-c': {
        id: 'card-c',
        title: 'Normalization clinic',
        teacherId: 'teacher-2',
      },
    },
    teachersById: {
      'teacher-1': { id: 'teacher-1', name: 'Анна' },
      'teacher-2': { id: 'teacher-2', name: 'Борис' },
    },
    spotlightTeacherId: 'teacher-1',
  };
}
