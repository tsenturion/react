import { useState } from 'react';

import {
  appendPlanningTask,
  buildMinimalStateReport,
  getVisiblePlanningTasks,
  togglePlanningTask,
} from '../../lib/minimal-state-model';
import { createPlanningTasks } from '../../lib/state-architecture-domain';

export function MinimalStatePlanner() {
  const [tasks, setTasks] = useState(createPlanningTasks);
  const [query, setQuery] = useState('');
  const [showDoneOnly, setShowDoneOnly] = useState(false);

  // visibleTasks, completed и totals здесь намеренно не живут в состоянии.
  // Они полностью выводятся из raw tasks и текущего фильтра на каждом рендере.
  const visibleTasks = getVisiblePlanningTasks(tasks, query, showDoneOnly);
  const report = buildMinimalStateReport(tasks, query, showDoneOnly);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              minimal state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              В state хранится только то, что нельзя честно вычислить
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
            visible: {report.visible}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Фильтр по заголовку"
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-0"
          />
          <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={showDoneOnly}
              onChange={(event) => setShowDoneOnly(event.target.checked)}
            />
            Только done
          </label>
          <button
            type="button"
            onClick={() => setTasks((current) => appendPlanningTask(current))}
            className="chip"
          >
            Добавить шаг
          </button>
          <button
            type="button"
            onClick={() => {
              setTasks(createPlanningTasks());
              setQuery('');
              setShowDoneOnly(false);
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[24px] border border-black/10 bg-white/65 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            total
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {report.total}
          </p>
        </div>
        <div className="rounded-[24px] border border-teal-300/60 bg-teal-100/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            completed
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {report.completed}
          </p>
        </div>
        <div className="rounded-[24px] border border-orange-300/60 bg-orange-100/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            pending estimate
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {report.pendingEstimate}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {visibleTasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => setTasks((current) => togglePlanningTask(current, task.id))}
            className={`rounded-[24px] border px-4 py-4 text-left transition ${
              task.done
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="block text-sm font-semibold">{task.title}</span>
            <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
              {task.track} • {task.estimate} pt • {task.done ? 'done' : 'open'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
