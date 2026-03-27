import type { StatusTone } from './learning-model';

export type RenderScreen = 'catalog' | 'lesson' | 'summary';
export type RenderDensity = 'comfortable' | 'compact';

export type RenderCommitControls = {
  screen: RenderScreen;
  density: RenderDensity;
  showSidebar: boolean;
  revision: number;
};

export type RenderCommitReport = {
  signature: string;
  visibleNodeCount: number;
  renderSummary: string;
  commitLabel: string;
  tone: StatusTone;
  renderSteps: string[];
  snippet: string;
};

const baseNodeCountByScreen: Record<RenderScreen, number> = {
  catalog: 9,
  lesson: 7,
  summary: 6,
};

export function buildRenderCommitReport(
  controls: RenderCommitControls,
): RenderCommitReport {
  const visibleNodeCount =
    baseNodeCountByScreen[controls.screen] +
    (controls.showSidebar ? 2 : 0) +
    (controls.density === 'compact' ? 0 : 1);

  return {
    signature: [
      controls.screen,
      controls.density,
      controls.showSidebar ? 'sidebar' : 'plain',
      controls.revision,
    ].join(':'),
    visibleNodeCount,
    renderSummary:
      controls.screen === 'catalog'
        ? 'Render-фаза вычисляет список карточек, фильтры и служебные панели как описание будущего UI.'
        : controls.screen === 'lesson'
          ? 'Render-фаза собирает структуру урока: заголовок, контент, блок прогресса и вспомогательные секции.'
          : 'Render-фаза строит итоговый экран со сводкой без ручных DOM-операций.',
    commitLabel: `Commit ${controls.revision}: DOM обновлён для экрана ${controls.screen}.`,
    tone: controls.showSidebar ? 'success' : 'warn',
    renderSteps: [
      '1. React вызывает компонент и читает текущее state / props.',
      '2. Компонент возвращает новое описание интерфейса через JSX.',
      '3. React сравнивает новое описание с предыдущим и подготавливает изменения.',
      '4. На commit изменения попадают в DOM, а post-commit эффекты могут увидеть уже обновлённый интерфейс.',
    ],
    snippet: [
      'const report = buildRenderCommitReport({ screen, density, showSidebar, revision });',
      '',
      '// render остаётся чистым: здесь только вычисление следующего описания UI.',
      'const panel = <WorkspacePreview report={report} />;',
      '',
      'useEffect(() => {',
      '  setCommitHistory((current) => [report.commitLabel, ...current].slice(0, 6));',
      '}, [report.signature]);',
    ].join('\n'),
  };
}
