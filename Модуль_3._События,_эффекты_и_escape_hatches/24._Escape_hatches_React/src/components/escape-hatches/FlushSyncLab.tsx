import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { FlushMode } from '../../lib/escape-domain';
import { Panel, StatusPill } from '../ui';

type LogEntry = {
  id: number;
  label: string;
};

type MeasurementReport = {
  mode: FlushMode;
  beforeCount: number;
  immediateCount: number;
  immediateHeight: number;
  afterFrameCount: number | null;
  afterFrameHeight: number | null;
  note: string;
};

export function FlushSyncLab() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const entryIdRef = useRef(4);
  const frameTokenRef = useRef(0);
  const [entries, setEntries] = useState<LogEntry[]>([
    { id: 1, label: 'Overlay opened' },
    { id: 2, label: 'Focus moved to dialog' },
    { id: 3, label: 'Escape closed modal' },
    { id: 4, label: 'Layout restored' },
  ]);
  const [report, setReport] = useState<MeasurementReport | null>(null);

  function scheduleAfterFrame(token: number) {
    requestAnimationFrame(() => {
      if (token !== frameTokenRef.current) {
        return;
      }

      const node = listRef.current;
      setReport((current) =>
        current
          ? {
              ...current,
              afterFrameCount: node?.children.length ?? null,
              afterFrameHeight: node?.scrollHeight ?? null,
            }
          : current,
      );
    });
  }

  function appendEntry(mode: FlushMode) {
    const node = listRef.current;
    const beforeCount = node?.children.length ?? 0;
    const nextEntry = {
      id: ++entryIdRef.current,
      label: `Escape hatch step ${entryIdRef.current}`,
    };
    const token = ++frameTokenRef.current;

    if (mode === 'flush') {
      // flushSync оставляем только для узкого случая:
      // сначала срочно коммитим новый DOM-элемент, потом immediately читаем scrollHeight.
      flushSync(() => {
        setEntries((current) => [...current, nextEntry]);
      });
    } else {
      setEntries((current) => [...current, nextEntry]);
    }

    const immediateCount = listRef.current?.children.length ?? 0;
    const immediateHeight = listRef.current?.scrollHeight ?? 0;

    if (mode === 'flush') {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }

    setReport({
      mode,
      beforeCount,
      immediateCount,
      immediateHeight,
      afterFrameCount: null,
      afterFrameHeight: null,
      note:
        mode === 'flush'
          ? 'DOM уже успел закоммититься, поэтому immediate measurement увидел новый элемент.'
          : 'Обычный setState ещё не закоммитил DOM в том же обработчике, поэтому immediate measurement видит старый snapshot.',
    });

    scheduleAfterFrame(token);
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">flushSync is a rare escape hatch</StatusPill>
        <span className="text-sm text-slate-500">
          Entries: <strong>{entries.length}</strong>
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => appendEntry('normal')}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Add normally + read DOM
        </button>
        <button
          type="button"
          onClick={() => appendEntry('flush')}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          flushSync + read DOM
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div
            ref={listRef}
            className="max-h-[20rem] overflow-y-auto rounded-[24px] border border-slate-200 bg-slate-50 p-4"
          >
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  {entry.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
            {report?.note ??
              'Нажмите любую кнопку и сравните immediate DOM read с тем, что появится после следующего кадра.'}
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Measurement
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                mode: {report?.mode ?? 'not run'}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                beforeCount: {report?.beforeCount ?? '—'}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                immediateCount: {report?.immediateCount ?? '—'}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                afterFrameCount: {report?.afterFrameCount ?? '—'}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                immediateHeight: {report?.immediateHeight ?? '—'}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                afterFrameHeight: {report?.afterFrameHeight ?? '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
