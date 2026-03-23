export type BoundaryPlacement = 'local' | 'shared';

export function getIsolationMetrics(
  placement: BoundaryPlacement,
  totalWidgets: number,
  crashedWidgets: number,
) {
  const lostWidgets =
    crashedWidgets === 0 ? 0 : placement === 'shared' ? totalWidgets : crashedWidgets;
  const healthyWidgets = Math.max(totalWidgets - lostWidgets, 0);

  return {
    lostWidgets,
    healthyWidgets,
    scopeLabel:
      placement === 'shared' ? 'Падает весь раздел' : 'Падает только проблемный widget',
    explanation:
      placement === 'shared'
        ? 'Один boundary над несколькими карточками даёт общий fallback и общий blast radius.'
        : 'Локальные boundaries оставляют соседние части интерфейса рабочими.',
  };
}
