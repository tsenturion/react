import { useState } from 'react';

import {
  fetchAsyncPlaybook,
  type AsyncPlaybookEntry,
} from '../../lib/async-testing-http';
import { MetricCard, Panel, StatusPill } from '../ui';

export function MockedHttpLab({
  endpoint = '/data/async-testing-playbook.json',
}: {
  endpoint?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [items, setItems] = useState<AsyncPlaybookEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestCount, setRequestCount] = useState(0);

  async function runRequest() {
    setStatus('loading');
    setErrorMessage('');
    setRequestCount((current) => current + 1);

    try {
      const nextItems = await fetchAsyncPlaybook(endpoint);
      setItems(nextItems);
      setStatus('success');
    } catch (error: unknown) {
      setItems([]);
      setErrorMessage(
        error instanceof Error ? error.message : 'Запрос завершился неизвестной ошибкой.',
      );
      setStatus('error');
    }
  }

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runRequest}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {status === 'idle' ? 'Загрузить через fetch' : 'Обновить через fetch'}
          </button>

          {status === 'error' ? (
            <button
              type="button"
              onClick={runRequest}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Повторить запрос
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Endpoint"
            value={endpoint}
            hint="Компонент использует реальный fetch-helper, а тест подменяет только HTTP-границу."
            tone="accent"
          />
          <MetricCard
            label="HTTP Status"
            value={status}
            hint="Жизненный цикл запроса должен быть наблюдаем через DOM, а не через private variables."
            tone="cool"
          />
          <MetricCard
            label="Fetch Calls"
            value={String(requestCount)}
            hint="Счётчик помогает увидеть retries и повторные запросы после ошибки."
            tone="dark"
          />
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusPill
            tone={
              status === 'success' ? 'success' : status === 'error' ? 'error' : 'warn'
            }
          >
            {status}
          </StatusPill>
          <p className="text-sm leading-6 text-slate-600">
            В тесте запрос лучше мокать на уровне fetch или client adapter, а не внутри
            компонента.
          </p>
        </div>

        {status === 'loading' ? (
          <div
            role="status"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-950"
          >
            Идёт mocked HTTP request. Тест должен дождаться следующего наблюдаемого
            состояния.
          </div>
        ) : null}

        {status === 'error' ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-950"
          >
            {errorMessage}
          </div>
        ) : null}

        {status === 'success' ? (
          <ul aria-label="HTTP playbook" className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
    </div>
  );
}
