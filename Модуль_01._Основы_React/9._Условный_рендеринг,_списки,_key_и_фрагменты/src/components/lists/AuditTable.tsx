import { Fragment } from 'react';

import type { AuditEntry } from '../../lib/fragment-model';

export function AuditTable({
  entries,
  expanded,
}: {
  entries: readonly AuditEntry[];
  expanded: boolean;
}) {
  return (
    <table className="w-full border-separate border-spacing-y-2 text-left">
      <thead>
        <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
          <th className="px-4 py-2">Событие</th>
          <th className="px-4 py-2">Детали</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          // Fragment нужен именно здесь:
          // одной записи соответствуют сразу две строки таблицы, но wrapper-элемент сломал бы структуру.
          <Fragment key={entry.id}>
            <tr className="rounded-[24px] bg-white shadow-sm">
              <td className="rounded-l-2xl border border-slate-200 border-r-0 px-4 py-3 font-medium text-slate-900">
                {entry.title}
              </td>
              <td className="rounded-r-2xl border border-slate-200 border-l-0 px-4 py-3 text-sm text-slate-600">
                Основная строка записи
              </td>
            </tr>
            {expanded ? (
              <tr>
                <td
                  colSpan={2}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
                >
                  {entry.detail}
                </td>
              </tr>
            ) : null}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
