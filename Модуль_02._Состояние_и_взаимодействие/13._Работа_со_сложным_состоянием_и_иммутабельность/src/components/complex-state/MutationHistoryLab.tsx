import { useState } from 'react';

import { createHistorySnapshots } from '../../lib/complex-state-domain';
import {
  appendHistoryImmutably,
  appendHistoryWithMutation,
  buildHistoryComparisonReport,
} from '../../lib/mutation-history-model';

export function MutationHistoryLab() {
  const [badHistory, setBadHistory] = useState(createHistorySnapshots);
  const [goodHistory, setGoodHistory] = useState(createHistorySnapshots);
  const report = buildHistoryComparisonReport(badHistory, goodHistory);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          invisible bugs
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
          История слева мутирует прошлое, история справа хранит snapshot-ы
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              // Левая ветка намеренно повторно сохраняет ту же ссылку в массив истории.
              setBadHistory((current) => appendHistoryWithMutation(current));
              setGoodHistory((current) => appendHistoryImmutably(current));
            }}
            className="chip"
          >
            Сохранить следующую версию
          </button>
          <button
            type="button"
            onClick={() => {
              setBadHistory(createHistorySnapshots());
              setGoodHistory(createHistorySnapshots());
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[28px] border border-rose-300 bg-rose-50/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-rose-950">Мутация</h4>
            <span className="rounded-full bg-white px-4 py-2 text-sm text-rose-800">
              unique refs: {report.bad.uniqueReferences}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {badHistory.map((entry, index) => (
              <div
                key={`${entry.id}-${index}`}
                className="rounded-[22px] border border-rose-200 bg-white px-4 py-4 text-sm text-rose-950"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{entry.title}</span>
                  <span>reviewers: {entry.reviewers}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-emerald-300 bg-emerald-50/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-emerald-950">Копия</h4>
            <span className="rounded-full bg-white px-4 py-2 text-sm text-emerald-800">
              unique refs: {report.good.uniqueReferences}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {goodHistory.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[22px] border border-emerald-200 bg-white px-4 py-4 text-sm text-emerald-950"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{entry.title}</span>
                  <span>reviewers: {entry.reviewers}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
