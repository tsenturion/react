export type TrackId = 'react-core' | 'design-systems' | 'testing';
export type CourseLevel = 'base' | 'advanced';

export type CourseRecord = {
  id: string;
  title: string;
  trackId: TrackId;
  trackLabel: string;
  level: CourseLevel;
  durationMinutes: number;
  seatsLeft: number;
  mentor: string;
  summary: string;
};

export const courseCatalog: readonly CourseRecord[] = [
  {
    id: 'props-basics',
    title: 'Props как контракт компонента',
    trackId: 'react-core',
    trackLabel: 'React Core',
    level: 'base',
    durationMinutes: 42,
    seatsLeft: 14,
    mentor: 'Ирина',
    summary: 'Как входные данные управляют отображением без скрытых зависимостей.',
  },
  {
    id: 'children-slots',
    title: 'Children и slot-based композиция',
    trackId: 'react-core',
    trackLabel: 'React Core',
    level: 'advanced',
    durationMinutes: 55,
    seatsLeft: 6,
    mentor: 'Павел',
    summary: 'Как передавать не только значения, но и готовые фрагменты интерфейса.',
  },
  {
    id: 'api-design',
    title: 'Проектирование API компонентов',
    trackId: 'design-systems',
    trackLabel: 'Design Systems',
    level: 'advanced',
    durationMinutes: 48,
    seatsLeft: 9,
    mentor: 'Наталья',
    summary: 'Как сделать props понятными и масштабируемыми.',
  },
  {
    id: 'component-testing',
    title: 'Компонентное мышление в тестах',
    trackId: 'testing',
    trackLabel: 'Testing',
    level: 'base',
    durationMinutes: 36,
    seatsLeft: 18,
    mentor: 'Максим',
    summary: 'Как изолированный компонент упрощает сценарии тестирования.',
  },
] as const;

export function getCourseById(id: string) {
  return courseCatalog.find((course) => course.id === id) ?? courseCatalog[0];
}

export function formatDuration(minutes: number) {
  return `${minutes} мин`;
}

export function getTrackLabel(trackId: TrackId | 'all') {
  if (trackId === 'all') return 'Все направления';

  return (
    courseCatalog.find((course) => course.trackId === trackId)?.trackLabel ??
    'Неизвестный трек'
  );
}
