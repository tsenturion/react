import { useState } from 'react';

import { ListBlock, MetricCard, StatusPill } from '../ui';
import {
  buildExternalDataRecommendation,
  type DataSource,
  type FailureMode,
  type TeamDiscipline,
} from '../../lib/external-data-playbook-model';

const sourceOptions: readonly { id: DataSource; label: string }[] = [
  { id: 'public-api', label: 'Public API' },
  { id: 'internal-api', label: 'Internal API' },
  { id: 'form-data', label: 'FormData' },
  { id: 'route-loader', label: 'Route loader' },
  { id: 'server-function', label: 'Server function' },
] as const;

const failureOptions: readonly { id: FailureMode; label: string }[] = [
  { id: 'silent-shape-drift', label: 'Shape drift' },
  { id: 'mixed-nullability', label: 'Nullability drift' },
  { id: 'partial-mutations', label: 'Partial mutations' },
  { id: 'date-fields', label: 'Date fields' },
] as const;

const teamOptions: readonly { id: TeamDiscipline; label: string }[] = [
  { id: 'starting', label: 'Starting' },
  { id: 'confident', label: 'Confident' },
  { id: 'advanced', label: 'Advanced' },
] as const;

export function ExternalDataPlaybookLab() {
  const [source, setSource] = useState<DataSource>('public-api');
  const [failureMode, setFailureMode] = useState<FailureMode>('silent-shape-drift');
  const [team, setTeam] = useState<TeamDiscipline>('starting');
  const recommendation = buildExternalDataRecommendation({
    source,
    failureMode,
    team,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Data source
          </p>
          <div className="flex flex-wrap gap-2">
            {sourceOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSource(item.id)}
                className={`chip ${source === item.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Failure mode
          </p>
          <div className="flex flex-wrap gap-2">
            {failureOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFailureMode(item.id)}
                className={`chip ${failureMode === item.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Team discipline
          </p>
          <div className="flex flex-wrap gap-2">
            {teamOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTeam(item.id)}
                className={`chip ${team === item.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Source"
          value={source}
          hint="Тип boundary влияет на место, где schema приносит максимальную пользу."
          tone="accent"
        />
        <MetricCard
          label="Failure"
          value={failureMode}
          hint="У разных failure patterns разная оптимальная стратегия parse."
          tone="cool"
        />
        <MetricCard
          label="Team"
          value={team}
          hint="Глубина rollout зависит не только от проблемы, но и от зрелости проекта."
          tone="dark"
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{recommendation.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {recommendation.summary}
            </p>
          </div>
          <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <ListBlock title="Next steps" items={recommendation.steps} />
          <ListBlock title="Watch outs" items={recommendation.warnings} />
        </div>
      </div>
    </div>
  );
}
