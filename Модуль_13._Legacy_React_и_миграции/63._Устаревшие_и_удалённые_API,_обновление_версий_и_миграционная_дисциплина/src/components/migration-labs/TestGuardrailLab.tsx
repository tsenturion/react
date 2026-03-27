import { useMemo, useState } from 'react';

import {
  evaluateTestGuardrails,
  guardrailRules,
  migrationRiskCards,
  type MigrationRiskId,
  type TestLayer,
} from '../../lib/test-guardrail-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function TestGuardrailLab() {
  const [selectedLayers, setSelectedLayers] = useState<TestLayer[]>([
    'component',
    'integration',
  ]);
  const [selectedRisks, setSelectedRisks] = useState<MigrationRiskId[]>([
    'root-bootstrap',
    'refs-focus',
    'forms-submit',
  ]);

  const evaluation = useMemo(
    () => evaluateTestGuardrails(selectedLayers, selectedRisks),
    [selectedLayers, selectedRisks],
  );

  const toggleLayer = (layer: TestLayer) => {
    setSelectedLayers((current) =>
      current.includes(layer)
        ? current.filter((item) => item !== layer)
        : [...current, layer],
    );
  };

  const toggleRisk = (risk: MigrationRiskId) => {
    setSelectedRisks((current) =>
      current.includes(risk)
        ? current.filter((item) => item !== risk)
        : [...current, risk],
    );
  };

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <StatusPill tone={evaluation.tone}>Guardrail coverage</StatusPill>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Выберите, какие слои тестов реально есть в проекте, и какие migration risks
              вы собираетесь изменять. Так видно, закрывает ли suite реальное поведение, а
              не только прошлые implementation details.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['unit', 'component', 'integration', 'e2e'] as const).map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => toggleLayer(layer)}
                className={`chip ${selectedLayers.includes(layer) ? 'chip-active' : ''}`}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <MetricCard
            label="Covered risks"
            value={String(evaluation.coveredCount)}
            hint="Число migration-sensitive зон, которые прикрыты хотя бы одним релевантным слоем тестов."
          />
          <MetricCard
            label="Missed risks"
            value={String(evaluation.missedCount)}
            hint="Эти зоны пока останутся почти без доказательства поведения."
            tone={evaluation.tone === 'error' ? 'accent' : 'cool'}
          />
          <MetricCard
            label="Active layers"
            value={selectedLayers.join(', ') || 'none'}
            hint="Состав тестового барьера влияет не меньше, чем сам список рисков."
            tone="dark"
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{evaluation.title}</h3>
            <StatusPill tone={evaluation.tone}>{evaluation.tone}</StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{evaluation.summary}</p>
        </div>
      </Panel>

      <Panel className="grid gap-4 xl:grid-cols-2">
        {migrationRiskCards.map((risk) => {
          const selected = selectedRisks.includes(risk.id);

          return (
            <button
              key={risk.id}
              type="button"
              onClick={() => toggleRisk(risk.id)}
              className={`rounded-[24px] border p-5 text-left transition ${
                selected
                  ? 'border-rose-300 bg-rose-50/70 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{risk.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {risk.coveredBy.join(', ')}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{risk.note}</p>
            </button>
          );
        })}
      </Panel>

      <Panel className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Missing coverage
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {evaluation.missing.length === 0 ? (
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Для выбранных risks слепых участков сейчас не видно.
              </li>
            ) : (
              evaluation.missing.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {item}
                </li>
              ))
            )}
          </ul>
        </div>

        <ListBlock title="Guardrail rules" items={guardrailRules} />
      </Panel>
    </div>
  );
}
