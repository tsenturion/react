import { useMemo, useState } from 'react';

import {
  lintFindingCatalog,
  lintTakeaways,
  summarizeLintFindings,
  type LintConfigMode,
  type LintFindingId,
} from '../../lib/lint-rule-model';
import { BeforeAfter, CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function LintRulesLab() {
  const [mode, setMode] = useState<LintConfigMode>('baseline');
  const [activeFindings, setActiveFindings] = useState<LintFindingId[]>([
    'exhaustive-deps',
    'set-state-in-render',
    'purity',
  ]);

  const summary = summarizeLintFindings(activeFindings, mode);

  const visibleFindings = useMemo(
    () =>
      lintFindingCatalog.filter(
        (item) =>
          activeFindings.includes(item.id) && (mode === 'strict' || item.baseline),
      ),
    [activeFindings, mode],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{summary.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{summary.copy}</p>
          </div>
          <StatusPill tone={summary.tone}>
            {mode === 'strict' ? 'Strict profile' : 'Baseline profile'}
          </StatusPill>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['baseline', 'strict'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setMode(option);
              }}
              className={mode === option ? 'chip chip-active' : 'chip'}
            >
              {option === 'baseline' ? 'Baseline hooks lint' : 'Strict architecture lint'}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Visible findings"
            value={String(summary.total)}
            hint="Сколько проблем реально сигнализирует текущий конфиг."
            tone="accent"
          />
          <MetricCard
            label="Baseline coverage"
            value={String(summary.baselineVisible)}
            hint="Ошибки, которые уже видно даже в минимальном hooks-профиле."
            tone="cool"
          />
          <MetricCard
            label="Strict-only findings"
            value={String(summary.strictVisible)}
            hint="Дополнительные сигналы про purity, refs и анализируемость архитектуры."
            tone="dark"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Findings to simulate
            </p>
            {lintFindingCatalog.map((item) => {
              const checked = activeFindings.includes(item.id);

              return (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setActiveFindings((current) =>
                        checked
                          ? current.filter((entry) => entry !== item.id)
                          : [...current, item.id],
                      );
                    }}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm leading-6 text-slate-600">{item.summary}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {item.bucket} · {item.baseline ? 'baseline' : 'strict-only'}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Visible under current config
            </p>
            <div className="space-y-3">
              {visibleFindings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-slate-200 bg-white px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.whyItHurts}
                      </p>
                    </div>
                    <StatusPill tone={item.baseline ? 'error' : 'warn'}>
                      {item.baseline ? 'Baseline' : 'Strict'}
                    </StatusPill>
                  </div>
                </div>
              ))}
              {visibleFindings.length === 0 ? (
                <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-950">
                  Текущий набор smells не даёт finding-ов. Это хороший момент, чтобы
                  читать lint как guardrail, а не как обязательную красную лампу.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Panel>

      <div className="space-y-6">
        <BeforeAfter
          beforeTitle="Weak lint mindset"
          before="Линтер рассматривается как форматтер с предупреждениями, которые можно отключить без анализа."
          afterTitle="Guardrail mindset"
          after="Каждое lint-замечание читается как инженерный сигнал: какой инвариант React-модели здесь нарушается?"
        />
        <CodeBlock
          label="eslint profile"
          code={`const reactHooksRecommendedLatestRules =
  reactHooks.configs.flat?.['recommended-latest']?.rules ??
  reactHooks.configs['recommended-latest'].rules;`}
        />
        <ListBlock title="Lint takeaways" items={lintTakeaways} />
      </div>
    </div>
  );
}
