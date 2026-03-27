import { useState } from 'react';

import {
  evaluateSplitStrategy,
  type FallbackScope,
  type PayloadWeight,
  type SplitTarget,
  type VisitFrequency,
} from '../../lib/split-strategy-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function SplitStrategyAdvisorLab() {
  const [target, setTarget] = useState<SplitTarget>('analytics');
  const [payloadWeight, setPayloadWeight] = useState<PayloadWeight>('heavy');
  const [visitFrequency, setVisitFrequency] = useState<VisitFrequency>('rare');
  const [fallbackScope, setFallbackScope] = useState<FallbackScope>('local');
  const [needsInstantPaint, setNeedsInstantPaint] = useState(false);
  const [hasStablePlaceholder, setHasStablePlaceholder] = useState(true);

  const verdict = evaluateSplitStrategy({
    target,
    payloadWeight,
    visitFrequency,
    fallbackScope,
    needsInstantPaint,
    hasStablePlaceholder,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Verdict"
          value={verdict.verdict}
          hint={verdict.guidance}
          tone="accent"
        />
        <MetricCard
          label="Target"
          value={target}
          hint="Разделение route, modal, analytics и tiny-control даёт разную архитектурную отдачу."
          tone="cool"
        />
        <MetricCard
          label="Fallback scope"
          value={fallbackScope}
          hint="Ширина fallback часто решает больше, чем сам факт отдельного chunk."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Split strategy advisor
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Code splitting полезен только тогда, когда его границы совпадают со
              сценарием использования
            </h2>
          </div>
          <StatusPill
            tone={
              verdict.verdict === 'Split выглядит оправданным'
                ? 'success'
                : verdict.verdict === 'Split возможен, но требует аккуратной границы'
                  ? 'warn'
                  : 'error'
            }
          >
            {verdict.verdict}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Split target</span>
              <select
                aria-label="Split target"
                value={target}
                onChange={(event) => setTarget(event.target.value as SplitTarget)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="route">Route</option>
                <option value="modal">Modal</option>
                <option value="analytics">Analytics</option>
                <option value="tiny-control">Tiny control</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Payload weight</span>
              <select
                aria-label="Payload weight"
                value={payloadWeight}
                onChange={(event) =>
                  setPayloadWeight(event.target.value as PayloadWeight)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Visit frequency</span>
              <select
                aria-label="Visit frequency"
                value={visitFrequency}
                onChange={(event) =>
                  setVisitFrequency(event.target.value as VisitFrequency)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="rare">Rare</option>
                <option value="sessional">Sessional</option>
                <option value="always">Always</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Fallback scope</span>
              <select
                aria-label="Fallback scope"
                value={fallbackScope}
                onChange={(event) =>
                  setFallbackScope(event.target.value as FallbackScope)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="local">Local</option>
                <option value="page">Page</option>
                <option value="global">Global</option>
              </select>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={needsInstantPaint}
                onChange={(event) => setNeedsInstantPaint(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Блок нужен в первом кадре экрана
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={hasStablePlaceholder}
                onChange={(event) => setHasStablePlaceholder(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Для блока можно показать стабильный placeholder
              </span>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">Итог</p>
              <p className="text-sm leading-6 text-cyan-950/80">{verdict.guidance}</p>
            </Panel>
            <ListBlock title="Риски и проверки" items={verdict.risks} />
          </div>
        </div>
      </Panel>
    </div>
  );
}
