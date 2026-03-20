import type { StatusTone } from './learning-model';

export type DefaultActionReport = {
  tone: StatusTone;
  summary: string;
  consequences: readonly string[];
  snippet: string;
};

export function buildDefaultActionReport(options: {
  preventLink: boolean;
  preventCheckbox: boolean;
}): DefaultActionReport {
  const consequences = [
    options.preventLink
      ? 'Переход по ссылке остановлен: hash URL не меняется.'
      : 'Переход по ссылке разрешён: браузер выполняет своё действие по умолчанию.',
    options.preventCheckbox
      ? 'Переключение checkbox остановлено: браузер не меняет checked автоматически.'
      : 'Checkbox меняет checked своим нативным поведением.',
  ] as const;

  return {
    tone: options.preventLink || options.preventCheckbox ? 'warn' : 'success',
    summary:
      '`event.preventDefault()` не останавливает всплытие, а отменяет именно действие браузера по умолчанию для конкретного элемента.',
    consequences,
    snippet: [
      'function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {',
      '  event.preventDefault();',
      '}',
    ].join('\n'),
  };
}
