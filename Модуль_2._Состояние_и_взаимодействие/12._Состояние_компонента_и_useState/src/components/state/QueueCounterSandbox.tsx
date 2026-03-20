import { useState } from 'react';

export function QueueCounterSandbox() {
  const [directCount, setDirectCount] = useState(0);
  const [functionalCount, setFunctionalCount] = useState(0);

  const runDirectQueue = () => {
    // Все три вызова читают один и тот же `directCount` из текущего рендера.
    // Поэтому в очередь попадут три одинаковые команды "замени на 1".
    setDirectCount(directCount + 1);
    setDirectCount(directCount + 1);
    setDirectCount(directCount + 1);
  };

  const runFunctionalQueue = () => {
    // Здесь каждая функция получает уже queued значение, а не snapshot-переменную
    // из момента клика. Поэтому три шага действительно суммируются.
    setFunctionalCount((current) => current + 1);
    setFunctionalCount((current) => current + 1);
    setFunctionalCount((current) => current + 1);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          direct update
        </p>
        <h3 className="text-3xl font-semibold text-slate-900">{directCount}</h3>
        <p className="text-sm leading-6 text-slate-600">
          Кнопка трижды вызывает `setCount(count + 1)`, но все вызовы используют один и
          тот же snapshot текущего рендера.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={runDirectQueue} className="chip">
            +3 через count + 1
          </button>
          <button type="button" onClick={() => setDirectCount(0)} className="chip">
            Сбросить
          </button>
        </div>
      </article>

      <article className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          functional update
        </p>
        <h3 className="text-3xl font-semibold text-slate-900">{functionalCount}</h3>
        <p className="text-sm leading-6 text-slate-600">
          Здесь каждая функция читает актуальное queued значение и наращивает результат
          шаг за шагом.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={runFunctionalQueue} className="chip">
            {'+3 через prev => prev + 1'}
          </button>
          <button type="button" onClick={() => setFunctionalCount(0)} className="chip">
            Сбросить
          </button>
        </div>
      </article>
    </div>
  );
}
