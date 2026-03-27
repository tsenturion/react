import { useState } from 'react';

import {
  evaluateDebugWorkflow,
  type DebugSymptom,
} from '../../lib/workflow-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function WorkflowPlaybookLab() {
  const [symptom, setSymptom] = useState<DebugSymptom>('typing-lag');
  const [productionOnly, setProductionOnly] = useState(true);
  const [profilerShowsSlowCommit, setProfilerShowsSlowCommit] = useState(false);
  const [browserTraceShowsLongTask, setBrowserTraceShowsLongTask] = useState(false);
  const [networkDominates, setNetworkDominates] = useState(false);
  const [routeSpecific, setRouteSpecific] = useState(false);

  const verdict = evaluateDebugWorkflow({
    symptom,
    productionOnly,
    profilerShowsSlowCommit,
    browserTraceShowsLongTask,
    networkDominates,
    routeSpecific,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="First tool"
          value={verdict.firstTool}
          hint={verdict.firstQuestion}
          tone="accent"
        />
        <MetricCard
          label="Layer"
          value={verdict.suspectedLayer}
          hint="Инструмент должен сузить слой проблемы, а не просто добавить ещё один красивый график."
          tone="cool"
        />
        <MetricCard
          label="Next step"
          value={verdict.nextStep}
          hint="Хороший workflow сразу переводит наблюдение в следующее осмысленное действие."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Debugging playbook
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Инструмент выбирается по evidence, а не по привычке
            </h2>
          </div>
          <StatusPill tone={networkDominates ? 'warn' : 'success'}>
            {verdict.firstTool}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Symptom</span>
              <select
                aria-label="Workflow symptom"
                value={symptom}
                onChange={(event) => setSymptom(event.target.value as DebugSymptom)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="typing-lag">Typing lag</option>
                <option value="navigation-stall">Navigation stall</option>
                <option value="refresh-spike">Refresh spike</option>
                <option value="mystery-rerender">Mystery rerender</option>
              </select>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={productionOnly}
                onChange={(event) => setProductionOnly(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Проблема видна только в production-подобной среде
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={profilerShowsSlowCommit}
                onChange={(event) => setProfilerShowsSlowCommit(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                React Profiler уже показывает slow commit
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={browserTraceShowsLongTask}
                onChange={(event) => setBrowserTraceShowsLongTask(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Browser trace показывает long task
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={networkDominates}
                onChange={(event) => setNetworkDominates(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Основной budget уходит в network
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={routeSpecific}
                onChange={(event) => setRouteSpecific(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Симптом завязан на конкретный route или layout
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">Почему это решение</p>
              <p className="text-sm leading-6 text-cyan-950/80">
                {verdict.firstQuestion}
              </p>
              <p className="text-sm leading-6 text-cyan-950/80">{verdict.nextStep}</p>
            </Panel>

            <ListBlock
              title="Рабочая последовательность"
              items={[
                'Определите symptom и среду, в которой он воспроизводится.',
                `Начните с инструмента "${verdict.firstTool}" и сузьте проблему до слоя "${verdict.suspectedLayer}".`,
                'Только затем проверяйте candidate fix и возвращайтесь к trace, чтобы убедиться, что bottleneck действительно ушёл.',
              ]}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}
