import { useState } from 'react';

import {
  evaluateMemoizationNeed,
  type ChildBreadth,
  type ComputationCost,
  type LagSeverity,
} from '../../lib/memo-cost-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function MemoCostAdvisorLab() {
  const [lagSeverity, setLagSeverity] = useState<LagSeverity>('none');
  const [computationCost, setComputationCost] = useState<ComputationCost>('trivial');
  const [childBreadth, setChildBreadth] = useState<ChildBreadth>('single');
  const [unstableProps, setUnstableProps] = useState(false);
  const [dependencyRisk, setDependencyRisk] = useState(false);
  const [alreadyMeasured, setAlreadyMeasured] = useState(false);

  const verdict = evaluateMemoizationNeed({
    lagSeverity,
    computationCost,
    childBreadth,
    unstableProps,
    dependencyRisk,
    alreadyMeasured,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Lag severity"
          value={lagSeverity}
          hint="Мемоизация имеет смысл только рядом с измеренным или хотя бы заметным пользователю лагом."
          tone="accent"
        />
        <MetricCard
          label="Computation cost"
          value={computationCost}
          hint="Тривиальное вычисление редко окупает дополнительный слой зависимостей."
          tone="cool"
        />
        <MetricCard
          label="Verdict"
          value={verdict.verdict}
          hint={verdict.nextMove}
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Cost and trade-offs
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Мемоизация окупается только тогда, когда у неё есть измеренная задача
            </h2>
          </div>
          <StatusPill
            tone={
              verdict.verdict === 'Мемоизация выглядит оправданной'
                ? 'success'
                : verdict.verdict === 'Сначала измерьте и упростите входные данные'
                  ? 'warn'
                  : 'error'
            }
          >
            trade-off check
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Насколько заметен лаг
              </span>
              <select
                value={lagSeverity}
                onChange={(event) => setLagSeverity(event.target.value as LagSeverity)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="none">None</option>
                <option value="noticeable">Noticeable</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Цена вычисления или child subtree
              </span>
              <select
                value={computationCost}
                onChange={(event) =>
                  setComputationCost(event.target.value as ComputationCost)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="trivial">Trivial</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Насколько широк downstream tree
              </span>
              <select
                value={childBreadth}
                onChange={(event) => setChildBreadth(event.target.value as ChildBreadth)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="single">Single child</option>
                <option value="section">Section</option>
                <option value="list">List</option>
              </select>
            </label>
          </div>

          <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white p-5">
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={unstableProps}
                onChange={(event) => setUnstableProps(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                В дереве есть нестабильные object props или callbacks
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={dependencyRisk}
                onChange={(event) => setDependencyRisk(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Есть риск сложных dependencies и stale bugs
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={alreadyMeasured}
                onChange={(event) => setAlreadyMeasured(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Проблема уже измерена, а не только ощущается
              </span>
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Следующий ход" items={[verdict.nextMove]} />
        </Panel>
        <Panel>
          <ListBlock title="Что легко сделать зря" items={verdict.antiPatterns} />
        </Panel>
      </div>
    </div>
  );
}
