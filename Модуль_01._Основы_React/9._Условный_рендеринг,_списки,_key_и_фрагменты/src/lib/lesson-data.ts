export type LessonTrack = 'core' | 'patterns' | 'testing';
export type LessonStatus = 'open' | 'draft' | 'archived';

export type LessonRecord = {
  id: string;
  title: string;
  track: LessonTrack;
  status: LessonStatus;
  durationMinutes: number;
  seatsLeft: number;
  mentor: string;
  hasLiveReview: boolean;
  summary: string;
};

export const lessonCatalog: readonly LessonRecord[] = [
  {
    id: 'conditional-ui',
    title: 'Условный UI без лишних веток',
    track: 'core',
    status: 'open',
    durationMinutes: 34,
    seatsLeft: 18,
    mentor: 'Ирина',
    hasLiveReview: true,
    summary: 'Сравнение `if`, ternary и `&&` на одном и том же блоке интерфейса.',
  },
  {
    id: 'list-mapping',
    title: 'Списки из данных и фильтры',
    track: 'core',
    status: 'open',
    durationMinutes: 46,
    seatsLeft: 7,
    mentor: 'Максим',
    hasLiveReview: true,
    summary: 'Как фильтрация и `map(...)` собирают динамический каталог.',
  },
  {
    id: 'stable-keys',
    title: 'Стабильные ключи и identity',
    track: 'patterns',
    status: 'open',
    durationMinutes: 52,
    seatsLeft: 4,
    mentor: 'Наталья',
    hasLiveReview: false,
    summary: 'Почему `key` должен описывать элемент, а не его текущую позицию.',
  },
  {
    id: 'fragment-rows',
    title: 'Фрагменты в структурной разметке',
    track: 'patterns',
    status: 'draft',
    durationMinutes: 39,
    seatsLeft: 0,
    mentor: 'Павел',
    hasLiveReview: false,
    summary:
      'Как вернуть несколько siblings без лишней обёртки и не сломать DOM-структуру.',
  },
  {
    id: 'ui-bug-hunt',
    title: 'Баги состояния при плохих ключах',
    track: 'testing',
    status: 'archived',
    durationMinutes: 41,
    seatsLeft: 0,
    mentor: 'Елена',
    hasLiveReview: true,
    summary:
      'Скрытые артефакты фильтрации, reorder и локального состояния item-компонентов.',
  },
] as const;

export function formatTrack(track: LessonTrack | 'all') {
  if (track === 'all') return 'Все направления';

  return (
    {
      core: 'База React',
      patterns: 'Паттерны',
      testing: 'Тестирование',
    } as const
  )[track];
}

export function formatStatus(status: LessonStatus) {
  return (
    {
      open: 'Открыт',
      draft: 'Черновик',
      archived: 'Архив',
    } as const
  )[status];
}
