import clsx from 'clsx';

import type {
  ConditionalStyleControls,
  StateTone,
} from '../../lib/conditional-style-model';

const toneClasses: Record<StateTone, string> = {
  neutral: 'border-slate-300 bg-white text-slate-800',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  danger: 'border-rose-300 bg-rose-50 text-rose-900',
};

const densityClasses = {
  comfortable: 'px-5 py-4 text-base',
  compact: 'px-4 py-3 text-sm',
} as const;

export function StateDemoButton({ controls }: { controls: ConditionalStyleControls }) {
  return (
    <button
      type="button"
      disabled={controls.disabled}
      className={clsx(
        'inline-flex w-full items-center justify-between rounded-[24px] border font-semibold transition',
        toneClasses[controls.tone],
        densityClasses[controls.compact ? 'compact' : 'comfortable'],
        controls.selected && 'ring-2 ring-slate-900/15',
        controls.busy && 'animate-pulse',
        controls.disabled && 'cursor-not-allowed opacity-45',
      )}
    >
      <span>Сохранить стиль-композицию</span>
      <span className="rounded-full bg-black/8 px-3 py-1 text-xs uppercase tracking-[0.18em]">
        {controls.busy ? 'busy' : controls.selected ? 'selected' : controls.tone}
      </span>
    </button>
  );
}
