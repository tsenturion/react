import clsx from 'clsx';
import { useState } from 'react';

import {
  evaluateLintDiscipline,
  lintIssueCatalog,
  type DisciplineMode,
  type LintIssueId,
} from '../../lib/lint-discipline-model';
import type { RulePreset } from '../../lib/rule-store';
import { MetricCard, StatusPill } from '../ui';

export function LintDisciplineLab() {
  const [preset, setPreset] = useState<RulePreset>('recommended-latest');
  const [mode, setMode] = useState<DisciplineMode>('lint-first');
  const [issues, setIssues] = useState<LintIssueId[]>([
    'hook-in-condition',
    'missing-dependency',
    'ref-mutation-in-render',
  ]);

  const evaluation = evaluateLintDiscipline(preset, mode, issues);

  function toggleIssue(issueId: LintIssueId) {
    setIssues((current) =>
      current.includes(issueId)
        ? current.filter((item) => item !== issueId)
        : [...current, issueId],
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Preset lint-правил
          </p>
          <div className="mt-4 flex gap-2">
            {(['recommended', 'recommended-latest'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPreset(item)}
                className={clsx(
                  'rounded-xl px-3 py-2 text-sm font-medium transition',
                  preset === item
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Дисциплина
          </p>
          <div className="mt-3 grid gap-2">
            {(
              [
                ['review-only', 'Только review'],
                ['lint-first', 'Lint на каждом изменении'],
                ['ci-gate', 'CI gate'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={clsx(
                  'rounded-xl px-3 py-3 text-left text-sm transition',
                  mode === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Проблемы в коде
          </p>
          <div className="mt-4 space-y-3">
            {lintIssueCatalog.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => toggleIssue(issue.id)}
                className={clsx(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                  issues.includes(issue.id)
                    ? 'border-amber-300 bg-amber-50 text-amber-950'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300',
                )}
              >
                <span>
                  <span className="block text-sm font-medium">{issue.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {issue.rule}
                  </span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  {issues.includes(issue.id) ? 'есть' : 'нет'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Активных правил"
            value={String(evaluation.activeRules.length)}
            hint="Количество guardrail-правил зависит от выбранного preset."
          />
          <MetricCard
            label="Поймано"
            value={String(evaluation.blocked.length)}
            hint="Эти проблемы автоматический lint останавливает до ручного review."
            tone="cool"
          />
          <MetricCard
            label="Проскальзывает"
            value={String(evaluation.slips.length)}
            hint="Эти случаи всё ещё могут уйти дальше по pipeline."
            tone={evaluation.slips.length > 0 ? 'accent' : 'default'}
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                {evaluation.headline}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Здесь видно, что rules React полезны не как формальная галочка, а как
                ограничения, которые рано блокируют неочевидные поломки предсказуемости.
              </p>
            </div>
            <StatusPill tone={evaluation.tone}>{evaluation.tone}</StatusPill>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">
              Активные правила preset-а
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {evaluation.activeRules.map((rule) => (
                <li
                  key={rule}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">
              Проблемы, которые ещё проходят
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {evaluation.slips.length > 0 ? (
                evaluation.slips.map((issueId) => {
                  const issue = lintIssueCatalog.find((item) => item.id === issueId);
                  return (
                    <li
                      key={issueId}
                      className="rounded-xl border border-rose-200 bg-white px-4 py-3"
                    >
                      <span className="block font-medium">{issue?.label}</span>
                      <span className="mt-1 block text-slate-500">{issue?.why}</span>
                    </li>
                  );
                })
              ) : (
                <li className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-900">
                  Выбранный preset и дисциплина перекрывают текущий набор проблем.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
