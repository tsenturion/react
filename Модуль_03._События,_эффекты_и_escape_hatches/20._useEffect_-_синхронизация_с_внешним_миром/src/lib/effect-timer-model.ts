import type { TimerMode } from './effect-domain';
import type { StatusTone } from './learning-model';

export type TimerReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  snippet: string;
};

export function buildTimerReport(mode: TimerMode): TimerReport {
  if (mode === 'cleanup') {
    return {
      tone: 'success',
      title: 'Таймер снимается при смене зависимостей',
      summary:
        'На каждый новый delay остаётся только один активный interval, потому что предыдущий очищается в cleanup.',
      snippet: [
        'useEffect(() => {',
        '  const id = window.setInterval(tick, delay);',
        '  return () => window.clearInterval(id);',
        '}, [delay, running]);',
      ].join('\n'),
    };
  }

  return {
    tone: 'error',
    title: 'Без cleanup интервалы накапливаются',
    summary:
      'Если cleanup пропустить, после каждой смены delay или повторного mount продолжат жить старые интервалы, а UI начнёт получать дублирующиеся тики.',
    snippet: [
      'useEffect(() => {',
      '  const id = window.setInterval(tick, delay);',
      '}, [delay, running]);',
    ].join('\n'),
  };
}
