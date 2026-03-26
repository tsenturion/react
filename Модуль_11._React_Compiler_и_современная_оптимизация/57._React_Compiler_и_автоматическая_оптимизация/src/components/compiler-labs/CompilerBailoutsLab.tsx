import { useState } from 'react';

import { CodeBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  getLimitationCase,
  listLimitationCases,
  type LimitationId,
} from '../../lib/compiler-limitations-model';

function toneForLevel(
  level: 'none' | 'partial' | 'strong',
): 'success' | 'warn' | 'error' {
  return level === 'strong' ? 'success' : level === 'partial' ? 'warn' : 'error';
}

export function CompilerBailoutsLab() {
  const [caseId, setCaseId] = useState<LimitationId>('impure-render');
  const current = getLimitationCase(caseId);
  const cases = listLimitationCases();

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {cases.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCaseId(item.id)}
            className={`chip ${caseId === item.id ? 'chip-active' : ''}`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{current.title}</h3>
            <StatusPill tone={toneForLevel(current.helpLevel)}>
              compiler help: {current.helpLevel}
            </StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {current.compilerOutcome}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MetricCard
              label="Почему это проблема"
              value="Bailout"
              hint={current.why}
              tone="default"
            />
            <MetricCard
              label="Что исправлять"
              value="Refactor"
              hint={current.fix}
              tone="accent"
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Practical rule
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Сначала исправляйте purity и data model. Только потом оценивайте, нужен ли
            compiler workaround, manual memoization или boundary adapter для внешней
            библиотеки.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Before" code={current.beforeSnippet} />
        <CodeBlock label="After" code={current.afterSnippet} />
      </div>
    </Panel>
  );
}
