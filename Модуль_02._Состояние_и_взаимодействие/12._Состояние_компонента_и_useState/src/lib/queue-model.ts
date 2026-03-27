export type QueueStrategy = 'direct' | 'functional';

export type QueueResult = {
  finalValue: number;
  operations: string[];
  summary: string;
  snippet: string;
};

export function simulateQueuedIncrements(
  startValue: number,
  times: number,
  strategy: QueueStrategy,
): QueueResult {
  if (strategy === 'direct') {
    return {
      finalValue: startValue + 1,
      // Модель специально показывает "replace with ...", потому что direct update
      // не накапливает вычисления, а многократно подставляет один и тот же результат.
      operations: Array.from({ length: times }, () => `replace with ${startValue + 1}`),
      summary:
        'Повторный `setCount(count + 1)` берёт одно и то же snapshot-значение текущего рендера, поэтому финальный результат меняется только на один шаг.',
      snippet: [
        'setCount(count + 1);',
        'setCount(count + 1);',
        'setCount(count + 1);',
      ].join('\n'),
    };
  }

  return {
    finalValue: startValue + times,
    // Functional update превращает очередь в цепочку вычислений, где следующий шаг
    // опирается на результат предыдущего шага, а не на старую переменную из render scope.
    operations: Array.from(
      { length: times },
      (_, index) => `prev => prev + 1 (${index + 1})`,
    ),
    summary:
      'Functional update читает актуальное значение из очереди обновлений, поэтому каждое следующее вычисление опирается на предыдущий queued result.',
    snippet: [
      'setCount((prev) => prev + 1);',
      'setCount((prev) => prev + 1);',
      'setCount((prev) => prev + 1);',
    ].join('\n'),
  };
}
