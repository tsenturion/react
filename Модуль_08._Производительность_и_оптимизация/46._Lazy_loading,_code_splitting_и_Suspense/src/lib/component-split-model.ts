export type ComponentSplitMode = 'eager' | 'lazy';
export type ComponentPanel = 'bundle-radar' | 'preview-studio' | 'audit-console';

export function describeComponentSplitScenario(input: {
  mode: ComponentSplitMode;
  panel: ComponentPanel;
  isOpen: boolean;
}) {
  const panelTitle =
    input.panel === 'bundle-radar'
      ? 'Bundle radar'
      : input.panel === 'preview-studio'
        ? 'Preview studio'
        : 'Audit console';

  if (input.mode === 'eager') {
    return {
      panelTitle,
      headline: 'Виджет доступен мгновенно, но его цена уже включена в initial bundle',
      detail:
        'Eager import не требует Suspense boundary, но платит за тяжёлый код даже в тех сессиях, где виджет так и не откроется.',
      bundleImpact: 'upfront bundle cost',
      waitingExperience: input.isOpen ? 'без ожидания' : 'код уже загружен заранее',
    };
  }

  return {
    panelTitle,
    headline: 'Виджет платит за себя только при открытии',
    detail:
      'React.lazy держит тяжёлую панель вне стартового payload, но теперь нужен локальный fallback и понятный UX ожидания.',
    bundleImpact: 'pay on intent',
    waitingExperience: input.isOpen
      ? 'локальный fallback до прихода chunk'
      : 'до открытия код не запрашивается',
  };
}
