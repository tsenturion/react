import { useState } from 'react';

import {
  architectureScenarios,
  buildArchitectureMatrix,
  getArchitectureScenario,
  type ArchitectureScenarioId,
} from '../../lib/architecture-consequences-model';
import { MetricCard, Panel, StatusPill } from '../ui';

export function ArchitectureConsequencesLab() {
  const [scenarioId, setScenarioId] =
    useState<ArchitectureScenarioId>('commerce-listing');
  const scenario = getArchitectureScenario(scenarioId);
  const rows = buildArchitectureMatrix(scenarioId);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Project structure impact</span>
          <p className="text-sm leading-6 text-slate-600">
            Выбор режима рендеринга меняет не только стартовую скорость, но и кэш,
            серверный код, данные над fold и общий operational cost приложения.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {architectureScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScenarioId(item.id)}
              className={`chip ${scenarioId === item.id ? 'chip-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Сценарий"
          value={scenario.label}
          hint={scenario.summary}
          tone="default"
        />
        <MetricCard
          label="Рекомендуемый режим"
          value={scenario.recommendedMode.toUpperCase()}
          hint={scenario.why}
          tone="accent"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Архитектурный вывод
          </p>
          <div className="mt-3">
            <StatusPill tone="warn">
              Режим рендеринга выбирается по природе экрана, а не по желанию использовать
              больше server API
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{scenario.why}</p>
        </div>
      </div>

      <Panel className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm leading-6 text-slate-700">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
              <th className="px-4 py-3">Измерение</th>
              <th className="px-4 py-3">CSR</th>
              <th className="px-4 py-3">SSR</th>
              <th className="px-4 py-3">SSG</th>
              <th className="px-4 py-3">Streaming</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.dimension} className="border-b border-slate-100 align-top">
                <th className="px-4 py-4 font-semibold text-slate-900">
                  {row.dimension}
                </th>
                <td className="px-4 py-4">{row.csr}</td>
                <td className="px-4 py-4">{row.ssr}</td>
                <td className="px-4 py-4">{row.ssg}</td>
                <td className="px-4 py-4">{row.streaming}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
