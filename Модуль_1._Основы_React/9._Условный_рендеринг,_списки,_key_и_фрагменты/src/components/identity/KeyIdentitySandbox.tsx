import { useMemo, useState } from 'react';

import type { KeyStrategy } from '../../lib/reconciliation-model';
import { buildKeyBugReport } from '../../lib/key-bug-model';
import { StatusPill } from '../ui';

type DemoItem = {
  id: string;
  title: string;
  open: boolean;
};

const initialItems: DemoItem[] = [
  { id: 'a', title: 'Условный UI', open: true },
  { id: 'b', title: 'Списки', open: true },
  { id: 'c', title: 'key', open: true },
  { id: 'd', title: 'Фрагменты', open: false },
];

function CounterRow({ item }: { item: DemoItem }) {
  const [count, setCount] = useState(0);
  const [draft, setDraft] = useState(item.title);

  // Локальное состояние здесь намеренно существует ради демонстрации:
  // при плохом key видно, как React переносит этот state не к тем данным.
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            {item.open ? 'видимый' : 'скрыт'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCount((current) => current + 1)}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
        >
          Счётчик: {count}
        </button>
      </div>

      <label className="mt-3 block space-y-2 text-sm text-slate-700">
        <span className="font-medium">Локальный draft</span>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        />
      </label>
    </div>
  );
}

export function KeyIdentitySandbox({
  strategy,
  mode,
}: {
  strategy: KeyStrategy;
  mode: 'reorder' | 'filter';
}) {
  const [items, setItems] = useState(initialItems);
  const [renderVersion, setRenderVersion] = useState(0);
  const [openOnly, setOpenOnly] = useState(false);

  const visibleItems = useMemo(
    () => (mode === 'filter' && openOnly ? items.filter((item) => item.open) : items),
    [items, mode, openOnly],
  );

  const report = buildKeyBugReport(
    strategy,
    mode === 'filter' ? 'filter-first' : 'reverse',
  );

  const keyOf = (item: DemoItem, index: number) =>
    strategy === 'stable-id'
      ? item.id
      : strategy === 'index'
        ? String(index)
        : `${item.id}-${renderVersion}`;

  const touchRender = () => setRenderVersion((current) => current + 1);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={report.tone}>{report.title}</StatusPill>
        <p className="text-sm leading-6 text-slate-600">{report.note}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setItems((current) => [...current].reverse());
            touchRender();
          }}
          className="chip"
        >
          Перевернуть порядок
        </button>
        <button
          type="button"
          onClick={() => {
            setItems((current) => [
              { id: `new-${current.length}`, title: 'Новый урок', open: true },
              ...current,
            ]);
            touchRender();
          }}
          className="chip"
        >
          Добавить в начало
        </button>
        {mode === 'filter' ? (
          <button
            type="button"
            onClick={() => {
              setOpenOnly((current) => !current);
              touchRender();
            }}
            className="chip"
          >
            {openOnly ? 'Показать все' : 'Скрыть закрытые'}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setItems(initialItems);
            setOpenOnly(false);
            touchRender();
          }}
          className="chip"
        >
          Сбросить
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visibleItems.map((item, index) => (
          <CounterRow key={keyOf(item, index)} item={item} />
        ))}
      </div>
    </div>
  );
}
