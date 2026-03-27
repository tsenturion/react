import type { StatusTone } from './learning-model';

export type UiTreeState = {
  screen: 'catalog' | 'lesson';
  showFilters: boolean;
  showSidebar: boolean;
  compact: boolean;
};

export type ReconciliationReport = {
  beforeNodeCount: number;
  afterNodeCount: number;
  changedBranches: string[];
  stableBranches: string[];
  summary: string;
  tone: StatusTone;
  snippet: string;
};

function countNodes(state: UiTreeState) {
  return (
    5 +
    (state.screen === 'catalog' ? 3 : 2) +
    (state.showFilters ? 2 : 0) +
    (state.showSidebar ? 2 : 0) +
    (state.compact ? 0 : 1)
  );
}

export function buildReconciliationReport(
  before: UiTreeState,
  after: UiTreeState,
): ReconciliationReport {
  const changedBranches = [
    before.screen !== after.screen ? 'main-screen' : null,
    before.showFilters !== after.showFilters ? 'filters' : null,
    before.showSidebar !== after.showSidebar ? 'sidebar' : null,
    before.compact !== after.compact ? 'density' : null,
  ].filter((item): item is string => item !== null);

  const stableBranches = ['header', 'toolbar', 'footer'].filter(
    (branch) => !changedBranches.includes(branch),
  );

  return {
    beforeNodeCount: countNodes(before),
    afterNodeCount: countNodes(after),
    changedBranches,
    stableBranches,
    summary:
      changedBranches.length === 0
        ? 'React получил те же входные данные и может согласовать тот же UI без содержательных изменений.'
        : `React сравнивает старое и новое описание интерфейса и обновляет только те ветки, где изменился render output: ${changedBranches.join(', ')}.`,
    tone: changedBranches.length === 0 ? 'success' : 'warn',
    snippet: [
      'const beforeTree = <Workspace state={before} />;',
      'const afterTree = <Workspace state={after} />;',
      '',
      '// reconciliation сравнивает именно эти описания UI, а не вручную собранный DOM-код.',
      'compare(beforeTree, afterTree);',
    ].join('\n'),
  };
}
