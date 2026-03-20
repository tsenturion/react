import type { BubbleStop } from './event-domain';
import type { StatusTone } from './learning-model';

export type BubblingReport = {
  tone: StatusTone;
  summary: string;
  propagation: readonly string[];
  snippet: string;
};

export function buildBubblingReport(stop: BubbleStop): BubblingReport {
  const propagation =
    stop === 'button'
      ? ['button', 'stopPropagation()']
      : stop === 'card'
        ? ['button', 'card', 'stopPropagation()']
        : ['button', 'card', 'board'];

  return {
    tone: stop === 'none' ? 'success' : 'warn',
    summary:
      stop === 'none'
        ? 'Событие идёт от target вверх по дереву и последовательно запускает обработчики родителей.'
        : 'Всплытие останавливается в той точке, где вызван `event.stopPropagation()`, поэтому родители выше уже не получат событие.',
    propagation,
    snippet:
      stop === 'button'
        ? [
            'function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {',
            '  event.stopPropagation();',
            '}',
          ].join('\n')
        : stop === 'card'
          ? [
              'function handleCardClick(event: React.MouseEvent<HTMLDivElement>) {',
              '  event.stopPropagation();',
              '}',
            ].join('\n')
          : [
              '<div onClick={handleBoardClick}>',
              '  <div onClick={handleCardClick}>',
              '    <button onClick={handleButtonClick}>Run</button>',
              '  </div>',
              '</div>',
            ].join('\n'),
  };
}
