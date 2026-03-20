import clsx from 'clsx';
import { useCallback, useEffect, useId, useState, type ReactNode } from 'react';

import { buildTreeMoveReport, type TreeMoveStrategy } from '../../lib/tree-move-model';
import { StatusPill } from '../ui';

export function TreeMoveLab() {
  const [strategy, setStrategy] = useState<TreeMoveStrategy>('css-order');
  const [dock, setDock] = useState<'left' | 'right'>('left');
  const [logs, setLogs] = useState<string[]>([]);
  const report = buildTreeMoveReport(strategy);

  const appendLog = useCallback((message: string) => {
    setLogs((current) =>
      [`${new Date().toLocaleTimeString('ru-RU')} · ${message}`, ...current].slice(0, 10),
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStrategy('css-order')}
          className={clsx('chip', strategy === 'css-order' && 'chip-active')}
        >
          CSS reorder
        </button>
        <button
          type="button"
          onClick={() => setStrategy('tree-move')}
          className={clsx('chip', strategy === 'tree-move' && 'chip-active')}
        >
          Tree move
        </button>
        <button
          type="button"
          onClick={() => setDock('left')}
          className={clsx('chip', dock === 'left' && 'chip-active')}
        >
          Dock left
        </button>
        <button
          type="button"
          onClick={() => setDock('right')}
          className={clsx('chip', dock === 'right' && 'chip-active')}
        >
          Dock right
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <StatusPill tone={report.tone}>{report.title}</StatusPill>
            <p className="mt-3 text-sm leading-6 text-slate-700">{report.summary}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{report.lifecycle}</p>
          </div>

          {strategy === 'css-order' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className={clsx(dock === 'left' ? 'lg:order-1' : 'lg:order-2')}>
                <DockedInspector onLog={appendLog} />
              </div>
              <StaticBoard
                className={clsx(dock === 'left' ? 'lg:order-2' : 'lg:order-1')}
              />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <DockSlot label="Left slot">
                {dock === 'left' ? <DockedInspector onLog={appendLog} /> : null}
              </DockSlot>
              <DockSlot label="Right slot">
                {dock === 'right' ? <DockedInspector onLog={appendLog} /> : null}
              </DockSlot>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Lifecycle journal
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {logs.length > 0 ? (
              logs.map((entry) => (
                <li key={entry} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  {entry}
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                Сначала переключите docking, чтобы увидеть cleanup и новый mount.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DockedInspector({ onLog }: { onLog: (message: string) => void }) {
  const instanceId = `dock-${useId()}`;
  const [draft, setDraft] = useState('Сравнить mount/unmount при смене docking.');
  const [marks, setMarks] = useState(0);

  useEffect(() => {
    onLog(`DockedInspector ${instanceId} смонтирован.`);

    return () => {
      onLog(`DockedInspector ${instanceId} снят с дерева.`);
    };
  }, [instanceId, onLog]);

  return (
    <section className="rounded-[28px] border border-blue-200 bg-blue-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Inspector widget
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-blue-950">
            Локальный draft должен пережить только reuse
          </h3>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            instance
          </p>
          <p className="mt-1 font-mono text-xs text-slate-800">{instanceId}</p>
        </div>
      </div>

      <label className="mt-5 block space-y-2 text-sm text-blue-950">
        <span className="font-medium">Локальный draft</span>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-slate-900 outline-none"
        />
      </label>

      <button
        type="button"
        onClick={() => setMarks((current) => current + 1)}
        className="mt-4 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
      >
        Marks: {marks}
      </button>
    </section>
  );
}

function StaticBoard({ className }: { className?: string }) {
  return (
    <section
      className={clsx('rounded-[28px] border border-slate-200 bg-white p-5', className)}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Static board
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
        Этот блок нужен только как соседний slot
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        В режиме `CSS reorder` виджет остаётся в том же React tree slot, хотя визуально
        переезжает слева направо.
      </p>
    </section>
  );
}

function DockSlot({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="mt-4 min-h-[280px]">
        {children ?? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
            Слот пуст.
          </div>
        )}
      </div>
    </section>
  );
}
