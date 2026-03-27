import { useState } from 'react';

import {
  buildQualitySystemPlan,
  qualityEvidence,
  type CodebaseShape,
  type QualityGapId,
} from '../../lib/quality-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

const gapLabels: Record<QualityGapId, string> = {
  'no-devtools-habit': 'DevTools открываются только в emergency режиме',
  'lint-too-weak': 'Lint-конфиг покрывает только базовые hooks rules',
  'rules-ignored': 'Правила React часто обходятся отключением предупреждений',
  'no-profiler-thinking': 'Ререндеры не расследуются как cost/evidence problem',
  'tests-detached': 'Тесты не превращаются в guardrail после найденных багов',
};

export function QualityControlSystemLab() {
  const [shape, setShape] = useState<CodebaseShape>('growing');
  const [gaps, setGaps] = useState<QualityGapId[]>(['lint-too-weak', 'tests-detached']);

  const plan = buildQualitySystemPlan({ shape, gaps });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{plan.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Эта лаборатория показывает, что DevTools, lint, правила React и тесты
              начинают работать по-настоящему только как согласованная система.
            </p>
          </div>
          <StatusPill tone={plan.tone}>{shape}</StatusPill>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Codebase shape
          </p>
          <div className="flex flex-wrap gap-2">
            {(['small', 'growing', 'platform'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setShape(option);
                }}
                className={shape === option ? 'chip chip-active' : 'chip'}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Existing gaps
          </p>
          {(Object.entries(gapLabels) as [QualityGapId, string][]).map(([gap, label]) => {
            const checked = gaps.includes(gap);

            return (
              <label
                key={gap}
                className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setGaps((current) =>
                      checked
                        ? current.filter((entry) => entry !== gap)
                        : [...current, gap],
                    );
                  }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm leading-6 text-slate-700">{label}</span>
              </label>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Gaps"
            value={String(gaps.length)}
            hint="Чем больше несвязанных пробелов, тем слабее общий контур качества."
            tone="accent"
          />
          <MetricCard
            label="Phases"
            value={String(plan.phases.length)}
            hint="Наблюдение, предотвращение и закрепление должны быть связаны между собой."
            tone="cool"
          />
          <MetricCard
            label="System tone"
            value={plan.tone}
            hint="Это не про severity одного бага, а про зрелость всего engineering loop."
            tone="dark"
          />
        </div>

        <div className="space-y-4">
          {plan.phases.map((phase) => (
            <div
              key={phase.title}
              className="rounded-[24px] border border-slate-200 bg-white px-4 py-4"
            >
              <p className="text-sm font-semibold text-slate-900">{phase.title}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {phase.steps.map((step) => (
                  <li
                    key={step}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <ListBlock title="Evidence of a healthy toolchain" items={qualityEvidence} />
    </div>
  );
}
