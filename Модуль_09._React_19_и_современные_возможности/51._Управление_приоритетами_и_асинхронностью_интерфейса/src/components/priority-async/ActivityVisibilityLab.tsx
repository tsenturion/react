import { Activity, useState } from 'react';

import {
  compareVisibilityStrategies,
  describeActivityMode,
  draftChecklist,
  type ActivityMode,
} from '../../lib/activity-visibility-model';
import { useRenderCount } from '../../hooks/useRenderCount';
import { MetricCard, Panel, StatusPill } from '../ui';

function DraftSurface({ label, storageHint }: { label: string; storageHint: string }) {
  const renderCount = useRenderCount();
  const [note, setNote] = useState(
    'Здесь остаётся локальный draft, если ветка действительно сохраняет своё состояние.',
  );
  const [checked, setChecked] = useState<string[]>([]);

  return (
    <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{storageHint}</p>
        </div>
        <StatusPill tone="success">commit {renderCount}</StatusPill>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">{label} note</span>
        <textarea
          aria-label={label}
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
          }}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
        />
      </label>

      <div className="space-y-2">
        {draftChecklist.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <input
              type="checkbox"
              checked={checked.includes(item.id)}
              onChange={(event) => {
                setChecked((current) =>
                  event.target.checked
                    ? [...current, item.id]
                    : current.filter((value) => value !== item.id),
                );
              }}
            />
            <span className="text-sm leading-6 text-slate-700">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ActivityVisibilityLab() {
  const [mode, setMode] = useState<ActivityMode>('visible');
  const descriptions = compareVisibilityStrategies(mode);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Activity mode"
          value={mode}
          hint={describeActivityMode(mode)}
          tone="accent"
        />
        <MetricCard
          label="Hidden strategy"
          value="state kept"
          hint="Activity нужен там, где скрытый экран должен вернуться к прежнему локальному прогрессу."
          tone="cool"
        />
        <MetricCard
          label="Conditional branch"
          value="state reset"
          hint="Обычная условная ветка проще, но при скрытии выбрасывает своё локальное состояние."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('visible');
            }}
            className={mode === 'visible' ? 'chip chip-active' : 'chip'}
          >
            Show subtree
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('hidden');
            }}
            className={mode === 'hidden' ? 'chip chip-active' : 'chip'}
          >
            Hide subtree
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Activity boundary</p>
                <StatusPill tone="success">advanced boundary</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {descriptions.activity}
              </p>
            </div>
            <Activity mode={mode} name="lesson-51-activity-draft">
              <DraftSurface
                label="Activity draft"
                storageHint="Спрячьте и верните поддерево: заметка и чекбоксы должны сохраниться."
              />
            </Activity>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Conditional render</p>
                <StatusPill tone="error">simple unmount</StatusPill>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {descriptions.conditional}
              </p>
            </div>
            {mode === 'visible' ? (
              <DraftSurface
                label="Conditional draft"
                storageHint="При скрытии эта ветка размонтируется и при возврате начнёт работу заново."
              />
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                Conditional subtree сейчас размонтирована. При возврате она будет создана
                заново.
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
