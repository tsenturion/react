import type { StatusTone } from './learning-model';

export type StateTone = 'neutral' | 'success' | 'danger';

export type ConditionalStyleControls = {
  tone: StateTone;
  selected: boolean;
  disabled: boolean;
  busy: boolean;
  compact: boolean;
};

export type ConditionalStyleReport = {
  activeStateCount: number;
  tone: StatusTone;
  summary: string;
  warning: string;
  snippet: string;
};

export const defaultConditionalStyleControls: ConditionalStyleControls = {
  tone: 'neutral',
  selected: false,
  disabled: false,
  busy: false,
  compact: false,
};

export function buildConditionalStyleReport(
  controls: ConditionalStyleControls,
): ConditionalStyleReport {
  const activeStateCount = [
    controls.selected,
    controls.disabled,
    controls.busy,
    controls.compact,
  ].filter(Boolean).length;

  return {
    activeStateCount,
    tone:
      controls.disabled && controls.busy
        ? 'error'
        : controls.selected || controls.busy
          ? 'success'
          : 'warn',
    summary:
      'Состояние должно менять внешний вид через явные variant maps и короткие булевы модификаторы, а не через длинные строки с вложенными тернарными операторами прямо в JSX.',
    warning:
      controls.disabled && controls.busy
        ? 'Если элемент disabled, не стоит одновременно оставлять ему вид busy-состояния: пользователю трудно понять, можно ли ждать завершения действия.'
        : 'Когда состояние описано явно, компонент остаётся читаемым даже при нескольких визуальных флагах.',
    snippet: [
      'className={clsx(',
      "  'inline-flex items-center rounded-2xl border transition',",
      '  toneClasses[tone],',
      '  selected && "ring-2 ring-slate-900/15",',
      '  busy && "animate-pulse",',
      '  disabled && "cursor-not-allowed opacity-45",',
      ')}',
    ].join('\n'),
  };
}
