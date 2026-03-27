import { useState } from 'react';

export function DelayedIncrementSandbox() {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [journal, setJournal] = useState<string[]>([]);

  const scheduleBad = () => {
    // Таймер замыкает текущее значение `count`.
    // Если таких таймеров несколько, они позже пытаются записать почти одно и то же число.
    const captured = count;
    setPending((current) => current + 1);
    setJournal((current) => [
      `Запланирован stale callback из snapshot count = ${captured}.`,
      ...current,
    ]);

    window.setTimeout(() => {
      setCount(captured + 1);
      setPending((current) => current - 1);
      setJournal((current) => [
        `stale callback записал count = ${captured + 1} на основе старого snapshot.`,
        ...current,
      ]);
    }, 400);
  };

  const scheduleGood = () => {
    setPending((current) => current + 1);
    setJournal((current) => [
      'Запланирован functional callback, который прочитает актуальное значение позже.',
      ...current,
    ]);

    window.setTimeout(() => {
      // Functional update читает значение в момент применения, а не в момент планирования.
      setCount((current) => current + 1);
      setPending((current) => current - 1);
      setJournal((current) => [
        'functional callback увеличил count на основе актуального queued state.',
        ...current,
      ]);
    }, 400);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              stale state
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-900">{count}</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
            pending: {pending}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={scheduleBad} className="chip">
            Запланировать stale +1
          </button>
          <button type="button" onClick={scheduleGood} className="chip">
            Запланировать functional +1
          </button>
          <button
            type="button"
            onClick={() => {
              setCount(0);
              setPending(0);
              setJournal([]);
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {journal.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            Журнал покажет, чем stale callback отличается от functional update в
            отложенном коде.
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
