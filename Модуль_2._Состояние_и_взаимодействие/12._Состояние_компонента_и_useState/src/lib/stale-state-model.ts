import type { QueueStrategy } from './queue-model';
import type { StatusTone } from './learning-model';

export type DelayedReport = {
  finalValue: number;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

export function simulateDelayedIncrements(
  startValue: number,
  jobs: number,
  strategy: QueueStrategy,
): DelayedReport {
  if (strategy === 'direct') {
    return {
      finalValue: startValue + 1,
      tone: 'error',
      // Все jobs используют одно и то же captured value, поэтому друг друга перетирают.
      summary:
        'Каждый отложенный callback замкнул один и тот же старый snapshot. В итоге несколько таймеров повторно записывают почти одно и то же значение.',
      snippet: [
        'const captured = count;',
        'setTimeout(() => {',
        '  setCount(captured + 1);',
        '}, 300);',
      ].join('\n'),
    };
  }

  return {
    finalValue: startValue + jobs,
    tone: 'success',
    // Здесь количество jobs действительно накапливается, потому что чтение значения
    // происходит в момент применения update, а не в момент создания callback.
    summary:
      'Functional update в callback не зависит от stale closure и всегда получает актуальное queued value на момент применения.',
    snippet: ['setTimeout(() => {', '  setCount((prev) => prev + 1);', '}, 300);'].join(
      '\n',
    ),
  };
}
