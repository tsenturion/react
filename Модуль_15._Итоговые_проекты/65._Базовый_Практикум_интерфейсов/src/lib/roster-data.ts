export type RosterTrack = 'state' | 'forms' | 'architecture';
export type RosterStatus = 'ready' | 'review' | 'blocked';

export type RosterMember = {
  id: string;
  name: string;
  city: string;
  email?: string;
  track: RosterTrack;
  status: RosterStatus;
  progress: number;
  mentor: string;
  project: string;
  accessibilityFocus: boolean;
  bio?: string;
  teamName?: string;
  wantsDigest?: boolean;
};

export const trackLabels: Record<RosterTrack, string> = {
  state: 'State',
  forms: 'Forms',
  architecture: 'Architecture',
};

export const statusLabels: Record<RosterStatus, string> = {
  ready: 'Готов',
  review: 'Нужна проверка',
  blocked: 'Есть блокер',
};

export const rosterMembers: readonly RosterMember[] = [
  {
    id: 'nina-litvinova',
    name: 'Нина Литвинова',
    city: 'Екатеринбург',
    email: 'nina@example.com',
    track: 'state',
    status: 'ready',
    progress: 92,
    mentor: 'Антон Воробьёв',
    project: 'Tic-Tac-Toe с time travel',
    accessibilityFocus: true,
    bio: 'Любит проекты с живой историей действий и прозрачным поведением интерфейса.',
    wantsDigest: true,
  },
  {
    id: 'ivan-repin',
    name: 'Иван Репин',
    city: 'Казань',
    email: 'ivan@example.com',
    track: 'forms',
    status: 'review',
    progress: 74,
    mentor: 'Мария Тихонова',
    project: 'Форма регистрации и submit flow',
    accessibilityFocus: false,
    bio: 'Фокусируется на UX форм и валидации без лишнего дублирования состояния.',
    wantsDigest: true,
  },
  {
    id: 'sofia-ermakova',
    name: 'София Ермакова',
    city: 'Пермь',
    email: 'sofia@example.com',
    track: 'architecture',
    status: 'ready',
    progress: 86,
    mentor: 'Лев Смирнов',
    project: 'Фильтруемая таблица данных',
    accessibilityFocus: true,
    bio: 'Собирает админские интерфейсы, где важны фильтры, таблицы и детали записи.',
    wantsDigest: false,
  },
  {
    id: 'maksim-gromov',
    name: 'Максим Громов',
    city: 'Новосибирск',
    email: 'maksim@example.com',
    track: 'state',
    status: 'blocked',
    progress: 48,
    mentor: 'Антон Воробьёв',
    project: 'Дублирование derived state',
    accessibilityFocus: false,
    bio: 'Разбирает, почему ручная синхронизация summary и списка быстро ломает экран.',
    wantsDigest: true,
  },
  {
    id: 'alisa-kopeva',
    name: 'Алиса Копева',
    city: 'Тюмень',
    email: 'alisa@example.com',
    track: 'forms',
    status: 'ready',
    progress: 89,
    mentor: 'Мария Тихонова',
    project: 'Условная валидация и a11y',
    accessibilityFocus: true,
    bio: 'Смотрит на формы как на полноценный пользовательский сценарий, а не набор input-ов.',
    wantsDigest: true,
  },
  {
    id: 'timur-vlasov',
    name: 'Тимур Власов',
    city: 'Самара',
    email: 'timur@example.com',
    track: 'architecture',
    status: 'review',
    progress: 68,
    mentor: 'Лев Смирнов',
    project: 'Stable keys и selection boundary',
    accessibilityFocus: true,
    bio: 'Делает рабочие панели, где выбор строки должен переживать сортировку и поиск.',
    wantsDigest: false,
  },
];
