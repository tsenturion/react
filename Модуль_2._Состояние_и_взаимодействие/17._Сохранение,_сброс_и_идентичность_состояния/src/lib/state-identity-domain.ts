export type ReviewerProfile = {
  id: string;
  name: string;
  role: string;
  seedDraft: string;
  seedTitle: string;
  accent: string;
};

const reviewerProfiles: readonly ReviewerProfile[] = [
  {
    id: 'layout',
    name: 'Лена',
    role: 'Design review',
    seedDraft: 'Проверить контраст и шаг типографики.',
    seedTitle: 'Дизайн ревью',
    accent: 'teal',
  },
  {
    id: 'api',
    name: 'Марат',
    role: 'API review',
    seedDraft: 'Согласовать формат ошибок и retries.',
    seedTitle: 'API ревью',
    accent: 'amber',
  },
  {
    id: 'state',
    name: 'Ольга',
    role: 'State review',
    seedDraft: 'Проверить ключи, reset и owner state.',
    seedTitle: 'Ревью состояния',
    accent: 'blue',
  },
] as const;

export function createReviewerProfiles() {
  return reviewerProfiles.map((profile) => ({ ...profile }));
}

export type LessonRow = {
  id: string;
  title: string;
  track: string;
  seedNote: string;
};

const lessonRows: readonly LessonRow[] = [
  {
    id: 'lesson-12',
    title: 'useState snapshot',
    track: 'state',
    seedNote: 'Сравнить stale state и functional updates.',
  },
  {
    id: 'lesson-13',
    title: 'Иммутабельность',
    track: 'data',
    seedNote: 'Поймать мутацию объекта в nested state.',
  },
  {
    id: 'lesson-14',
    title: 'Архитектура state',
    track: 'architecture',
    seedNote: 'Убрать duplicate state и вычислять derived values.',
  },
  {
    id: 'lesson-15',
    title: 'Поднятие state',
    track: 'sharing',
    seedNote: 'Определить owner для shared filters.',
  },
] as const;

export function createLessonRows() {
  return lessonRows.map((item) => ({ ...item }));
}
