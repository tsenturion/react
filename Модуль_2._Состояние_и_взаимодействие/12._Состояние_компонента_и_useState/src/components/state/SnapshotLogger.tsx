import { useState } from 'react';

import { buildSnapshotNarrative } from '../../lib/snapshot-model';

export function SnapshotLogger() {
  const [count, setCount] = useState(0);
  const [journal, setJournal] = useState<string[]>([]);

  const pushSnapshot = (delta: number) => {
    const story = buildSnapshotNarrative(count, delta);

    // Здесь важно, что все строки журнала тоже строятся из snapshot текущего рендера.
    // После `setCount(...)` этот обработчик всё ещё видит старое значение `count`.
    setJournal((current) => [
      story.currentRenderLabel,
      story.scheduledLabel,
      story.sameHandlerLabel,
      story.nextRenderLabel,
      ...current,
    ]);
    setCount(count + delta);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          state as a snapshot
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">count = {count}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Нажмите кнопку и посмотрите, как обработчик пишет в журнал старое значение,
              хотя следующий рендер уже получит новое.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => pushSnapshot(1)} className="chip">
              +1 через snapshot
            </button>
            <button type="button" onClick={() => pushSnapshot(5)} className="chip">
              +5 через snapshot
            </button>
            <button type="button" onClick={() => setJournal([])} className="chip">
              Очистить журнал
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {journal.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            Журнал пуст. После клика здесь появится история того, что видел текущий рендер
            в момент вызова `setCount(...)`.
          </div>
        ) : (
          journal.map((entry, index) => (
            <div
              key={`${entry}-${index}`}
              className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm"
            >
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
