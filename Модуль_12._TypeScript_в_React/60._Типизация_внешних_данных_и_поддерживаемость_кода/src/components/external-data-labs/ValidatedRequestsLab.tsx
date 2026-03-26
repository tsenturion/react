import { useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, StatusPill } from '../ui';
import {
  describeRequestState,
  requestBoundarySnippet,
  requestSnippet,
  runValidatedRequest,
  type NetworkMode,
  type RequestState,
  type RequestVariant,
} from '../../lib/request-validation-model';

const networkOptions: readonly { id: NetworkMode; label: string }[] = [
  { id: 'ok', label: 'Network ok' },
  { id: 'offline', label: 'Offline' },
] as const;

const requestVariants: readonly { id: RequestVariant; label: string }[] = [
  { id: 'valid', label: 'Valid response' },
  { id: 'empty', label: 'Empty response' },
  { id: 'invalid-item', label: 'Broken item' },
  { id: 'wrong-envelope', label: 'Wrong envelope' },
] as const;

export function ValidatedRequestsLab() {
  const [networkMode, setNetworkMode] = useState<NetworkMode>('ok');
  const [variant, setVariant] = useState<RequestVariant>('valid');
  const [state, setState] = useState<RequestState>({ status: 'idle' });
  const [runCount, setRunCount] = useState(0);

  async function handleRun() {
    setRunCount((count) => count + 1);
    setState({
      status: 'loading',
      note: 'Сначала приходит raw response, и только потом начинается schema parse.',
    });

    const next = await runValidatedRequest(networkMode, variant);
    setState(next);
  }

  const source =
    state.status === 'error'
      ? state.source
      : state.status === 'loading'
        ? 'parsing'
        : 'ready';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Network mode
          </p>
          <div className="flex flex-wrap gap-2">
            {networkOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setNetworkMode(item.id)}
                className={`chip ${networkMode === item.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Response variant
          </p>
          <div className="flex flex-wrap gap-2">
            {requestVariants.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setVariant(item.id)}
                className={`chip ${variant === item.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Current flow: {networkMode} / {variant}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Success наступает только после network + schema boundary, а не после
            `.json()`.
          </p>
        </div>
        <button type="button" onClick={() => void handleRun()} className="button-primary">
          Run validated request
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Runs"
          value={String(runCount)}
          hint="Каждый запуск заново проходит request lifecycle и schema boundary."
          tone="accent"
        />
        <MetricCard
          label="Status"
          value={state.status}
          hint={describeRequestState(state)}
          tone="cool"
        />
        <MetricCard
          label="Error source"
          value={source}
          hint="Это помогает не смешивать network problems и data contract problems."
          tone="dark"
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Request result</p>
          <StatusPill
            tone={
              state.status === 'error'
                ? 'error'
                : state.status === 'success'
                  ? 'success'
                  : 'warn'
            }
          >
            {state.status}
          </StatusPill>
        </div>

        {state.status === 'success' ? (
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {state.items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item.title} · {item.stage} · owner {item.owner}
              </li>
            ))}
          </ul>
        ) : null}

        {state.status === 'error' ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-6 text-rose-950">{state.message}</p>
            {state.issues.length > 0 ? (
              <ListBlock title="Contract issues" items={state.issues} />
            ) : null}
          </div>
        ) : null}

        {state.status === 'empty' ? (
          <p className="mt-4 text-sm leading-6 text-slate-700">{state.reason}</p>
        ) : null}

        {state.status === 'loading' ? (
          <p className="mt-4 text-sm leading-6 text-slate-700">{state.note}</p>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Envelope schema" code={requestSnippet} />
        <CodeBlock label="Request boundary" code={requestBoundarySnippet} />
      </div>
    </div>
  );
}
