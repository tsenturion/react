import type { TrackFilter } from './interface-practice-domain';

export type FlowAction = 'search' | 'track' | 'select' | 'favorite' | 'draft';

export type FlowSnapshot = {
  query: string;
  activeTrack: TrackFilter;
  selectedTitle: string;
  visibleCount: number;
  favoriteCount: number;
  draftLength: number;
};

export type FlowEntry = {
  actionLine: string;
  stateLine: string;
  renderLine: string;
  visualLine: string;
};

export function buildFlowEntry(action: FlowAction, snapshot: FlowSnapshot): FlowEntry {
  const actionLine =
    action === 'search'
      ? 'Действие: изменён query в строке поиска.'
      : action === 'track'
        ? 'Действие: переключён фильтр трека.'
        : action === 'select'
          ? 'Действие: выбран другой урок в списке.'
          : action === 'favorite'
            ? 'Действие: переключён favorite у урока.'
            : 'Действие: изменён draft в details panel.';

  return {
    actionLine,
    stateLine: `State: query="${snapshot.query}", track="${snapshot.activeTrack}", selected="${snapshot.selectedTitle}", visible=${snapshot.visibleCount}, favorites=${snapshot.favoriteCount}, draftLength=${snapshot.draftLength}.`,
    renderLine:
      'Render: React повторно вычисляет visibleLessons, selectedLesson и summary из актуального состояния.',
    visualLine: `UI: список показывает ${snapshot.visibleCount} элементов, details открыты на "${snapshot.selectedTitle}".`,
  };
}
