import { formatPixels } from './ref-domain';
import type { StatusTone } from './learning-model';

export type MeasureCase = 'guess' | 'measure' | 'observer';

type MeasureReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<MeasureCase, MeasureReport> = {
  guess: {
    title: 'Guessing size from props',
    tone: 'warn',
    summary:
      'React знает входные данные, но не знает реальный итог layout-а браузера. Размер лучше читать из DOM после mount.',
    snippet: [
      'const guessedHeight = lines * lineHeight;',
      '// Но реальный размер зависит от border, font metrics и wrapping.',
    ].join('\n'),
  },
  measure: {
    title: 'Measure via getBoundingClientRect',
    tone: 'success',
    summary:
      'Ref даёт прямой доступ к элементу и позволяет получить фактические размеры, а не только предполагаемые значения.',
    snippet: [
      'const rect = element.getBoundingClientRect();',
      'setMetrics({',
      '  rectWidth: rect.width,',
      '  rectHeight: rect.height,',
      '});',
    ].join('\n'),
  },
  observer: {
    title: 'ResizeObserver',
    tone: 'success',
    summary:
      'Observer нужен, когда важно реагировать на последующие изменения размера без ручного клика на кнопку измерения.',
    snippet: [
      'const observer = new ResizeObserver(() => {',
      '  setMetrics(readBoxMetrics(node));',
      '});',
      'observer.observe(node);',
    ].join('\n'),
  },
};

export function buildMeasureReport(id: MeasureCase) {
  return reports[id];
}

export function summarizeArea(width: number, height: number) {
  return `${formatPixels(width)} × ${formatPixels(height)}`;
}
