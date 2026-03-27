export type RouteSplitStrategy =
  | 'eager-all'
  | 'lazy-pages'
  | 'lazy-pages-and-tools'
  | 'oversplit';

export type RouteTarget = 'overview' | 'analytics' | 'settings' | 'editor';

export function describeRouteSplitScenario(input: {
  strategy: RouteSplitStrategy;
  target: RouteTarget;
}) {
  const targetLabel =
    input.target === 'overview'
      ? 'overview route'
      : input.target === 'analytics'
        ? 'analytics route'
        : input.target === 'settings'
          ? 'settings route'
          : 'editor route';

  switch (input.strategy) {
    case 'eager-all':
      return {
        targetLabel,
        fallbackScope: 'нет отдельного route fallback',
        shellPersistence: 'shell не ждёт, но весь код уже внутри первого bundle',
        tradeoff:
          'Простой runtime, но тяжёлые редкие экраны увеличивают initial payload даже для коротких сессий.',
      };
    case 'lazy-pages':
      return {
        targetLabel,
        fallbackScope: 'main outlet',
        shellPersistence: 'shell, header и навигация остаются на месте',
        tradeoff:
          'Часто это самый устойчивый баланс: route chunk грузится отдельно, а shell не схлопывается.',
      };
    case 'lazy-pages-and-tools':
      return {
        targetLabel,
        fallbackScope: 'main outlet + локальные widget boundaries',
        shellPersistence: 'shell и экран приходят постепенно',
        tradeoff:
          'Подходит для тяжёлых экранов с отдельными chart/editor зонами, если у каждого split point есть своя UX-граница.',
      };
    case 'oversplit':
      return {
        targetLabel,
        fallbackScope: 'много мелких fallback-островов',
        shellPersistence:
          'shell формально жив, но сценарий распадается на серию догрузок',
        tradeoff:
          'Слишком мелкий split часто даёт больше сетевой дробности и loading-шума, чем реальной пользы.',
      };
  }
}
