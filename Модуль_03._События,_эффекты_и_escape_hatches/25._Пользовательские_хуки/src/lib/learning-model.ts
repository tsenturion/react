export type StatusTone = 'success' | 'warn' | 'error';

export type LabId =
  | 'contract'
  | 'composition'
  | 'reuse'
  | 'api'
  | 'boundary'
  | 'refactor';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'contract',
    label: '1. Контракт',
    blurb: 'Как hook возвращает входы, команды и derived data.',
  },
  {
    id: 'composition',
    label: '2. Композиция',
    blurb: 'Как smaller hooks собираются в один экранный workflow.',
  },
  {
    id: 'reuse',
    label: '3. Переиспользование',
    blurb: 'Как один и тот же hook даёт изолированное состояние разным веткам.',
  },
  {
    id: 'api',
    label: '4. API hook-а',
    blurb: 'Как explicit commands делают поведение стабильнее raw setter-ов.',
  },
  {
    id: 'boundary',
    label: '5. Границы',
    blurb: 'Когда hook нужен, а когда он только прячет лишнюю сложность.',
  },
  {
    id: 'refactor',
    label: '6. Очистка шума',
    blurb: 'Как custom hook превращает шум формы в читаемую модель.',
  },
] as const;
