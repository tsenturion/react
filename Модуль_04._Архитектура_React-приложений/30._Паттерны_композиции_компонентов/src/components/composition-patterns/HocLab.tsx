import { useState } from 'react';

import { describeHocScenario } from '../../lib/hoc-pattern-model';
import { MetricCard, StatusPill } from '../ui';
import { withPatternStatus, type InjectedStatusProps } from './withPatternStatus';

type ScenarioCardOwnProps = {
  title: string;
  summary: string;
};

function ScenarioCardBase({
  title,
  summary,
  tone,
  statusLabel,
  note,
}: ScenarioCardOwnProps & InjectedStatusProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={tone}>{statusLabel}</StatusPill>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{summary}</p>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm leading-6 text-slate-700">{note}</p>
      </div>
    </article>
  );
}

function ScenarioLineBase({
  title,
  tone,
  statusLabel,
}: { title: string } & InjectedStatusProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <StatusPill tone={tone}>{statusLabel}</StatusPill>
    </div>
  );
}

const ScenarioCard = withPatternStatus<ScenarioCardOwnProps>(ScenarioCardBase);
const ScenarioLine = withPatternStatus<{ title: string }>(ScenarioLineBase);

export function HocLab() {
  const [consumers, setConsumers] = useState(3);
  const [crossCutting, setCrossCutting] = useState(true);
  const [legacyInterop, setLegacyInterop] = useState(false);
  const diagnostics = describeHocScenario({
    consumers,
    crossCutting,
    legacyInterop,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={diagnostics.tone}>{diagnostics.tone}</StatusPill>
        <p className="text-sm leading-6 text-slate-600">
          HOC всё ещё встречаются, но чаще как legacy wrapper или adapter-слой, а не как
          первый выбор для нового API-компонента.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Consumers: {consumers}
            </span>
            <input
              type="range"
              min={1}
              max={6}
              value={consumers}
              onChange={(event) => setConsumers(Number(event.target.value))}
              className="mt-3 w-full"
            />
          </label>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <input
                type="checkbox"
                checked={crossCutting}
                onChange={(event) => setCrossCutting(event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Есть cross-cutting concern для нескольких компонентов
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <input
                type="checkbox"
                checked={legacyInterop}
                onChange={(event) => setLegacyInterop(event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Нужна legacy/framework integration через wrapper
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <ScenarioCard
            title="Pattern diagnostics card"
            summary="Wrapper вычисляет injected props снаружи и передаёт их в base component без явного объявления этих props в JSX использования."
            consumers={consumers}
            crossCutting={crossCutting}
            legacyInterop={legacyInterop}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <ScenarioLine
              title={ScenarioCard.displayName ?? 'withPatternStatus'}
              consumers={consumers}
              crossCutting={crossCutting}
              legacyInterop={legacyInterop}
            />
            <ScenarioLine
              title={ScenarioLine.displayName ?? 'withPatternStatus'}
              consumers={consumers}
              crossCutting={crossCutting}
              legacyInterop={legacyInterop}
            />
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">
              Современная альтернатива
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {diagnostics.modernAlternative}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Главный плюс"
          value="Wrapper reuse"
          hint="HOC удобно навешивает один и тот же cross-cutting слой на несколько base-компонентов."
          tone="cool"
        />
        <MetricCard
          label="Главный минус"
          value="Hidden props"
          hint="Чем больше wrapper-слоёв, тем сложнее понять, откуда именно пришли данные в компонент."
        />
        <MetricCard
          label="Современный default"
          value="Hooks first"
          hint="В новом коде HOC обычно уступают custom hooks и явной композиции."
          tone="accent"
        />
      </div>
    </div>
  );
}
