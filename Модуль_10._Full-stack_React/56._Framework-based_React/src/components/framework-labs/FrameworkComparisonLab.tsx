'use client';

import { useState } from 'react';

import {
  compareFrameworkSuitability,
  frameworkProfiles,
  type FrameworkId,
} from '../../lib/framework-comparison-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type ToggleId =
  | 'needsSsr'
  | 'needsServerMutations'
  | 'wantsFileRoutes'
  | 'wantsStrongConventions'
  | 'caresAboutPprDirection'
  | 'prefersIncrementalAdoption';

type ToggleState = Record<ToggleId, boolean>;

const defaultState: ToggleState = {
  needsSsr: true,
  needsServerMutations: true,
  wantsFileRoutes: true,
  wantsStrongConventions: false,
  caresAboutPprDirection: true,
  prefersIncrementalAdoption: false,
};

const toggleLabels: Record<ToggleId, string> = {
  needsSsr: 'Нужен SSR',
  needsServerMutations: 'Нужны серверные мутации',
  wantsFileRoutes: 'Нужны file routes / route modules',
  wantsStrongConventions: 'Команда хочет сильные conventions',
  caresAboutPprDirection: 'Важна story вокруг partial prerendering',
  prefersIncrementalAdoption: 'Важно внедрять framework постепенно',
};

export function FrameworkComparisonLab() {
  const [teamSize, setTeamSize] = useState(6);
  const [state, setState] = useState<ToggleState>(defaultState);
  const reports = compareFrameworkSuitability({
    ...state,
    teamSize,
  });
  const leader = reports[0];

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Framework chooser</span>
          <p className="text-sm leading-6 text-slate-600">
            Меняйте свойства продукта и смотрите, когда полноценный framework приносит
            реальный выигрыш, а когда DIY-подход ещё не стал архитектурной проблемой.
          </p>
        </div>

        <label className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Team size: {teamSize}
          </span>
          <input
            className="mt-4 w-full"
            type="range"
            min={2}
            max={12}
            step={1}
            value={teamSize}
            onChange={(event) => setTeamSize(Number(event.target.value))}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(toggleLabels) as ToggleId[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  [key]: !current[key],
                }))
              }
              className={`rounded-[24px] border px-4 py-4 text-left transition ${
                state[key]
                  ? 'border-sky-500 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold">{toggleLabels[key]}</span>
              <span className="mt-2 block text-sm leading-6 opacity-80">
                {state[key] ? 'Да' : 'Нет'}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Leader"
          value={leader.label}
          hint="Текущий лучший match по набору требований."
          tone="accent"
        />
        <MetricCard
          label="Leader score"
          value={String(leader.score)}
          hint="Чем выше, тем лучше framework ложится на текущую задачу."
          tone="cool"
        />
        <MetricCard
          label="Infra burden"
          value={String(leader.defaultInfraBurden)}
          hint="Сколько ручной инфраструктуры framework оставляет на вас по умолчанию."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {(Object.keys(frameworkProfiles) as FrameworkId[]).map((id) => {
          const report = reports.find((item) => item.id === id) ?? reports[0];

          return (
            <div
              key={id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{report.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Score: {report.score}
                  </p>
                </div>
                <StatusPill
                  tone={
                    report.id === leader.id
                      ? 'success'
                      : report.score >= leader.score - 1
                        ? 'warn'
                        : 'error'
                  }
                >
                  {report.id === leader.id
                    ? 'Лучший fit'
                    : report.id === 'vite-diy'
                      ? 'DIY'
                      : 'Alt'}
                </StatusPill>
              </div>

              <div className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                <p>{report.routingModel}</p>
                <p>{report.dataLoading}</p>
                <p>{report.renderingStory}</p>
              </div>

              <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Strongest fit
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {report.strongestFit}
                </p>
              </div>

              <div className="mt-4">
                <ListBlock title="Почему подходит" items={report.reasons.slice(0, 4)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
