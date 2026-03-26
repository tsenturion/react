import { useState } from 'react';

import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildCompilerPlaybook,
  type AdoptionRisk,
  type AppShape,
  type CompilerConfidence,
  type PerfPain,
} from '../../lib/compiler-playbook-model';

export function CompilerPlaybookLab() {
  const [appShape, setAppShape] = useState<AppShape>('dashboard');
  const [perfPain, setPerfPain] = useState<PerfPain>('recurring');
  const [compilerConfidence, setCompilerConfidence] =
    useState<CompilerConfidence>('medium');
  const [adoptionRisk, setAdoptionRisk] = useState<AdoptionRisk>('medium');

  const result = buildCompilerPlaybook({
    appShape,
    perfPain,
    compilerConfidence,
    adoptionRisk,
  });

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="block font-medium">App shape</span>
          <select
            value={appShape}
            onChange={(event) => setAppShape(event.target.value as AppShape)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="dashboard">Dashboard</option>
            <option value="content-studio">Content studio</option>
            <option value="canvas-tool">Canvas tool</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="block font-medium">Perf pain</span>
          <select
            value={perfPain}
            onChange={(event) => setPerfPain(event.target.value as PerfPain)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="localized">Localized</option>
            <option value="recurring">Recurring</option>
            <option value="systemic">Systemic</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="block font-medium">Compiler confidence</span>
          <select
            value={compilerConfidence}
            onChange={(event) =>
              setCompilerConfidence(event.target.value as CompilerConfidence)
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="block font-medium">Adoption risk</span>
          <select
            value={adoptionRisk}
            onChange={(event) => setAdoptionRisk(event.target.value as AdoptionRisk)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">{result.title}</h3>
          <StatusPill tone={result.tone}>{result.tone}</StatusPill>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{result.summary}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <MetricCard
          label="Current posture"
          value={appShape}
          hint="Форма продукта влияет на цену repeated render work и на характер rollout."
          tone="accent"
        />
        <MetricCard
          label="Risk profile"
          value={`${compilerConfidence} / ${adoptionRisk}`}
          hint="Сочетание уверенности команды и риска определяет скорость включения компилятора."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Следующие шаги" items={result.steps} />
        <ListBlock
          title="На что смотреть особенно внимательно"
          items={result.watchouts}
        />
      </div>
    </Panel>
  );
}
