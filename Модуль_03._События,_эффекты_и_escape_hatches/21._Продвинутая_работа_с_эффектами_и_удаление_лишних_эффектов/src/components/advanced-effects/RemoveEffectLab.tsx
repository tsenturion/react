import { useEffect, useRef, useState } from 'react';

import {
  buildWorkshopSummary,
  filterWorkshopModules,
  type WorkshopLevel,
} from '../../lib/advanced-effect-domain';
import { hasDrift } from '../../lib/remove-effect-model';
import { Panel, StatusPill } from '../ui';

type Controls = {
  query: string;
  level: WorkshopLevel | 'all';
  omitLevelDependency: boolean;
};

function MirroredStatePreview({ query, level, omitLevelDependency }: Controls) {
  const [visibleModules, setVisibleModules] = useState(() =>
    filterWorkshopModules(query, level),
  );
  const [summary, setSummary] = useState(() => buildWorkshopSummary(visibleModules));
  const [filterEffectRuns, setFilterEffectRuns] = useState(0);
  const [summaryEffectRuns, setSummaryEffectRuns] = useState(0);
  const lastSyncedLevelRef = useRef<WorkshopLevel | 'all'>(level);

  useEffect(() => {
    if (omitLevelDependency) {
      return;
    }

    lastSyncedLevelRef.current = level;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilterEffectRuns((current) => current + 1);
    setVisibleModules(filterWorkshopModules(query, level));
  }, [level, omitLevelDependency, query]);

  useEffect(() => {
    if (!omitLevelDependency) {
      return;
    }

    // Здесь намеренно "забывается" level. Effect пересчитывается только по query,
    // поэтому UI может застрять на старой level-секции и уйти в drift.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilterEffectRuns((current) => current + 1);
    setVisibleModules(filterWorkshopModules(query, lastSyncedLevelRef.current));
  }, [omitLevelDependency, query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSummaryEffectRuns((current) => current + 1);
    setSummary(buildWorkshopSummary(visibleModules));
  }, [visibleModules]);

  const expectedModules = filterWorkshopModules(query, level);
  const drift = hasDrift(
    visibleModules.map((item) => item.id),
    expectedModules.map((item) => item.id),
  );

  return (
    <div className="rounded-[24px] border border-rose-300/40 bg-rose-50/70 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={drift ? 'error' : 'warn'}>
          {drift ? 'drift' : 'mirrored'}
        </StatusPill>
        <span className="text-sm text-rose-900">
          Filter effect: {filterEffectRuns}, summary effect: {summaryEffectRuns}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-rose-950">{summary}</p>

      <div className="mt-4 space-y-2">
        {visibleModules.map((module) => (
          <div
            key={module.id}
            className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
          >
            <strong>{module.title}</strong> · {module.level}
          </div>
        ))}
      </div>
    </div>
  );
}

function DerivedStatePreview({ query, level }: Omit<Controls, 'omitLevelDependency'>) {
  const visibleModules = filterWorkshopModules(query, level);
  const summary = buildWorkshopSummary(visibleModules);

  return (
    <div className="rounded-[24px] border border-emerald-300/40 bg-emerald-50/80 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">derived</StatusPill>
        <span className="text-sm text-emerald-900">
          Нет effect-ов для списка и summary: только текущий render.
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-emerald-950">{summary}</p>

      <div className="mt-4 space-y-2">
        {visibleModules.map((module) => (
          <div
            key={module.id}
            className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
          >
            <strong>{module.title}</strong> · {module.level}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RemoveEffectLab() {
  const [query, setQuery] = useState('effect');
  const [level, setLevel] = useState<WorkshopLevel | 'all'>('all');
  const [omitLevelDependency, setOmitLevelDependency] = useState(false);

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Query</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Level</span>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as WorkshopLevel | 'all')}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="all">all</option>
            <option value="base">base</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="checkbox"
          checked={omitLevelDependency}
          onChange={(event) => setOmitLevelDependency(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm leading-6 text-slate-700">
          Намеренно пропустить `level` в mirrored-варианте. Так видно, как лишний effect
          сразу превращается в источник drift при неправильной dependency-модели.
        </span>
      </label>

      <div className="grid gap-4 xl:grid-cols-2">
        <MirroredStatePreview
          query={query}
          level={level}
          omitLevelDependency={omitLevelDependency}
        />
        <DerivedStatePreview query={query} level={level} />
      </div>
    </Panel>
  );
}
