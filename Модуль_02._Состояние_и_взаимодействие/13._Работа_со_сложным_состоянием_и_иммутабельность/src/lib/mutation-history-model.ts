import type { HistorySnapshot } from './complex-state-domain';

export type HistoryIntegrity = {
  historyLength: number;
  uniqueReferences: number;
  distinctTitles: number;
};

export type HistoryComparisonReport = {
  bad: HistoryIntegrity;
  good: HistoryIntegrity;
  summary: string;
  badSnippet: string;
  goodSnippet: string;
};

function buildNextSnapshot(snapshot: HistorySnapshot): HistorySnapshot {
  const nextRevision = snapshot.revision + 1;

  return {
    id: `snapshot-${nextRevision}`,
    title: `Черновик r${nextRevision}`,
    revision: nextRevision,
    reviewers: snapshot.reviewers + 1,
  };
}

export function appendHistoryWithMutation(history: HistorySnapshot[]): HistorySnapshot[] {
  const last = history[history.length - 1];

  if (!last) {
    return history;
  }

  const next = buildNextSnapshot(last);

  // Эта запись ломает историю: старый объект мутируется,
  // а затем та же ссылка повторно попадает в массив.
  last.title = next.title;
  last.revision = next.revision;
  last.reviewers = next.reviewers;

  return [...history, last];
}

export function appendHistoryImmutably(history: HistorySnapshot[]): HistorySnapshot[] {
  const last = history[history.length - 1];

  if (!last) {
    return history;
  }

  return [...history, buildNextSnapshot(last)];
}

export function analyzeHistory(history: HistorySnapshot[]): HistoryIntegrity {
  return {
    historyLength: history.length,
    uniqueReferences: new Set(history).size,
    distinctTitles: new Set(history.map((item) => item.title)).size,
  };
}

export function buildHistoryComparisonReport(
  badHistory: HistorySnapshot[],
  goodHistory: HistorySnapshot[],
): HistoryComparisonReport {
  return {
    bad: analyzeHistory(badHistory),
    good: analyzeHistory(goodHistory),
    summary:
      'Если в историю кладётся та же самая мутированная ссылка, прошлые версии перестают быть прошлым. Все записи начинают смотреть на один и тот же объект, и интерфейс теряет синхронность с ожиданиями.',
    badSnippet: [
      'setHistory((current) => {',
      '  const last = current[current.length - 1];',
      "  last.title = 'Черновик r2';",
      '  return [...current, last];',
      '});',
    ].join('\n'),
    goodSnippet: [
      'setHistory((current) => {',
      '  const last = current[current.length - 1];',
      "  const next = { ...last, title: 'Черновик r2' };",
      '  return [...current, next];',
      '});',
    ].join('\n'),
  };
}
