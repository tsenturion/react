export type LessonLevel = 'base' | 'applied' | 'async' | 'data';
export type ModuleKind = 'syntax' | 'modules' | 'collections' | 'async';

export type LessonCard = {
  id: string;
  title: string;
  level: LessonLevel;
  kind: ModuleKind;
  ready: boolean;
  duration: number;
  tags: string[];
  summary: string;
};

// Модуль намеренно сочетает named exports и default export,
// потому что тема про import/export должна быть выражена в самом проекте.
export const lessonCards: LessonCard[] = [
  {
    id: 'syntax-operators',
    title: 'Выражения и операторы',
    level: 'base',
    kind: 'syntax',
    ready: true,
    duration: 14,
    tags: ['const', 'template', 'optional chaining'],
    summary: 'Деструктуризация, шаблонные строки и безопасный доступ к полям.',
  },
  {
    id: 'module-contracts',
    title: 'Контракты модулей',
    level: 'base',
    kind: 'modules',
    ready: true,
    duration: 16,
    tags: ['import', 'export', 'esm'],
    summary: 'Как named и default exports распределяют ответственность по файлам.',
  },
  {
    id: 'collection-pipelines',
    title: 'Цепочки коллекций',
    level: 'data',
    kind: 'collections',
    ready: true,
    duration: 22,
    tags: ['map', 'filter', 'reduce'],
    summary: 'Один массив порождает карточки, метрики и сводки.',
  },
  {
    id: 'closure-handlers',
    title: 'Closures в обработчиках',
    level: 'applied',
    kind: 'syntax',
    ready: true,
    duration: 18,
    tags: ['closure', 'handlers'],
    summary: 'Функции запоминают данные рендера и влияют на итог обработчика.',
  },
  {
    id: 'async-fetch',
    title: 'Асинхронный fetch',
    level: 'async',
    kind: 'async',
    ready: true,
    duration: 24,
    tags: ['promise', 'async/await', 'fetch'],
    summary: 'Loading, success и error-состояния как часть интерфейса.',
  },
  {
    id: 'immutable-state',
    title: 'Иммутабельные обновления',
    level: 'data',
    kind: 'collections',
    ready: true,
    duration: 20,
    tags: ['immutability', 'objects', 'arrays'],
    summary: 'Почему одна и та же ссылка ломает предсказуемость React-состояния.',
  },
];

export const moduleKinds = ['syntax', 'modules', 'collections', 'async'] as const;

export const describeLesson = (lesson: LessonCard) =>
  `${lesson.title} • ${lesson.tags.join(', ')}`;

const goalWeights: Record<ModuleKind, number> = {
  syntax: 1,
  modules: 2,
  collections: 3,
  async: 4,
};

const pickRecommendedLesson = (items: LessonCard[], goal: ModuleKind) =>
  [...items].sort((left, right) => {
    const leftDistance = Math.abs(goalWeights[left.kind] - goalWeights[goal]);
    const rightDistance = Math.abs(goalWeights[right.kind] - goalWeights[goal]);

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }

    return left.duration - right.duration;
  })[0];

export default pickRecommendedLesson;
