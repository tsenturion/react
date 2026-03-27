import type { StatusTone } from './learning-model';

export type PurityReport = {
  tone: StatusTone;
  summary: string;
  risk: string;
  snippet: string;
};

export function buildPurityReport(
  registryLength: number,
  rerenderPulse: number,
): PurityReport {
  return {
    tone: registryLength > rerenderPulse + 1 ? 'error' : 'warn',
    summary:
      registryLength > 1
        ? 'Impure-компонент записывает данные во внешний mutable registry прямо во время render.'
        : 'Pure-компонент вычисляет output только из входных данных и не трогает внешнее состояние.',
    risk:
      registryLength > 1
        ? 'Каждый лишний render добавляет новые записи и превращает повторный вызов компонента в скрытый side effect.'
        : 'При чистом render повторный вызов не меняет ничего за пределами JSX-результата.',
    snippet: [
      '// плохо: мутация внешней структуры прямо в render',
      'impureRegistry.push(topic);',
      '',
      '// хорошо: собрать derived data локально из props',
      'const tags = showBadge ? ["pure", topic] : [topic];',
    ].join('\n'),
  };
}
