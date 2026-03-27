import { useState } from 'react';

import { createReferenceItems } from '../../lib/complex-state-domain';
import {
  buildReferenceReuseReport,
  updateReferenceItemsDeepClone,
  updateReferenceItemTargeted,
  type ReferenceReuseReport,
} from '../../lib/structural-sharing-model';

export function StructuralSharingSandbox() {
  const [items, setItems] = useState(createReferenceItems);
  const [selectedId, setSelectedId] = useState('item-3');
  const [report, setReport] = useState<ReferenceReuseReport | null>(null);

  const applyTargeted = () => {
    const next = updateReferenceItemTargeted(items, selectedId);
    setReport(buildReferenceReuseReport(items, next, 'targeted'));
    setItems(next);
  };

  const applyDeepClone = () => {
    const next = updateReferenceItemsDeepClone(items, selectedId);
    setReport(buildReferenceReuseReport(items, next, 'deep-clone'));
    setItems(next);
  };

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          structural sharing
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
          Обновите один элемент и посмотрите, сколько ссылок реально поменялось
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={selectedId === item.id ? 'chip chip-active' : 'chip'}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={applyTargeted} className="chip">
            Точечное копирование
          </button>
          <button type="button" onClick={applyDeepClone} className="chip">
            Глубокое копирование всего списка
          </button>
          <button
            type="button"
            onClick={() => {
              setItems(createReferenceItems());
              setSelectedId('item-3');
              setReport(null);
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>

      {report ? (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] border border-teal-300/60 bg-teal-100/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              reused refs
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {report.reusedCount}
            </p>
          </div>
          <div className="rounded-[24px] border border-orange-300/60 bg-orange-100/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              recreated refs
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {report.recreatedCount}
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              strategy
            </p>
            <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">
              {report.strategy}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{report.summary}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3">
        {items.map((item) => {
          const row = report?.rows.find((entry) => entry.id === item.id);

          return (
            <div
              key={item.id}
              className={`rounded-[24px] border px-4 py-4 shadow-sm ${
                row?.reused
                  ? 'border-emerald-300 bg-emerald-50'
                  : row
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-900">{item.title}</span>
                <span className="text-sm text-slate-700">score: {item.score}</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                owner: {item.owner.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
