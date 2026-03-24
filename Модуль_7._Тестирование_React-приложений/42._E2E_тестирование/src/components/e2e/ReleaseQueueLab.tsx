import { useState } from 'react';

import {
  loadReleaseQueue,
  type QueueProfile,
  type ReleaseQueueItem,
} from '../../lib/e2e-service';
import { Panel, StatusPill } from '../ui';

type QueueState =
  | { phase: 'idle'; items: ReleaseQueueItem[]; error: null; attempt: number }
  | { phase: 'loading'; items: ReleaseQueueItem[]; error: null; attempt: number }
  | { phase: 'error'; items: ReleaseQueueItem[]; error: string; attempt: number }
  | { phase: 'success'; items: ReleaseQueueItem[]; error: null; attempt: number };

const idleState: QueueState = {
  phase: 'idle',
  items: [],
  error: null,
  attempt: 0,
};

export function ReleaseQueueLab() {
  const [profile, setProfile] = useState<QueueProfile>('stable');
  const [state, setState] = useState<QueueState>(idleState);

  async function requestQueue() {
    const nextAttempt = state.attempt + 1;

    setState((current) => ({
      phase: 'loading',
      items: current.items,
      error: null,
      attempt: nextAttempt,
    }));

    try {
      const items = await loadReleaseQueue(profile, nextAttempt);
      setState({
        phase: 'success',
        items,
        error: null,
        attempt: nextAttempt,
      });
    } catch (error) {
      setState({
        phase: 'error',
        items: [],
        error: error instanceof Error ? error.message : 'Неизвестная ошибка загрузки.',
        attempt: nextAttempt,
      });
    }
  }

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Data journey
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Loading, error и retry как один пользовательский путь
            </h2>
          </div>
          <StatusPill
            tone={
              state.phase === 'error'
                ? 'error'
                : state.phase === 'success'
                  ? 'success'
                  : 'warn'
            }
          >
            {state.phase}
          </StatusPill>
        </div>

        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Профиль очереди</span>
            <select
              value={profile}
              onChange={(event) => {
                setProfile(event.target.value as QueueProfile);
                setState(idleState);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
            >
              <option value="stable">stable</option>
              <option value="flaky">flaky</option>
              <option value="empty">empty</option>
            </select>
          </label>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Attempt counter
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {state.attempt}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Для flaky-профиля первый запрос специально падает, чтобы был виден не только
              happy path, но и реальное восстановление сценария через retry.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              void requestQueue();
            }}
            disabled={state.phase === 'loading'}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {state.phase === 'error' ? 'Повторить загрузку' : 'Загрузить очередь'}
          </button>
          <button
            type="button"
            onClick={() => setState(idleState)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Сбросить сценарий
          </button>
        </div>
      </Panel>

      {state.phase === 'loading' ? (
        <Panel>
          <div
            role="status"
            className="rounded-[24px] border border-blue-200 bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-950"
          >
            Загрузка очереди... Браузерный сценарий здесь ждёт наблюдаемое состояние, а не
            искусственный `sleep`.
          </div>
        </Panel>
      ) : null}

      {state.phase === 'error' ? (
        <Panel>
          <div
            role="alert"
            className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-950"
          >
            {state.error}
          </div>
        </Panel>
      ) : null}

      {state.phase === 'success' && state.items.length === 0 ? (
        <Panel>
          <div
            role="status"
            className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950"
          >
            Очередь пуста. Даже empty-state здесь остаётся частью системного
            пользовательского пути и должен быть учтён в E2E-наблюдении.
          </div>
        </Panel>
      ) : null}

      {state.phase === 'success' && state.items.length > 0 ? (
        <Panel className="space-y-4">
          <div
            role="status"
            className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-950"
          >
            Очередь восстановлена и готова к проверке как единый экран после retry.
          </div>
          <ul className="space-y-3">
            {state.items.map((item) => (
              <li
                key={item.id}
                className="rounded-[24px] border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {item.owner}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                  <StatusPill tone={item.status === 'blocked' ? 'error' : 'success'}>
                    {item.status}
                  </StatusPill>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}
