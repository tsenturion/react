export type ProfilerCommit = {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interaction: string;
};

export function summarizeProfilerCommits(commits: readonly ProfilerCommit[]) {
  if (commits.length === 0) {
    return {
      commitCount: 0,
      averageActualDuration: 0,
      slowestCommit: null,
      hotspot: 'Пока нет записей профайлера.',
    } as const;
  }

  const averageActualDuration =
    commits.reduce((sum, item) => sum + item.actualDuration, 0) / commits.length;
  const slowestCommit = commits.reduce((max, item) =>
    item.actualDuration > max.actualDuration ? item : max,
  );
  const hotspot =
    slowestCommit.baseDuration - slowestCommit.actualDuration > 4
      ? 'Base duration заметно выше actual duration: memoization уже помогает, но subtree всё ещё дорогой.'
      : 'Actual duration близок к base duration: оптимизировать нужно не сравнение props, а сам объём работы.';

  return {
    commitCount: commits.length,
    averageActualDuration,
    slowestCommit,
    hotspot,
  } as const;
}

export function formatDurationMs(value: number) {
  return `${value.toFixed(1)} ms`;
}
