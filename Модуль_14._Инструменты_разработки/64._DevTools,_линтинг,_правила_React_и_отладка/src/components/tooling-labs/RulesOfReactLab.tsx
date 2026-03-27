import { useState } from 'react';

import {
  analyzeRulePressure,
  reactRuleCatalog,
  rulesTakeaways,
  type ReactRuleId,
} from '../../lib/rules-of-react-model';
import { BeforeAfter, CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function RulesOfReactLab() {
  const [activeRules, setActiveRules] = useState<ReactRuleId[]>([
    'conditional-hook',
    'ref-read-render',
  ]);

  const analysis = analyzeRulePressure(activeRules);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{analysis.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{analysis.copy}</p>
          </div>
          <StatusPill tone={analysis.tone}>{analysis.hotZone}</StatusPill>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Active violations"
            value={String(activeRules.length)}
            hint="Количество rules-pressure сигналов в текущем компонентном фрагменте."
            tone="accent"
          />
          <MetricCard
            label="Hot zone"
            value={analysis.hotZone}
            hint="Главная зона риска: порядок хуков, purity рендера или архитектурная хрупкость."
            tone="cool"
          />
          <MetricCard
            label="Lint posture"
            value={
              analysis.tone === 'error'
                ? 'fail-fast'
                : analysis.tone === 'warn'
                  ? 'review'
                  : 'healthy'
            }
            hint="Так rule-set переводится в решение команды: чинить сейчас, пересобрать структуру или оставить как есть."
            tone="dark"
          />
        </div>

        <div className="space-y-3">
          {reactRuleCatalog.map((rule) => {
            const checked = activeRules.includes(rule.id);

            return (
              <label
                key={rule.id}
                className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-4"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setActiveRules((current) =>
                      checked
                        ? current.filter((entry) => entry !== rule.id)
                        : [...current, rule.id],
                    );
                  }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{rule.title}</p>
                    <code className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
                      {rule.lintRule}
                    </code>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {rule.runtimeSymptom}
                  </p>
                  <p className="text-sm leading-6 text-slate-500">{rule.whyItMatters}</p>
                </div>
              </label>
            );
          })}
        </div>
      </Panel>

      <div className="space-y-6">
        <BeforeAfter
          beforeTitle="Fragile component shape"
          before="Фабрики компонентов, чтение ref в render и условные hooks могут выглядеть как локальные удобства, но делают дерево плохо анализируемым."
          afterTitle="Rule-friendly component shape"
          after="Стабильные component boundaries, hooks top-level и render, который опирается только на props/state/context, оставляют код предсказуемым и для React, и для tooling."
        />
        <CodeBlock
          label="bad vs good"
          code={`// bad
if (enabled) {
  const value = useMemo(() => compute(), [enabled]);
}

// good
const value = useMemo(() => (enabled ? compute() : fallback), [enabled]);`}
        />
        <ListBlock title="Rules takeaways" items={rulesTakeaways} />
      </div>
    </div>
  );
}
