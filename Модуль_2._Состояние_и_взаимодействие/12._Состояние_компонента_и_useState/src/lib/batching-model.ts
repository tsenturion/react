import type { StatusTone } from './learning-model';

export type BatchingReport = {
  touchedSlices: number;
  tone: StatusTone;
  summary: string;
  visibleAfterEvent: string[];
  snippet: string;
};

export function buildBatchingReport(): BatchingReport {
  return {
    touchedSlices: 3,
    tone: 'success',
    summary:
      'Если один обработчик вызывает несколько `setState`, React объединяет их и показывает уже итоговый UI нового рендера, а не промежуточные полушаги между обновлениями.',
    visibleAfterEvent: ['version', 'status', 'flash'],
    snippet: [
      'function publish() {',
      '  setVersion((current) => current + 1);',
      "  setStatus('published');",
      "  setFlash('Обновление отправлено');",
      '}',
    ].join('\n'),
  };
}
