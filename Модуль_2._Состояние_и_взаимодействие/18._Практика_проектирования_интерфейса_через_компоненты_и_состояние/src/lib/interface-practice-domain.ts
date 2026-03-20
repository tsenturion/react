export type LessonTrack = 'state' | 'architecture' | 'forms';
export type LessonStatus = 'planned' | 'active' | 'done';
export type TrackFilter = 'all' | LessonTrack;

export type LessonItem = {
  id: string;
  title: string;
  module: string;
  track: LessonTrack;
  status: LessonStatus;
  duration: number;
  progress: number;
  favorite: boolean;
  seedDraft: string;
};

const lessonCatalog: readonly LessonItem[] = [
  {
    id: 'lesson-12',
    title: 'useState snapshot',
    module: 'Модуль 2',
    track: 'state',
    status: 'done',
    duration: 18,
    progress: 100,
    favorite: true,
    seedDraft:
      'Показать, почему state нельзя читать как мгновенно изменившуюся переменную.',
  },
  {
    id: 'lesson-14',
    title: 'Архитектура состояния',
    module: 'Модуль 2',
    track: 'architecture',
    status: 'active',
    duration: 24,
    progress: 68,
    favorite: false,
    seedDraft: 'Связать owner state и derived values с конкретными зонами интерфейса.',
  },
  {
    id: 'lesson-16',
    title: 'Формы в React',
    module: 'Модуль 2',
    track: 'forms',
    status: 'planned',
    duration: 21,
    progress: 0,
    favorite: false,
    seedDraft: 'Собрать controlled flow без дублирования selected object и ошибок reset.',
  },
  {
    id: 'lesson-17',
    title: 'Идентичность состояния',
    module: 'Модуль 2',
    track: 'architecture',
    status: 'active',
    duration: 26,
    progress: 44,
    favorite: true,
    seedDraft:
      'Показать, как key и slot дерева влияют на preserving and resetting state.',
  },
] as const;

export function createLessonCatalog() {
  return lessonCatalog.map((item) => ({ ...item }));
}

export function createDraftMap() {
  return Object.fromEntries(
    lessonCatalog.map((item) => [item.id, item.seedDraft]),
  ) as Record<string, string>;
}

export type BlueprintPresetId = 'course-console' | 'review-desk' | 'progress-board';

export type BlueprintPreset = {
  id: BlueprintPresetId;
  title: string;
  brief: string;
  highlights: readonly string[];
};

const blueprintPresets: readonly BlueprintPreset[] = [
  {
    id: 'course-console',
    title: 'Консоль уроков',
    brief:
      'Экран показывает поиск, фильтр по трекам, список уроков, выбранный урок справа и draft заметки. Сверху нужна сводка по прогрессу и избранным урокам.',
    highlights: ['поиск', 'фильтр', 'список', 'details', 'draft', 'summary'],
  },
  {
    id: 'review-desk',
    title: 'Панель ревью',
    brief:
      'Экран показывает очередь карточек, текущий выбранный запрос, quick actions approve/reject и ленту последних решений. Сверху нужна сводка по очереди и SLA.',
    highlights: ['queue', 'selection', 'actions', 'activity', 'summary'],
  },
  {
    id: 'progress-board',
    title: 'Доска прогресса',
    brief:
      'Экран показывает колонки planned / active / done, карточки уроков, фильтр по модулю и панель аналитики по длительности и завершённости.',
    highlights: ['columns', 'cards', 'filter', 'analytics'],
  },
] as const;

export function createBlueprintPresets() {
  return blueprintPresets.map((item) => ({ ...item, highlights: [...item.highlights] }));
}
