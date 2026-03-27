import { memo, useCallback, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  describeCallbackScenario,
  type CallbackAction,
} from '../../lib/use-callback-model';
import { MetricCard, Panel, StatusPill } from '../ui';

const callbackRows = [
  { id: 'render-scan', title: 'Render scan' },
  { id: 'memo-review', title: 'Memo review' },
  { id: 'callback-map', title: 'Callback map' },
  { id: 'list-audit', title: 'List audit' },
] as const;

const MemoActionRow = memo(function MemoActionRow({
  id,
  title,
  selected,
  onToggle,
}: {
  id: string;
  title: string;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const commits = useRenderCount();

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        selected
          ? 'border-cyan-300 bg-cyan-50 text-cyan-950'
          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{title}</span>
        <output aria-label={`Row commits: ${title}`} className="chip">
          {commits} commits
        </output>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Selected: <strong>{selected ? 'yes' : 'no'}</strong>
      </p>
    </button>
  );
});

function toggleId(current: readonly string[], nextId: string) {
  return current.includes(nextId)
    ? current.filter((item) => item !== nextId)
    : [...current, nextId];
}

export function UseCallbackLab() {
  const shellCommits = useRenderCount();
  const [shellNote, setShellNote] = useState(
    'Меняйте только shell note и смотрите, трогает ли parent render memo-rows списка.',
  );
  const [usesStableCallback, setUsesStableCallback] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastAction, setLastAction] = useState<CallbackAction>('shell-note');

  const stableToggle = useCallback((id: string) => {
    setSelectedIds((current) => toggleId(current, id));
    setLastAction('toggle-item');
  }, []);

  const unstableToggle = (id: string) => {
    setSelectedIds((current) => toggleId(current, id));
    setLastAction('toggle-item');
  };

  const onToggle = usesStableCallback ? stableToggle : unstableToggle;
  const diagnosis = describeCallbackScenario({
    usesStableCallback,
    action: lastAction,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Parent render не проблема сам по себе. Смотрите, передаёт ли он вниз новый handler reference."
          tone="accent"
        />
        <MetricCard
          label="Handler mode"
          value={usesStableCallback ? 'useCallback' : 'inline function'}
          hint="Стабильная ссылка важна только если child rows действительно сравнивают props через memo."
          tone="cool"
        />
        <MetricCard
          label="Affected rows"
          value={diagnosis.affectedRows}
          hint={diagnosis.detail}
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              useCallback and handler stability
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              useCallback нужен там, где ссылка обработчика влияет на memo-child ниже по
              дереву
            </h2>
          </div>
          <StatusPill tone={usesStableCallback ? 'success' : 'warn'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Parent shell note
              </span>
              <textarea
                aria-label="Parent shell note"
                value={shellNote}
                onChange={(event) => {
                  setShellNote(event.target.value);
                  setLastAction('shell-note');
                }}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                aria-label="Использовать стабильный callback"
                checked={usesStableCallback}
                onChange={(event) => {
                  setUsesStableCallback(event.target.checked);
                  setLastAction('toggle-mode');
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Использовать `useCallback` для общего `onToggle`
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {callbackRows.map((row) => (
                <MemoActionRow
                  key={row.id}
                  id={row.id}
                  title={row.title}
                  selected={selectedIds.includes(row.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
            <Panel className="border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">{diagnosis.nextMove}</p>
            </Panel>
          </div>
        </div>
      </Panel>
    </div>
  );
}
