import { memo, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  describeRenderReaction,
  type RenderAction,
} from '../../lib/render-performance-model';
import { MetricCard, StatusPill } from '../ui';

type PreviewCardProps = {
  hue: number;
  modeLabel: string;
  unstableConfig?: {
    density: 'compact';
    title: string;
  };
};

const PreviewCard = memo(function PreviewCard({
  hue,
  modeLabel,
  unstableConfig,
}: PreviewCardProps) {
  const commits = useRenderCount();
  const [localHighlights, setLocalHighlights] = useState(0);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Memo preview
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Этот блок обёрнут в `memo`, поэтому новые meaningful props и новый object prop
            дают принципиально разный результат.
          </p>
        </div>
        <output
          aria-label="Preview commits"
          className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
        >
          {commits} commits
        </output>
      </div>

      <div
        className="mt-5 rounded-[24px] border border-black/8 p-5"
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 90% 96%), white)`,
          boxShadow:
            localHighlights > 0
              ? `0 0 0 3px hsl(${hue} 95% 78% / 0.75)`
              : 'inset 0 1px 0 rgba(255,255,255,0.85)',
        }}
      >
        <p className="text-sm font-semibold text-slate-900">{modeLabel}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Режим props:{' '}
          <strong>
            {unstableConfig
              ? 'новый object prop на каждый parent render'
              : 'только primitive props'}
          </strong>
          .
        </p>
        <button
          type="button"
          onClick={() => setLocalHighlights((value) => value + 1)}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Локально подсветить preview
        </button>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Локальных подсветок: <strong>{localHighlights}</strong>. Это состояние живёт
          внутри memo-child и не должно тянуть за собой shell.
        </p>
      </div>
    </div>
  );
});

export function RenderCausesLab() {
  const shellCommits = useRenderCount();
  const [shellNote, setShellNote] = useState(
    'Меняйте эту заметку и смотрите, кто реально ререндерится.',
  );
  const [hue, setHue] = useState(205);
  const [unstableObjectProp, setUnstableObjectProp] = useState(false);
  const [lastAction, setLastAction] = useState<RenderAction>('parent-note');

  const diagnosis = describeRenderReaction({
    action: lastAction,
    unstableObjectProp,
  });

  const previewConfig = unstableObjectProp
    ? {
        density: 'compact' as const,
        title: 'Same values, new object reference',
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Действия
          </p>
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Небольшое изменение shell state
            </span>
            <textarea
              aria-label="Небольшое изменение shell state"
              value={shellNote}
              onChange={(event) => {
                setShellNote(event.target.value);
                setLastAction('parent-note');
              }}
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-400"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setHue((value) => (value + 35) % 360);
              setLastAction('accent-change');
            }}
            className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Изменить видимый accent prop
          </button>

          <label className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <input
              aria-label="Передавать новый объект props на каждый рендер"
              type="checkbox"
              checked={unstableObjectProp}
              onChange={(event) => {
                setUnstableObjectProp(event.target.checked);
                setLastAction('mode-change');
              }}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm leading-6 text-slate-700">
              Передавать новый объект props на каждый рендер
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Shell commits"
              value={`${shellCommits}`}
              hint="Каждое изменение заметки ререндерит shell. Это нормально."
              tone="accent"
            />
            <MetricCard
              label="Режим props"
              value={unstableObjectProp ? 'new object' : 'primitive only'}
              hint="Именно он решает, пробьёт ли parent render memo-границу."
              tone="cool"
            />
            <MetricCard
              label="Последняя реакция"
              value={diagnosis.avoidable ? 'avoidable' : 'expected'}
              hint={diagnosis.detail}
              tone={diagnosis.avoidable ? 'dark' : 'default'}
            />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Диагноз
                </p>
                <p className="mt-2 text-lg font-semibold">{diagnosis.headline}</p>
              </div>
              <StatusPill tone={diagnosis.avoidable ? 'warn' : 'success'}>
                {diagnosis.avoidable ? 'avoidable rerender' : 'expected rerender'}
              </StatusPill>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {diagnosis.detail}
            </p>
          </div>

          <PreviewCard
            hue={hue}
            modeLabel={previewConfig?.title ?? 'Same primitives, stable meaning'}
            unstableConfig={previewConfig}
          />
        </div>
      </div>
    </div>
  );
}
