import type { StatusTone } from './learning-model';

export type IdempotencyReport = {
  tone: StatusTone;
  summary: string;
  stableOutput: string;
  impureOutput: string;
  snippet: string;
};

export function buildIdempotencyReport(topic: string): IdempotencyReport {
  const stableOutput = `${topic.toUpperCase()} · ${topic.length} символов`;

  return {
    tone: 'warn',
    summary:
      'Idempotency означает: при тех же props и state компонент должен вернуть тот же результат. Случайность и текущее время внутри render ломают это правило.',
    stableOutput,
    impureOutput: `${topic.toUpperCase()} · random()`,
    snippet: [
      '// плохо: тот же input, но каждый render возвращает другое значение',
      'return <span>{Math.random().toFixed(4)}</span>;',
      '',
      '// хорошо: результат зависит только от входных данных',
      'return <span>{topic.toUpperCase()} · {topic.length}</span>;',
    ].join('\n'),
  };
}
