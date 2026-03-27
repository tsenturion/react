import { useState } from 'react';

import { createNormalizedBoard } from '../../lib/complex-state-domain';
import {
  buildNormalizedColumns,
  buildNormalizationComparison,
  findTaskColumnId,
  moveNormalizedTaskToNextColumn,
  renameNormalizedTask,
  toggleNormalizedTask,
  type NormalizationScenario,
} from '../../lib/normalization-model';

export function NormalizedTaskBoard() {
  const [board, setBoard] = useState(createNormalizedBoard);
  const [selectedTaskId, setSelectedTaskId] = useState('task-state');
  const [scenario, setScenario] = useState<NormalizationScenario>('rename');

  const columns = buildNormalizedColumns(board);
  const comparison = buildNormalizationComparison(scenario);
  const selectedTask = board.tasksById[selectedTaskId];
  const currentColumn = findTaskColumnId(board, selectedTaskId);

  const applyScenario = () => {
    setBoard((current) => {
      if (scenario === 'rename') {
        return renameNormalizedTask(current, selectedTaskId);
      }

      if (scenario === 'toggle') {
        return toggleNormalizedTask(current, selectedTaskId);
      }

      return moveNormalizedTaskToNextColumn(current, selectedTaskId);
    });
  };

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          normalized state
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
          Выбрана задача: {selectedTask.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Текущая колонка: {currentColumn}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {(['rename', 'toggle', 'move'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setScenario(item)}
              className={scenario === item ? 'chip chip-active' : 'chip'}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {Object.values(board.tasksById).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => setSelectedTaskId(task.id)}
              className={selectedTaskId === task.id ? 'chip chip-active' : 'chip'}
            >
              {task.title}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={applyScenario} className="chip">
            Применить выбранный update
          </button>
          <button
            type="button"
            onClick={() => {
              setBoard(createNormalizedBoard());
              setSelectedTaskId('task-state');
              setScenario('rename');
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>

        <div className="mt-5 rounded-[24px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
          nested copies: {comparison.nestedCopies}, normalized copies:{' '}
          {comparison.normalizedCopies}
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <section
            key={column.id}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h4 className="text-lg font-semibold text-slate-900">{column.title}</h4>
            <div className="mt-4 space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-[22px] border px-4 py-4 text-sm ${
                    selectedTaskId === task.id
                      ? 'border-blue-300 bg-blue-50 text-blue-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{task.title}</span>
                    <span>{task.points} pt</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {task.done ? 'done' : 'open'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
