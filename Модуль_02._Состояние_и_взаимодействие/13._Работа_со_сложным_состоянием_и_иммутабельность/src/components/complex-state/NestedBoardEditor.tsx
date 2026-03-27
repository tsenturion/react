import { useRef, useState } from 'react';

import { createNestedBoard } from '../../lib/complex-state-domain';
import {
  buildNestedStateReport,
  increaseTaskPointsImmutably,
  increaseTaskPointsMutably,
} from '../../lib/nested-state-model';
import { StatusPill } from '../ui';

const targetColumnId = 'doing';
const targetTaskId = 'task-immutability';

export function NestedBoardEditor() {
  const [board, setBoard] = useState(createNestedBoard);
  const [paintVersion, setPaintVersion] = useState(1);
  const [visibleJournal, setVisibleJournal] = useState<string[]>([]);
  const journalRef = useRef<string[]>([]);
  const report = buildNestedStateReport(board, targetColumnId, targetTaskId);

  const runBadNestedUpdate = () => {
    const next = increaseTaskPointsMutably(board, targetColumnId, targetTaskId, 1);

    // Здесь меняется только leaf-объект, а root остаётся той же ссылкой.
    // Пока другой ререндер не случится, UI может не показать изменение points.
    journalRef.current = [
      'Вложенная задача мутирована напрямую. Ссылка на board сверху осталась прежней.',
      ...journalRef.current,
    ];
    setBoard(next);
  };

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              nested state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{board.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Последний видимый рендер: {paintVersion}
            </p>
          </div>
          <StatusPill tone={report.tone}>{report.targetLabel}</StatusPill>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setVisibleJournal([...journalRef.current]);
              setBoard((current) =>
                increaseTaskPointsImmutably(current, targetColumnId, targetTaskId, 1),
              );
            }}
            className="chip"
          >
            Безопасно повысить points
          </button>
          <button type="button" onClick={runBadNestedUpdate} className="chip">
            Плохое nested-обновление
          </button>
          <button
            type="button"
            onClick={() => {
              setVisibleJournal([...journalRef.current]);
              setPaintVersion((current) => current + 1);
            }}
            className="chip"
          >
            Внешний ререндер
          </button>
          <button
            type="button"
            onClick={() => {
              setBoard(createNestedBoard());
              setPaintVersion(1);
              journalRef.current = [];
              setVisibleJournal([]);
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        {board.columns.map((column) => (
          <section
            key={column.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-slate-900">{column.title}</h4>
            <div className="mt-4 space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm text-slate-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{task.title}</span>
                    <span>points: {task.points}</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {task.assignee.name} • {task.tags.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="space-y-3">
        {visibleJournal.length === 0
          ? null
          : visibleJournal.map((entry, index) => (
              <div
                key={`${entry}-${index}`}
                className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm"
              >
                {entry}
              </div>
            ))}
      </div>
    </div>
  );
}
