import { useEffect, useId } from 'react';

const committedRenderCounts: Record<string, number> = {};

// Это учебный telemetry-hook: он не мутирует refs во время render и не запускает
// дополнительный ререндер ради самого счётчика. Текущий render показывает "следующий"
// commit number, а после commit это значение синхронизируется в модульное хранилище.
export function useRenderCount() {
  const trackerId = useId();
  const nextCommit = (committedRenderCounts[trackerId] ?? 0) + 1;

  useEffect(() => {
    committedRenderCounts[trackerId] = nextCommit;
  }, [nextCommit, trackerId]);

  return nextCommit;
}

export function resetRenderCountStore() {
  for (const key of Object.keys(committedRenderCounts)) {
    delete committedRenderCounts[key];
  }
}
