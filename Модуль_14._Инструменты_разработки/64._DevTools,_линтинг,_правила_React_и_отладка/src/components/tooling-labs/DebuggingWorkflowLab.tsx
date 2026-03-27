import { useMemo, useState } from 'react';

import {
  buildDebuggingWorkflow,
  debugSymptomCards,
  type DebugSymptomId,
  type DebugToolId,
} from '../../lib/debugging-workflow-model';
import { CodeBlock, MetricCard, Panel, StatusPill } from '../ui';

const toolLabels: Record<DebugToolId, string> = {
  devtools: 'React DevTools',
  lint: 'ESLint / react-hooks',
  profiler: 'Profiler-style analysis',
  tests: 'Tests',
};

export function DebuggingWorkflowLab() {
  const [symptom, setSymptom] = useState<DebugSymptomId>('stale-effect');
  const [availableTools, setAvailableTools] = useState<DebugToolId[]>([
    'devtools',
    'lint',
    'tests',
  ]);

  const workflow = buildDebuggingWorkflow(symptom, availableTools);
  const symptomMeta = debugSymptomCards.find((item) => item.id === symptom)!;

  const coverageLabel = useMemo(() => {
    if (availableTools.length >= 4) {
      return 'full stack';
    }

    if (availableTools.length >= 3) {
      return 'good coverage';
    }

    return 'fragile';
  }, [availableTools.length]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Symptom
            </p>
            {debugSymptomCards.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSymptom(item.id);
                }}
                className={[
                  'w-full rounded-[24px] border px-4 py-4 text-left transition',
                  symptom === item.id
                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                ].join(' ')}
              >
                <span className="block text-sm font-semibold">{item.title}</span>
                <span
                  className={[
                    'mt-1 block text-xs leading-5',
                    symptom === item.id ? 'text-blue-100' : 'text-slate-500',
                  ].join(' ')}
                >
                  First tool: {toolLabels[item.firstTool]}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Available tools
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {(Object.entries(toolLabels) as [DebugToolId, string][]).map(
                ([tool, label]) => {
                  const checked = availableTools.includes(tool);

                  return (
                    <label
                      key={tool}
                      className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setAvailableTools((current) =>
                            checked
                              ? current.filter((entry) => entry !== tool)
                              : [...current, tool],
                          );
                        }}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {tool === 'devtools' &&
                            'Нужен для чтения props/state/context и provider boundaries.'}
                          {tool === 'lint' &&
                            'Даёт ранний сигнал по hooks, purity, refs и factories.'}
                          {tool === 'profiler' &&
                            'Помогает понять стоимость рендера и hotspots.'}
                          {tool === 'tests' &&
                            'Закрепляет баг как guardrail после исправления.'}
                        </p>
                      </div>
                    </label>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{workflow.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{symptomMeta.note}</p>
            </div>
            <StatusPill tone={workflow.tone}>
              {workflow.missingTool ? `Missing ${workflow.missingTool}` : coverageLabel}
            </StatusPill>
          </div>
          <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {workflow.steps.map((step) => (
              <li
                key={step}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      </Panel>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <MetricCard
            label="First tool"
            value={toolLabels[symptomMeta.firstTool]}
            hint="Маршрут отладки начинается не с привычного инструмента, а с самого информативного для текущего симптома."
            tone="accent"
          />
          <MetricCard
            label="Available tools"
            value={String(availableTools.length)}
            hint="Чем больше связка диагностики и закрепления, тем меньше отладка зависит от удачи."
            tone="cool"
          />
        </div>
        <CodeBlock
          label="workflow model"
          code={`const workflow = buildDebuggingWorkflow(symptom, availableTools);

if (workflow.missingTool) {
  // сначала добавляем недостающий сигнал,
  // а уже потом пытаемся чинить symptom
}`}
        />
      </div>
    </div>
  );
}
