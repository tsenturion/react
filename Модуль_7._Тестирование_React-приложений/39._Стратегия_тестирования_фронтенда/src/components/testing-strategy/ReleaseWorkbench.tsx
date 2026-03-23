import { useMemo, useState } from 'react';

import { assessReleasePlan } from '../../lib/testing-runtime';
import type { ReleaseScope, TestLayer } from '../../lib/testing-domain';

const allChecks: readonly TestLayer[] = ['unit', 'component', 'integration', 'e2e'];

function toggleCheck(current: readonly TestLayer[], nextCheck: TestLayer) {
  return current.includes(nextCheck)
    ? current.filter((item) => item !== nextCheck)
    : [...current, nextCheck];
}

export function ReleaseWorkbench() {
  const [scope, setScope] = useState<ReleaseScope>('visual');
  const [selectedChecks, setSelectedChecks] = useState<readonly TestLayer[]>([
    'unit',
    'component',
  ]);
  const [hasUserVisibleRisk, setHasUserVisibleRisk] = useState(true);
  const [usesNetwork, setUsesNetwork] = useState(false);
  const [events, setEvents] = useState<readonly string[]>([]);

  const plan = useMemo(
    () =>
      assessReleasePlan({
        scope,
        selectedChecks,
        hasUserVisibleRisk,
        usesNetwork,
      }),
    [scope, selectedChecks, hasUserVisibleRisk, usesNetwork],
  );

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Integration workbench
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Этот mini-flow показывает, что integration test проверяет не один toggle, а
            согласованность нескольких частей UI
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {plan.verdict}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <legend className="text-sm font-medium text-slate-700">Release scope</legend>
          {(['visual', 'flow', 'critical'] as const).map((item) => (
            <label key={item} className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="radio"
                name="scope"
                value={item}
                checked={scope === item}
                onChange={() => setScope(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <legend className="text-sm font-medium text-slate-700">Risk factors</legend>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasUserVisibleRisk}
              onChange={(event) => setHasUserVisibleRisk(event.target.checked)}
            />
            <span>Есть заметный пользовательский риск</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={usesNetwork}
              onChange={(event) => setUsesNetwork(event.target.checked)}
            />
            <span>Сценарий зависит от сети</span>
          </label>
        </fieldset>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {allChecks.map((check) => {
          const checked = selectedChecks.includes(check);

          return (
            <button
              key={check}
              type="button"
              aria-label={check}
              aria-pressed={checked}
              onClick={() => setSelectedChecks((current) => toggleCheck(current, check))}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                checked ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{check}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                {checked ? 'selected' : 'not selected'}
              </p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
        <strong>Release plan:</strong> {plan.summary}
      </div>

      <button
        type="button"
        disabled={plan.verdict !== 'ready'}
        onClick={() =>
          setEvents((current) => [
            `Релиз подтверждён при scope=${scope} и checks=${selectedChecks.join(', ')}`,
            ...current,
          ])
        }
        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Подтвердить релиз
      </button>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Required checks
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {plan.requiredChecks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Release log
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {events.length === 0 ? <li>Лог пока пуст.</li> : null}
            {events.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
