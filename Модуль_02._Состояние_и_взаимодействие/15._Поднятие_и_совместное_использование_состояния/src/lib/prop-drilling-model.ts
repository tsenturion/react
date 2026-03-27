export type PropDrillingReport = {
  depth: number;
  forwardedProps: number;
  summary: string;
  snippet: string;
};

export function buildPropDrillingReport(
  depth: number,
  forwardedPropNames: string[],
): PropDrillingReport {
  return {
    depth,
    forwardedProps: depth * forwardedPropNames.length,
    summary:
      'Prop drilling не является “ошибкой по умолчанию”, но это реальное следствие архитектуры дерева: промежуточные компоненты прокидывают дальше чужие value и callbacks, даже если сами не используют их как бизнес-данные.',
    snippet: [
      '<Shell selectedTrack={track} onTrackChange={setTrack}>',
      '  <SidebarFrame selectedTrack={track} onTrackChange={setTrack}>',
      '    <LeafCard selectedTrack={track} onTrackChange={setTrack} />',
      '  </SidebarFrame>',
      '</Shell>',
    ].join('\n'),
  };
}
