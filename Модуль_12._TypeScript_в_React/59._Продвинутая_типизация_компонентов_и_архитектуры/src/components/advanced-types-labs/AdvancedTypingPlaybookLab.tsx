import { useMemo, useState } from 'react';

import { ListBlock, MetricCard, StatusPill } from '../ui';
import {
  buildTypingRecommendation,
  rolloutScopes,
  teamMaturities,
  typingPains,
  type RolloutScope,
  type TeamMaturity,
  type TypingPain,
} from '../../lib/advanced-typing-playbook-model';

const painLabels: Record<TypingPain, string> = {
  'state-machine': 'State machine',
  'generic-reusable': 'Reusable API',
  'polymorphic-primitive': 'Polymorphic primitive',
  'design-system': 'Design system',
  'mixed-boundaries': 'Mixed boundaries',
};

const teamLabels: Record<TeamMaturity, string> = {
  starting: 'Starting',
  confident: 'Confident',
  advanced: 'Advanced',
};

const scopeLabels: Record<RolloutScope, string> = {
  'one-feature': 'One feature',
  'shared-layer': 'Shared layer',
  'system-wide': 'System-wide',
};

export function AdvancedTypingPlaybookLab() {
  const [pain, setPain] = useState<TypingPain>('state-machine');
  const [team, setTeam] = useState<TeamMaturity>('confident');
  const [scope, setScope] = useState<RolloutScope>('one-feature');
  const [ownsDesignSystem, setOwnsDesignSystem] = useState(false);

  const recommendation = useMemo(
    () =>
      buildTypingRecommendation({
        pain,
        team,
        scope,
        ownsDesignSystem,
      }),
    [ownsDesignSystem, pain, scope, team],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pain point
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {typingPains.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPain(item)}
                className={`chip ${pain === item ? 'chip-active' : ''}`}
              >
                {painLabels[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Team maturity
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {teamMaturities.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTeam(item)}
                className={`chip ${team === item ? 'chip-active' : ''}`}
              >
                {teamLabels[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Rollout scope
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {rolloutScopes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setScope(item)}
                className={`chip ${scope === item ? 'chip-active' : ''}`}
              >
                {scopeLabels[item]}
              </button>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={ownsDesignSystem}
              onChange={(event) => setOwnsDesignSystem(event.currentTarget.checked)}
            />
            Команда владеет shared design-system layer
          </label>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Recommendation
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {recommendation.title}
              </h3>
            </div>
            <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {recommendation.summary}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <ListBlock title="Next steps" items={recommendation.nextSteps} />
            <ListBlock title="Watchouts" items={recommendation.watchouts} />
          </div>
        </div>

        <div className="space-y-4">
          <MetricCard
            label="Pain"
            value={painLabels[pain]}
            hint="Rollout должен следовать за дорогой ошибкой, а не за желанием “типизировать всё”."
            tone="accent"
          />
          <MetricCard
            label="Team + scope"
            value={`${teamLabels[team]} / ${scopeLabels[scope]}`}
            hint="Одинаковая abstraction полезна по-разному на уровне feature и shared library."
            tone="cool"
          />
          <MetricCard
            label="Shared layer"
            value={ownsDesignSystem ? 'owned' : 'not owned'}
            hint="Design-system typing окупается сильнее, если команда отвечает за primitives и tokens."
            tone="dark"
          />
        </div>
      </div>
    </div>
  );
}
