import { memo, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  describeMemoBoundary,
  type MemoBoundaryAction,
} from '../../lib/memo-boundary-model';
import { MetricCard, Panel, StatusPill } from '../ui';

type PreviewProps = {
  hue: number;
  derivedConfig?: {
    density: 'compact';
    badge: string;
  };
  outputLabel: string;
  modeLabel: string;
};

function BasePreviewCard({ hue, derivedConfig, outputLabel, modeLabel }: PreviewProps) {
  const commits = useRenderCount();
  const [localHighlights, setLocalHighlights] = useState(0);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Child preview
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{modeLabel}</p>
        </div>
        <output
          aria-label={outputLabel}
          className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800"
        >
          {commits} commits
        </output>
      </div>

      <div
        className="mt-5 rounded-[24px] border border-black/8 p-5"
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 92% 96%), white)`,
          boxShadow:
            localHighlights > 0
              ? `0 0 0 3px hsl(${hue} 95% 80% / 0.72)`
              : 'inset 0 1px 0 rgba(255,255,255,0.85)',
        }}
      >
        <p className="text-sm font-semibold text-slate-900">
          Derived badge: <strong>{derivedConfig?.badge ?? 'primitive props only'}</strong>
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Если в child прилетает новый object prop, memo сравнивает уже не значения, а
          новую ссылку.
        </p>

        <button
          type="button"
          onClick={() => setLocalHighlights((value) => value + 1)}
          className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Локально подсветить preview
        </button>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Локальных подсветок: <strong>{localHighlights}</strong>.
        </p>
      </div>
    </div>
  );
}

const MemoPreviewCard = memo(BasePreviewCard);

function PlainPreviewCard(props: PreviewProps) {
  return <BasePreviewCard {...props} />;
}

export function MemoBoundariesLab() {
  const shellCommits = useRenderCount();
  const [shellNote, setShellNote] = useState(
    'Меняйте только shell note и сравнивайте plain child с memo-boundary.',
  );
  const [hue, setHue] = useState(28);
  const [usesMemoBoundary, setUsesMemoBoundary] = useState(true);
  const [unstableObjectProp, setUnstableObjectProp] = useState(false);
  const [lastAction, setLastAction] = useState<MemoBoundaryAction>('shell-note');

  // Этот object prop существует только ради демонстрации referential equality:
  // визуально он может быть "тем же самым", но для memo ссылка всё равно новая.
  const derivedConfig = unstableObjectProp
    ? {
        density: 'compact' as const,
        badge: 'same values, new object reference',
      }
    : undefined;

  const diagnosis = describeMemoBoundary({
    usesMemoBoundary,
    unstableObjectProp,
    action: lastAction,
  });

  const ActivePreview = usesMemoBoundary ? MemoPreviewCard : PlainPreviewCard;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Parent render сам по себе не страшен. Важнее, пробивает ли он child boundary ниже по дереву."
          tone="accent"
        />
        <MetricCard
          label="Boundary mode"
          value={usesMemoBoundary ? 'memo' : 'plain child'}
          hint="`memo` полезен только если child реально тяжёлый или размножается в дереве."
          tone="cool"
        />
        <MetricCard
          label="Current diagnosis"
          value={diagnosis.avoidable ? 'avoidable' : 'expected'}
          hint={diagnosis.detail}
          tone={diagnosis.avoidable ? 'dark' : 'default'}
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              memo and prop equality
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              memo экономит render только тогда, когда props действительно остаются
              стабильными
            </h2>
          </div>
          <StatusPill tone={diagnosis.avoidable ? 'warn' : 'success'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Unrelated shell state
              </span>
              <textarea
                aria-label="Unrelated shell state"
                value={shellNote}
                onChange={(event) => {
                  setShellNote(event.target.value);
                  setLastAction('shell-note');
                }}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-amber-400"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setHue((value) => (value + 38) % 360);
                setLastAction('accent-change');
              }}
              className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Изменить видимый accent prop
            </button>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                aria-label="Включить memo boundary"
                checked={usesMemoBoundary}
                onChange={(event) => {
                  setUsesMemoBoundary(event.target.checked);
                  setLastAction('selection-change');
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Включить memo boundary вокруг child preview
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                aria-label="Передавать derived object prop"
                checked={unstableObjectProp}
                onChange={(event) => {
                  setUnstableObjectProp(event.target.checked);
                  setLastAction('selection-change');
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Передавать derived object prop вместо стабильного primitive contract
              </span>
            </label>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <PlainPreviewCard
              hue={hue}
              derivedConfig={derivedConfig}
              outputLabel="Plain child commits"
              modeLabel="Baseline: child без memo ререндерится вместе с parent."
            />
            <ActivePreview
              hue={hue}
              derivedConfig={derivedConfig}
              outputLabel="Memo child commits"
              modeLabel={
                usesMemoBoundary
                  ? 'Эксперимент: child обёрнут в memo и ждёт стабильных props.'
                  : 'Эксперимент: memo boundary отключена вручную.'
              }
            />
          </div>
        </div>
      </Panel>

      <Panel className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Следующий ход
        </p>
        <p className="text-sm leading-6 text-slate-700">{diagnosis.nextMove}</p>
      </Panel>
    </div>
  );
}
