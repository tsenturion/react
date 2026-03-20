import { useChecklistBoard } from '../../hooks/useChecklistBoard';
import { MetricCard } from '../ui';

const owners = ['UI', 'Data', 'QA'] as const;

export function ChecklistApiLab() {
  const board = useChecklistBoard();

  return (
    <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Hook API
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li>`toggleItem(id)` меняет готовность шага.</li>
            <li>`assignOwner(id, owner)` меняет исполнителя.</li>
            <li>`reset()` возвращает исходное состояние.</li>
            <li>`summary` уже собран и не требует дублирования в компоненте.</li>
          </ul>
        </div>

        <div className="grid gap-3">
          <MetricCard
            label="Прогресс"
            value={board.summary.progressLabel}
            hint="Derived summary приходит из hook-а вместе с domain commands."
          />
          <MetricCard
            label="Следующий шаг"
            value={board.summary.nextPending}
            hint="Компонент не пересчитывает next pending вручную."
            tone="cool"
          />
        </div>

        <button
          type="button"
          onClick={board.reset}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Сбросить checklist
        </button>
      </div>

      <div className="grid gap-3">
        {board.items.map((item) => (
          <div
            key={item.id}
            className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">Текущий owner: {item.owner}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={item.owner}
                  onChange={(event) => board.assignOwner(item.id, event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
                >
                  {owners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => board.toggleItem(item.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    item.done
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.done ? 'Готово' : 'Отметить'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
