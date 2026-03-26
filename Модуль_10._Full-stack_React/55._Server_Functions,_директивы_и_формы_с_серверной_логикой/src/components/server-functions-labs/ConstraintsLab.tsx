'use client';

import { useState } from 'react';

import {
  evaluateServerFunctionScenario,
  type CallMoment,
} from '../../lib/server-function-constraints-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function ConstraintsLab() {
  const [callMoment, setCallMoment] = useState<CallMoment>('submit');
  const [needsWindowApi, setNeedsWindowApi] = useState(false);
  const [argsSerializable, setArgsSerializable] = useState(true);
  const [needsSecretRead, setNeedsSecretRead] = useState(true);
  const [expectsInstantTyping, setExpectsInstantTyping] = useState(false);
  const result = evaluateServerFunctionScenario({
    callMoment,
    needsWindowApi,
    argsSerializable,
    needsSecretRead,
    expectsInstantTyping,
  });

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Server function limits</span>
          <p className="text-sm leading-6 text-slate-600">
            Меняйте ограничения сценария и смотрите, где server function подходит, а где
            граница ломается из-за browser APIs, несериализуемого payload или live typing.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {(['submit', 'click', 'change'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCallMoment(value)}
                className={`chip ${callMoment === value ? 'chip-active' : ''}`}
              >
                {value}
              </button>
            ))}
          </div>

          {[
            {
              value: needsWindowApi,
              setValue: setNeedsWindowApi,
              label: 'Нужен window / DOM API',
            },
            {
              value: argsSerializable,
              setValue: setArgsSerializable,
              label: 'Payload сериализуемый',
            },
            {
              value: needsSecretRead,
              setValue: setNeedsSecretRead,
              label: 'Есть protected server read',
            },
            {
              value: expectsInstantTyping,
              setValue: setExpectsInstantTyping,
              label: 'Нужен мгновенный typing loop',
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => item.setValue(!item.value)}
              className={`rounded-[24px] border px-4 py-4 text-left transition ${
                item.value
                  ? 'border-sky-500 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="mt-2 block text-sm leading-6 opacity-80">
                {item.value ? 'Да' : 'Нет'}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Call moment"
          value={callMoment}
          hint="Серверная граница работает лучше всего на явных click/submit boundary."
          tone="accent"
        />
        <div className="panel p-5 md:col-span-2">
          <StatusPill tone={result.tone}>{result.headline}</StatusPill>
          <p className="mt-4 text-sm leading-6 text-slate-700">{result.explanation}</p>
        </div>
      </div>

      <Panel>
        <ListBlock title="Scenario trace" items={result.trace} />
      </Panel>
    </div>
  );
}
