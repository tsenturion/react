import clsx from 'clsx';
import { useId, useMemo, useState } from 'react';

import {
  analyzeListIdentity,
  type KeyStrategy,
  type ListOperation,
} from '../../lib/list-identity-model';
import { createLessonRows, type LessonRow } from '../../lib/state-identity-domain';
import { StatusPill } from '../ui';

const initialRows = createLessonRows();

export function ListIdentityLab() {
  const [strategy, setStrategy] = useState<KeyStrategy>('stable-id');
  const [rows, setRows] = useState(initialRows);
  const [version, setVersion] = useState(0);
  const [operation, setOperation] = useState<ListOperation>('stable');
  const report = useMemo(
    () => analyzeListIdentity(strategy, operation),
    [operation, strategy],
  );

  const keyOf = (row: LessonRow, index: number) =>
    strategy === 'stable-id'
      ? row.id
      : strategy === 'index'
        ? String(index)
        : `${row.id}-${version}`;

  const touchVersion = () => setVersion((current) => current + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[
          ['stable-id', 'key = item.id'],
          ['index', 'key = index'],
          ['version', 'key = item.id + version'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStrategy(value as KeyStrategy)}
            className={clsx('chip', strategy === value && 'chip-active')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setRows((current) => [...current].reverse());
                setOperation('reverse');
                touchVersion();
              }}
              className="chip"
            >
              Перевернуть порядок
            </button>
            <button
              type="button"
              onClick={() => {
                setRows((current) => [
                  {
                    id: `lesson-${current.length + 20}`,
                    title: 'Новый блок по identity',
                    track: 'state',
                    seedNote: 'Проверить reset через key.',
                  },
                  ...current,
                ]);
                setOperation('prepend');
                touchVersion();
              }}
              className="chip"
            >
              Добавить в начало
            </button>
            <button
              type="button"
              onClick={() => {
                setRows((current) => current.slice(1));
                setOperation('remove-first');
                touchVersion();
              }}
              className="chip"
            >
              Удалить первую строку
            </button>
            <button
              type="button"
              onClick={() => {
                setRows(initialRows);
                setOperation('stable');
                touchVersion();
              }}
              className="chip"
            >
              Сбросить
            </button>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <StatusPill
                  tone={
                    report.identityDriftCount > 0
                      ? 'error'
                      : report.mountedCount > 0
                        ? 'warn'
                        : 'success'
                  }
                >
                  {strategy === 'stable-id'
                    ? 'Stable identity'
                    : strategy === 'index'
                      ? 'Position drift'
                      : 'Forced remount'}
                </StatusPill>
                <p className="mt-3 text-sm leading-6 text-slate-700">{report.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat label="reuse" value={String(report.reusedCount)} />
                <Stat label="mount" value={String(report.mountedCount)} />
                <Stat label="remove" value={String(report.removedCount)} />
                <Stat label="drift" value={String(report.identityDriftCount)} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {rows.map((row, index) => (
              <LessonRowCard key={keyOf(row, index)} row={row} index={index} />
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Как читать sandbox
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              Вводите заметки в строки и увеличивайте локальный счётчик.
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              Потом меняйте порядок списка и смотрите, остаётся ли local state у той же
              сущности.
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              Именно для этого в строках есть внутренний state, а не только props.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LessonRowCard({ row, index }: { row: LessonRow; index: number }) {
  const instanceId = `row-${useId()}`;
  // В строке есть local state специально ради демонстрации:
  // так видно, привязан ли он к данным или только к позиции списка.
  const [note, setNote] = useState(row.seedNote);
  const [ticks, setTicks] = useState(0);

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            slot {index}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950">{row.title}</h3>
          <p className="mt-1 text-sm text-slate-600">
            data id: <span className="font-mono">{row.id}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            instance
          </p>
          <p className="mt-1 font-mono text-xs text-slate-800">{instanceId}</p>
        </div>
      </div>

      <label className="mt-4 block space-y-2 text-sm text-slate-700">
        <span className="font-medium">Локальная заметка строки</span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400"
        />
      </label>

      <button
        type="button"
        onClick={() => setTicks((current) => current + 1)}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
      >
        Локальный счётчик: {ticks}
      </button>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
