import type { StatusTone } from './learning-model';
import type { HandlerPattern } from './event-domain';

export type HandlerPatternReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  snippet: string;
};

export function buildHandlerPatternReport(pattern: HandlerPattern): HandlerPatternReport {
  if (pattern === 'direct') {
    return {
      tone: 'success',
      title: 'Прямая ссылка на обработчик',
      summary:
        'Подходит, когда обработчику не нужны дополнительные аргументы. React сам передаст SyntheticEvent как первый параметр.',
      snippet: ['<button onClick={handleToolbarClick}>Сохранить</button>'].join('\n'),
    };
  }

  if (pattern === 'inline') {
    return {
      tone: 'success',
      title: 'Inline wrapper с параметром',
      summary:
        'Удобен, когда нужно передать id, action name или дополнительный флаг вместе с SyntheticEvent.',
      snippet: [
        '<button',
        '  onClick={(event) => handleAction("archive", event)}',
        '>',
        '  Archive',
        '</button>',
      ].join('\n'),
    };
  }

  return {
    tone: 'success',
    title: 'Curried factory handler',
    summary:
      'Полезен, когда нужно заранее создать обработчик для конкретной сущности и переиспользовать его в нескольких местах.',
    snippet: [
      'function createSelectHandler(id: string) {',
      '  return (event: React.MouseEvent<HTMLButtonElement>) => {',
      '    handleSelect(id, event);',
      '  };',
      '}',
    ].join('\n'),
  };
}
