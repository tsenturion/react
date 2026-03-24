import { useEffect, useRef, useState } from 'react';

import { MetricCard, Panel, StatusPill } from '../ui';

export function PollingEnvironmentLab({ intervalMs = 1000 }: { intervalMs?: number }) {
  const [active, setActive] = useState(false);
  const [ticks, setTicks] = useState(0);
  const intervalIdRef = useRef<number | null>(null);

  function stopPolling() {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    setActive(false);
  }

  function startPolling() {
    if (intervalIdRef.current !== null) {
      return;
    }

    setActive(true);

    // Таймер хранится в ref, чтобы его можно было надёжно остановить
    // без лишнего ререндера и без зависимости от stale closure в cleanup.
    intervalIdRef.current = window.setInterval(() => {
      setTicks((current) => current + 1);
    }, intervalMs);
  }

  useEffect(() => stopPolling, []);

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startPolling}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Запустить polling
          </button>
          <button
            type="button"
            onClick={stopPolling}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Остановить polling
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Polling"
            value={active ? 'active' : 'stopped'}
            hint="Fake timers должны двигать polling-поток без реального ожидания секунд."
            tone="accent"
          />
          <MetricCard
            label="Tick Count"
            value={String(ticks)}
            hint="Этот счётчик удобно использовать как наблюдаемый async-result при работе с таймерами."
            tone="cool"
          />
          <MetricCard
            label="Interval"
            value={`${intervalMs}ms`}
            hint="В тесте время управляется явно, а не через реальную паузу."
            tone="dark"
          />
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusPill tone={active ? 'success' : 'warn'}>
            {active ? 'polling-active' : 'polling-stopped'}
          </StatusPill>
          <p className="text-sm leading-6 text-slate-600">
            Если таймеры не сбрасываются после теста, следующий async suite начинает
            зависеть от чужого окружения.
          </p>
        </div>

        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm"
        >
          Снимок обновлён {ticks} раз.{' '}
          {active ? 'Polling активен.' : 'Polling остановлен.'}
        </div>
      </Panel>
    </div>
  );
}
