import { useState } from 'react';

import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildTypeScriptPlaybook,
  type AppStage,
  type BugPattern,
  type TeamLevel,
} from '../../lib/typescript-playbook-model';

export function TypeScriptPlaybookLab() {
  const [appStage, setAppStage] = useState<AppStage>('new-feature');
  const [bugPattern, setBugPattern] = useState<BugPattern>('props-mismatch');
  const [teamLevel, setTeamLevel] = useState<TeamLevel>('working');

  const result = buildTypeScriptPlaybook({ appStage, bugPattern, teamLevel });

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="block font-medium">App stage</span>
          <select
            value={appStage}
            onChange={(event) => setAppStage(event.target.value as AppStage)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="new-feature">New feature</option>
            <option value="legacy-screen">Legacy screen</option>
            <option value="shared-ui">Shared UI</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="block font-medium">Bug pattern</span>
          <select
            value={bugPattern}
            onChange={(event) => setBugPattern(event.target.value as BugPattern)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="props-mismatch">Props mismatch</option>
            <option value="state-branching">State branching</option>
            <option value="dom-imperative">DOM imperative</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span className="block font-medium">Team level</span>
          <select
            value={teamLevel}
            onChange={(event) => setTeamLevel(event.target.value as TeamLevel)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <option value="starting">Starting</option>
            <option value="working">Working</option>
            <option value="confident">Confident</option>
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
          label="Current focus"
          value={bugPattern}
          hint="Источник ошибок влияет на то, с какого слоя типизации полезнее начинать."
          tone="accent"
        />
        <MetricCard
          label="Team posture"
          value={teamLevel}
          hint="Уровень команды определяет, нужен ли осторожный старт или уже можно расширять типизацию как часть архитектуры."
          tone="cool"
        />
      </div>

      <ListBlock title="Recommended steps" items={result.steps} />
    </Panel>
  );
}
