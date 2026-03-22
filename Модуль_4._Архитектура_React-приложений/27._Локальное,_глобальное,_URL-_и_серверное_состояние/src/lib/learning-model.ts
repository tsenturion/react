export type StatusTone = 'success' | 'warn' | 'error';

export type LabId = 'local' | 'global' | 'url' | 'server' | 'advisor' | 'architecture';

export const lessonLabs: readonly {
  id: LabId;
  label: string;
  blurb: string;
}[] = [
  {
    id: 'local',
    label: '1. Local state',
    blurb: 'Состояние, которое нужно только одной ветке интерфейса.',
  },
  {
    id: 'global',
    label: '2. Global state',
    blurb: 'Состояние, которое синхронизирует далёкие части дерева.',
  },
  {
    id: 'url',
    label: '3. URL state',
    blurb: 'Состояние, которое должно переживать reload и делиться ссылкой.',
  },
  {
    id: 'server',
    label: '4. Server state',
    blurb: 'Данные, которые приходят извне, кешируются и перевалидируются.',
  },
  {
    id: 'advisor',
    label: '5. Trade-offs',
    blurb: 'Как выбрать правильное место хранения по сигналам сценария.',
  },
  {
    id: 'architecture',
    label: '6. Общая архитектура',
    blurb: 'Как local, global, URL и server state работают вместе в одном экране.',
  },
] as const;
