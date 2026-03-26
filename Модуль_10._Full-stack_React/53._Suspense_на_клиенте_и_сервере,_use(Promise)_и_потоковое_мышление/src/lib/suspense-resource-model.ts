export type ClientSceneId = 'release' | 'academy' | 'support';
export type PanelId = 'summary' | 'details' | 'activity';
export type StudyCardId = 'boundaries' | 'use-promise' | 'server-streaming';
export type StudySegmentId = 'summary' | 'client' | 'server';

export type ScenePanel = {
  id: PanelId;
  label: string;
  delayMs: number;
  title: string;
  lines: readonly string[];
};

export type ClientScene = {
  id: ClientSceneId;
  label: string;
  note: string;
  panels: readonly ScenePanel[];
};

export type StudyCard = {
  id: StudyCardId;
  label: string;
  summary: string;
  client: string;
  server: string;
};

export const clientScenes: readonly ClientScene[] = [
  {
    id: 'release',
    label: 'Release room',
    note: 'Главный status, детали rollout и активность приходят с разной скоростью.',
    panels: [
      {
        id: 'summary',
        label: 'Summary',
        delayMs: 120,
        title: 'Release summary',
        lines: ['Main status: green', 'Deploy window: 14:00 UTC', 'Risk level: medium'],
      },
      {
        id: 'details',
        label: 'Details',
        delayMs: 420,
        title: 'Rollout checklist',
        lines: ['Edge rollout at 20%', 'DB migration pending', 'API contract verified'],
      },
      {
        id: 'activity',
        label: 'Activity',
        delayMs: 680,
        title: 'Recent activity',
        lines: ['2 alerts silenced', '1 canary error retried', 'Traffic normalized'],
      },
    ],
  },
  {
    id: 'academy',
    label: 'Academy page',
    note: 'Сводка курса приходит быстро, glossary и progress timeline отстают.',
    panels: [
      {
        id: 'summary',
        label: 'Summary',
        delayMs: 90,
        title: 'Lesson snapshot',
        lines: ['Topic: Suspense', 'Track: Full-stack React', 'Difficulty: advanced'],
      },
      {
        id: 'details',
        label: 'Details',
        delayMs: 360,
        title: 'Concept glossary',
        lines: ['Boundary', 'Resource reading', 'Streamed shell'],
      },
      {
        id: 'activity',
        label: 'Activity',
        delayMs: 520,
        title: 'Practice activity',
        lines: ['2 labs finished', '1 mismatch reproduced', '1 note saved'],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support console',
    note: 'Клиентский shell нужен быстро, но история и связанный контекст читаются дольше.',
    panels: [
      {
        id: 'summary',
        label: 'Summary',
        delayMs: 110,
        title: 'Ticket overview',
        lines: ['Priority: high', 'Customer tier: pro', 'Open since: 18m'],
      },
      {
        id: 'details',
        label: 'Details',
        delayMs: 390,
        title: 'Investigation context',
        lines: ['Token refreshed', 'CDN cache stale', 'Locale mismatch suspected'],
      },
      {
        id: 'activity',
        label: 'Activity',
        delayMs: 610,
        title: 'Timeline',
        lines: ['Call scheduled', 'Escalation prepared', 'Notes shared with infra'],
      },
    ],
  },
] as const;

export const studyCards: readonly StudyCard[] = [
  {
    id: 'boundaries',
    label: 'Boundary design',
    summary: 'Граница решает, какая часть UI может ждать отдельно от остального дерева.',
    client:
      'На клиенте Suspense позволяет сохранить уже отрисованный UI и заменить fallback только в нужной области.',
    server:
      'На сервере та же граница становится местом, где shell можно отдать раньше, а содержимое достроить позже.',
  },
  {
    id: 'use-promise',
    label: 'use(Promise)',
    summary:
      'use(Promise) делает ожидание ресурсом render phase и убирает лишнюю ручную обвязку вокруг loading state.',
    client:
      'Если один и тот же promise читают несколько компонент с общим cache key, они разделяют ожидание и результат.',
    server:
      'На сервере use(Promise) даёт тот же mental model, но вместе со Suspense влияет ещё и на поток выдачи HTML.',
  },
  {
    id: 'server-streaming',
    label: 'Server streaming',
    summary:
      'Streaming нужен там, где shell должен появиться раньше полной готовности тяжёлых секций.',
    client:
      'Клиентская граница сама по себе не ускоряет появление HTML: она только управляет ожиданием уже после старта клиента.',
    server:
      'Серверная Suspense boundary может реально разделить ответ на shell и поздние chunks с контентом.',
  },
] as const;

export function getClientScene(id: ClientSceneId): ClientScene {
  return clientScenes.find((item) => item.id === id) ?? clientScenes[0];
}

export function getScenePanel(sceneId: ClientSceneId, panelId: PanelId): ScenePanel {
  return (
    getClientScene(sceneId).panels.find((panel) => panel.id === panelId) ??
    getClientScene(sceneId).panels[0]
  );
}

export function getStudyCard(id: StudyCardId): StudyCard {
  return studyCards.find((item) => item.id === id) ?? studyCards[0];
}
