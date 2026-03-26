import { useMemo, useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, StatusPill } from '../ui';
import {
  evaluateRouteBoundary,
  routeLoaderSnippet,
  unsafeRouteSnippet,
  type RoutePayloadVariant,
  type RouteStrategy,
} from '../../lib/route-contract-model';

const strategies: readonly { id: RouteStrategy; label: string }[] = [
  { id: 'loader-parse', label: 'Loader parse' },
  { id: 'component-parse', label: 'Component parse' },
  { id: 'unsafe-cast', label: 'Unsafe cast' },
] as const;

const payloads: readonly { id: RoutePayloadVariant; label: string }[] = [
  { id: 'valid', label: 'Valid payload' },
  { id: 'missing-permission', label: 'Missing permission' },
  { id: 'bad-featured', label: 'Broken featured item' },
  { id: 'wrong-summary', label: 'Wrong summary' },
] as const;

export function RouteContractsLab() {
  const [strategy, setStrategy] = useState<RouteStrategy>('loader-parse');
  const [payloadVariant, setPayloadVariant] = useState<RoutePayloadVariant>('valid');
  const outcome = useMemo(
    () => evaluateRouteBoundary(strategy, payloadVariant),
    [payloadVariant, strategy],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Boundary strategy
          </p>
          <div className="flex flex-wrap gap-2">
            {strategies.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStrategy(item.id)}
                className={`chip ${strategy === item.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Payload variant
          </p>
          <div className="flex flex-wrap gap-2">
            {payloads.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPayloadVariant(item.id)}
                className={`chip ${payloadVariant === item.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Strategy"
          value={strategy}
          hint="Граница parse меняет не только код, но и поведение маршрута при mismatch."
          tone="accent"
        />
        <MetricCard
          label="Payload"
          value={payloadVariant}
          hint="Так имитируется drift контракта на стороне сервера."
          tone="cool"
        />
        <MetricCard
          label="Outcome"
          value={outcome.status}
          hint="Loader parse, component parse и unsafe cast дают разные классы последствий."
          tone="dark"
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Boundary result</p>
          <StatusPill
            tone={
              outcome.status === 'ready'
                ? 'success'
                : outcome.status === 'unsafe'
                  ? 'warn'
                  : 'error'
            }
          >
            {outcome.status}
          </StatusPill>
        </div>

        {outcome.status === 'ready' ? (
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p>{outcome.summary}</p>
            <p>{outcome.warning}</p>
          </div>
        ) : null}

        {outcome.status === 'blocked' ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-6 text-rose-950">{outcome.message}</p>
            <ListBlock title="Schema issues" items={outcome.issues} />
          </div>
        ) : null}

        {outcome.status === 'unsafe' ? (
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p>{outcome.preview}</p>
            <p className="text-amber-900">{outcome.risk}</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Loader contract" code={routeLoaderSnippet} />
        <CodeBlock label="Unsafe cast" code={unsafeRouteSnippet} />
      </div>
    </div>
  );
}
