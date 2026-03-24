import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAsyncTestHarness } from '../../state/AsyncTestHarnessContext';
import { Panel, StatusPill } from '../ui';

export function ProviderHarnessLab() {
  const location = useLocation();
  const { assertionMode, networkMode, setAssertionMode, toggleNetworkMode } =
    useAsyncTestHarness();
  const [showContract, setShowContract] = useState(false);

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone="success">{assertionMode}</StatusPill>
          <StatusPill tone="warn">{networkMode}</StatusPill>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Current Route
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-900">{location.pathname}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{location.search}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Harness Contract
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Компонент читает route и context, поэтому тесту нужен небольшой render
              helper с предсказуемым initial route.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setAssertionMode((current) =>
                current === 'integration' ? 'isolated' : 'integration',
              )
            }
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Переключить assertion mode
          </button>
          <button
            type="button"
            onClick={toggleNetworkMode}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Переключить network mode
          </button>
          <button
            type="button"
            onClick={() => setShowContract((current) => !current)}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            {showContract ? 'Скрыть contract summary' : 'Показать contract summary'}
          </button>
        </div>
      </Panel>

      {showContract ? (
        <Panel>
          <p className="text-sm leading-6 text-slate-700">
            Focused render helper должен скрывать только повторяемые обёртки
            `MemoryRouter` и provider. Если helper сам строит половину сценария, test
            arrangement становится неочевидным.
          </p>
        </Panel>
      ) : null}
    </div>
  );
}
