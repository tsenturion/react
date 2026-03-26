import { useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildRolloutPlan,
  projectCompilerSetup,
  type BuildTool,
  type CompilationMode,
  type LibraryRisk,
  type PerfPain,
  type TeamReadiness,
} from '../../lib/compiler-rollout-model';

const buildToolOptions: readonly { id: BuildTool; label: string }[] = [
  { id: 'vite', label: 'Vite SPA' },
  { id: 'next', label: 'Next.js app' },
  { id: 'mixed-monorepo', label: 'Mixed monorepo' },
] as const;

const modeOptions: readonly { id: CompilationMode; label: string }[] = [
  { id: 'infer', label: 'Infer' },
  { id: 'annotation', label: 'Annotation' },
  { id: 'all', label: 'All' },
] as const;

export function ConfigurationRolloutLab() {
  const [buildTool, setBuildTool] = useState<BuildTool>('vite');
  const [compilationMode, setCompilationMode] = useState<CompilationMode>('infer');
  const [teamReadiness, setTeamReadiness] = useState<TeamReadiness>('partial');
  const [libraryRisk, setLibraryRisk] = useState<LibraryRisk>('medium');
  const [perfPain, setPerfPain] = useState<PerfPain>('medium');

  const plan = buildRolloutPlan({
    buildTool,
    compilationMode,
    teamReadiness,
    libraryRisk,
    perfPain,
  });

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Build surface
          </p>
          <div className="flex flex-wrap gap-2">
            {buildToolOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBuildTool(option.id)}
                className={`chip ${buildTool === option.id ? 'chip-active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Compilation mode
          </p>
          <div className="flex flex-wrap gap-2">
            {modeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setCompilationMode(option.id)}
                className={`chip ${compilationMode === option.id ? 'chip-active' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="block font-medium">Team readiness</span>
              <select
                value={teamReadiness}
                onChange={(event) =>
                  setTeamReadiness(event.target.value as TeamReadiness)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <option value="exploring">Exploring</option>
                <option value="partial">Partial</option>
                <option value="broad">Broad</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="block font-medium">Library risk</span>
              <select
                value={libraryRisk}
                onChange={(event) => setLibraryRisk(event.target.value as LibraryRisk)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span className="block font-medium">Perf pain</span>
              <select
                value={perfPain}
                onChange={(event) => setPerfPain(event.target.value as PerfPain)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
            <StatusPill tone={plan.rolloutTone}>{plan.rolloutTone}</StatusPill>
          </div>
          <MetricCard
            label="First surface"
            value={buildTool}
            hint={plan.firstSurface}
            tone="accent"
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-800">Файлы текущего проекта</p>
            <p className="mt-2">
              Реальная настройка урока живёт в `{projectCompilerSetup.viteConfigPath}` и `
              {projectCompilerSetup.eslintConfigPath}`.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Compiler config snippet" code={plan.compilerConfigSnippet} />
        <CodeBlock label="Lint preset snippet" code={plan.lintSnippet} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Rollout steps" items={plan.steps} />
        <ListBlock title="Риски и ограничения" items={plan.risks} />
      </div>
    </Panel>
  );
}
