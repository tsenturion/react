export type CourseLevel = 'База' | 'Продвинутый';
export type Density = 'compact' | 'comfortable';
export type FeedbackChannel = 'slack' | 'email' | 'issue';
export type RepetitionLevel = 'single' | 'multiple';
export type ScenarioComplexity = 'tiny' | 'medium' | 'high';

export type Course = {
  id: string;
  title: string;
  level: CourseLevel;
  featured: boolean;
  track: string;
  minutes: number;
  summary: string;
};

export const courseCatalog: readonly Course[] = [
  {
    id: 'filters-contract',
    title: 'Контракт hook-а для фильтров',
    level: 'База',
    featured: true,
    track: 'State',
    minutes: 18,
    summary: 'Как вернуть наружу только нужные команды и derived data.',
  },
  {
    id: 'workspace-composition',
    title: 'Композиция reusable hooks',
    level: 'Продвинутый',
    featured: true,
    track: 'Architecture',
    minutes: 26,
    summary: 'Как smaller hooks складываются в рабочую модель экрана.',
  },
  {
    id: 'disclosure-patterns',
    title: 'Изоляция disclosure-состояния',
    level: 'База',
    featured: false,
    track: 'UI',
    minutes: 12,
    summary: 'Почему каждый вызов hook-а живёт в своей ветке компонента.',
  },
  {
    id: 'command-api',
    title: 'Command-oriented hook API',
    level: 'Продвинутый',
    featured: false,
    track: 'Architecture',
    minutes: 24,
    summary: 'Как явные команды защищают от утечки внутренних деталей.',
  },
  {
    id: 'abstraction-boundaries',
    title: 'Границы абстракции',
    level: 'Продвинутый',
    featured: true,
    track: 'Architecture',
    minutes: 20,
    summary: 'Когда hook проясняет логику, а когда только прячет шум.',
  },
  {
    id: 'refactor-noise',
    title: 'Refactor шума через custom hook',
    level: 'База',
    featured: false,
    track: 'Forms',
    minutes: 16,
    summary: 'Как вынести состояние формы в читаемую reusable модель.',
  },
] as const;

export type DisclosureTopic = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

export const disclosureTopics: readonly DisclosureTopic[] = [
  {
    id: 'contract',
    title: 'Контракт важнее внутренностей',
    summary: 'Вы смотрите на входы, команды и derived data, а не на сеттеры.',
    detail:
      'Хороший hook прячет внутренние детали и отдаёт наружу только устойчивую модель: состояние, вычисления и намерения пользователя.',
  },
  {
    id: 'composition',
    title: 'Композиция должна оставаться читаемой',
    summary: 'Несколько hooks должны собираться в одну связную историю экрана.',
    detail:
      'Если composed hook всё ещё читается как сценарий продукта, абстракция помогает. Если он просто прячет хаос, граница выбрана неправильно.',
  },
  {
    id: 'boundaries',
    title: 'Не каждый кусок логики заслуживает hook',
    summary: 'Одноразовое вычисление рядом с компонентом часто честнее.',
    detail:
      'Если повторения нет, внутреннего состояния нет и никакой внешней синхронизации нет, отдельный hook только увеличит расстояние до сути.',
  },
] as const;

export type ChecklistItem = {
  id: string;
  title: string;
  owner: string;
  done: boolean;
};

export const initialChecklist: readonly ChecklistItem[] = [
  { id: 'state', title: 'Собрать внутреннее состояние', owner: 'UI', done: true },
  { id: 'commands', title: 'Вывести наружу команды', owner: 'Data', done: false },
  { id: 'derived', title: 'Посчитать derived summary', owner: 'UI', done: false },
  { id: 'reset', title: 'Добавить reset и safe defaults', owner: 'QA', done: false },
] as const;

export type BoundaryScenario = {
  id: string;
  title: string;
  repetition: RepetitionLevel;
  sideEffects: boolean;
  internalState: boolean;
  complexity: ScenarioComplexity;
  shareableAcrossComponents: boolean;
  note: string;
};

export const boundaryPresets: readonly BoundaryScenario[] = [
  {
    id: 'single-inline',
    title: 'Один local toggle в одном компоненте',
    repetition: 'single',
    sideEffects: false,
    internalState: true,
    complexity: 'tiny',
    shareableAcrossComponents: false,
    note: 'Поведение локальное и одноразовое.',
  },
  {
    id: 'reused-sync',
    title: 'Повторяемый workflow с localStorage и фильтрами',
    repetition: 'multiple',
    sideEffects: true,
    internalState: true,
    complexity: 'high',
    shareableAcrossComponents: true,
    note: 'Логика повторяется и синхронизируется с внешней системой.',
  },
  {
    id: 'derived-only',
    title: 'Чистое derived вычисление без состояния',
    repetition: 'multiple',
    sideEffects: false,
    internalState: false,
    complexity: 'medium',
    shareableAcrossComponents: true,
    note: 'Скорее кандидат на pure helper, а не на hook.',
  },
] as const;

export const feedbackChannelLabels: Record<FeedbackChannel, string> = {
  slack: 'Slack',
  email: 'email',
  issue: 'issue tracker',
};
