import { useState } from 'react';

import { createChecklistItems } from '../../lib/complex-state-domain';
import {
  appendChecklistItem,
  buildArrayStateReport,
  moveFirstItemToEnd,
  removeCompletedItems,
  toggleChecklistItem,
} from '../../lib/array-state-model';

export function ArrayStateWorkshop() {
  const [items, setItems] = useState(createChecklistItems);
  const report = buildArrayStateReport(items);
  const firstPending = items.find((item) => !item.done);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              array state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {report.completed} из {report.total} шагов уже готовы
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
            {report.orderLabel}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setItems((current) => appendChecklistItem(current))}
            className="chip"
          >
            Добавить шаг
          </button>
          <button
            type="button"
            onClick={() => {
              if (!firstPending) return;
              setItems((current) => toggleChecklistItem(current, firstPending.id));
            }}
            className="chip"
          >
            Переключить первый open-item
          </button>
          <button
            type="button"
            onClick={() => setItems((current) => moveFirstItemToEnd(current))}
            className="chip"
          >
            Перенести первый шаг в конец
          </button>
          <button
            type="button"
            onClick={() => setItems((current) => removeCompletedItems(current))}
            className="chip"
          >
            Удалить completed
          </button>
          <button
            type="button"
            onClick={() => setItems(createChecklistItems())}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>

      <div className="grid gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setItems((current) => toggleChecklistItem(current, item.id))}
            className={`rounded-[24px] border px-4 py-4 text-left transition ${
              item.done
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="block text-sm font-semibold">{item.title}</span>
            <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
              {item.done ? 'done' : 'open'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
