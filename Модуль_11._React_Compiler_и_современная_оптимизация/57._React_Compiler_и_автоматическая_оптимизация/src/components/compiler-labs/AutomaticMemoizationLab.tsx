import { useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildComparisonReport,
  getComparisonScenario,
  type ComparisonScenarioId,
} from '../../lib/compiler-comparison-model';

const scenarioOptions: readonly { id: ComparisonScenarioId; label: string }[] = [
  { id: 'dashboard-filter', label: 'Dashboard filters' },
  { id: 'editor-toolbar', label: 'Editor toolbar' },
  { id: 'inspector-table', label: 'Inspector table' },
] as const;

const sizeOptions = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
] as const;

const churnOptions = [
  { id: 'low', label: 'Low churn' },
  { id: 'medium', label: 'Medium churn' },
  { id: 'high', label: 'High churn' },
] as const;

function codeNoiseLabel(value: 'low' | 'medium' | 'high'): string {
  return value === 'low' ? 'Низкий' : value === 'medium' ? 'Средний' : 'Высокий';
}

function compilerFitTone(
  value: 'strong' | 'partial' | 'poor',
): 'success' | 'warn' | 'error' {
  return value === 'strong' ? 'success' : value === 'partial' ? 'warn' : 'error';
}

export function AutomaticMemoizationLab() {
  const [scenarioId, setScenarioId] = useState<ComparisonScenarioId>('dashboard-filter');
  const [dataSize, setDataSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [parentChurn, setParentChurn] = useState<'low' | 'medium' | 'high'>('medium');

  const scenario = getComparisonScenario(scenarioId);
  const report = buildComparisonReport({ scenarioId, dataSize, parentChurn });

  return (
    <Panel className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {scenarioOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setScenarioId(option.id)}
                className={`chip ${scenarioId === option.id ? 'chip-active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="text-sm leading-6 text-slate-600">{scenario.blurb}</p>
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Data size
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDataSize(option.id)}
                  className={`chip ${dataSize === option.id ? 'chip-active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Parent churn
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {churnOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setParentChurn(option.id)}
                  className={`chip ${parentChurn === option.id ? 'chip-active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {report.map((item) => (
          <div
            key={item.id}
            className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{item.label}</h3>
              <StatusPill tone={compilerFitTone(item.compilerFit)}>
                {item.compilerFit}
              </StatusPill>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
            <div className="mt-4 grid gap-3">
              <MetricCard
                label="Expected rerenders"
                value={String(item.rerenders)}
                hint="Чем ниже число, тем меньше повторной работы в одном interaction path."
                tone={item.recommendation === 'recommended' ? 'accent' : 'default'}
              />
              <MetricCard
                label="Avg commit"
                value={`${item.avgCommitMs} ms`}
                hint="Синтетическая оценка commit cost для выбранного сценария."
                tone={item.recommendation === 'recommended' ? 'cool' : 'default'}
              />
              <MetricCard
                label="Code noise"
                value={codeNoiseLabel(item.codeNoise)}
                hint="Сколько incidental complexity стратегия тянет в кодовую базу."
                tone={item.recommendation === 'recommended' ? 'dark' : 'default'}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Manual memoization" code={scenario.manualSnippet} />
        <CodeBlock
          label="Compiler-friendly version"
          code={scenario.compilerReadySnippet}
        />
      </div>

      <ListBlock
        title="Когда ручная мемоизация всё ещё может остаться"
        items={scenario.manualMemoStillUseful}
      />
    </Panel>
  );
}
