import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import type { AsyncRecord, AsyncScenario } from '../../lib/async-testing-domain';
import {
  defaultAsyncScenarioLoader,
  type AsyncScenarioLoader,
} from '../../lib/async-testing-runtime';
import { MetricCard, Panel, StatusPill } from '../ui';

export function AsyncResourceLab({
  resourceKey = 'playbook',
  loadRecords = defaultAsyncScenarioLoader,
}: {
  resourceKey?: string;
  loadRecords?: AsyncScenarioLoader;
}) {
  const [scenario, setScenario] = useState<AsyncScenario>('success');
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'success'>(
    'loading',
  );
  const [records, setRecords] = useState<AsyncRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const latestRequestRef = useRef(0);

  useEffect(() => {
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    // Сбрасываем UI в отдельную microtask: так эффект остаётся местом для синхронизации
    // с async loader, а не прямого каскадного setState в теле useEffect.
    queueMicrotask(() => {
      if (latestRequestRef.current !== requestId) {
        return;
      }

      setStatus('loading');
      setErrorMessage('');
      setRequestCount((current) => current + 1);
    });

    void loadRecords(scenario, resourceKey)
      .then((nextRecords) => {
        // Последний request побеждает: это защищает demo и тесты от stale result,
        // если сценарий быстро меняется и старый Promise завершится позже нового.
        if (latestRequestRef.current !== requestId) {
          return;
        }

        setRecords(nextRecords);
        setStatus(nextRecords.length > 0 ? 'success' : 'empty');
      })
      .catch((error: unknown) => {
        if (latestRequestRef.current !== requestId) {
          return;
        }

        setRecords([]);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Сценарий завершился неизвестной ошибкой.',
        );
        setStatus('error');
      });
  }, [loadRecords, reloadKey, resourceKey, scenario]);

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {(['success', 'empty', 'error'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setScenario(item)}
              className={clsx(
                'rounded-xl px-4 py-2 text-sm font-semibold transition',
                scenario === item
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {item === 'success' ? 'Success' : item === 'empty' ? 'Empty' : 'Error'}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Повторить запрос
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Сценарий"
            value={scenario}
            hint="Меняйте async-сценарий и смотрите, как тест должен следовать за видимыми состояниями."
            tone="accent"
          />
          <MetricCard
            label="Resource Key"
            value={resourceKey}
            hint="Rerender с новым ключом должен приводить к новому запросу и новому DOM-result."
            tone="cool"
          />
          <MetricCard
            label="Request Count"
            value={String(requestCount)}
            hint="Счётчик помогает увидеть, что поведение реально переходит через повторные загрузки."
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
            Правильный async test ждёт доступный результат, а не подглядывает во
            внутренний state-компонента.
          </p>
        </div>

        {status === 'loading' ? (
          <div
            role="status"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-950"
          >
            Загрузка сценария `{resourceKey}`. Именно этот loading-state должен стать
            первой опорой для async-assertion.
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

        {status === 'empty' ? (
          <div
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950"
          >
            Ответ пришёл, но список пуст. Пустой результат тоже должен быть частью async
            suite.
          </div>
        ) : null}

        {status === 'success' ? (
          <ul aria-label="Асинхронные сценарии" className="space-y-3">
            {records.map((record) => (
              <li
                key={record.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">{record.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{record.note}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
    </div>
  );
}
