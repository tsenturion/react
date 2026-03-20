import clsx from 'clsx';
import { useState } from 'react';

import { effectScenarios } from '../../lib/effect-domain';
import { buildEffectNeedReport, derivePreviewLabel } from '../../lib/effect-need-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

const tracks = ['UI architecture', 'Effects', 'Data fetching'] as const;

export function NeedEffectLab() {
  const [scenario, setScenario] =
    useState<(typeof effectScenarios)[number]['id']>('derived-value');
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');
  const [track, setTrack] = useState<(typeof tracks)[number]>('Effects');
  const [omitLastNameDependency, setOmitLastNameDependency] = useState(false);

  const report = buildEffectNeedReport(scenario);
  const directPreview = derivePreviewLabel(firstName, lastName, track);
  const mirroredPreview = omitLastNameDependency
    ? derivePreviewLabel(firstName, '', track)
    : directPreview;

  const hasDrift = directPreview !== mirroredPreview;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {effectScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScenario(item.id)}
              className={clsx('chip', scenario === item.id && 'chip-active')}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">First name</span>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-300"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Last name</span>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-300"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {tracks.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTrack(item)}
              className={clsx('chip', track === item && 'chip-active')}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={omitLastNameDependency}
            onChange={(event) => setOmitLastNameDependency(event.target.checked)}
          />
          Пропустить `lastName` в зависимостях плохого effect-примера
        </label>

        <CodeBlock label={report.title} code={report.snippet} />
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Сравнение результата</h3>
          <StatusPill tone={hasDrift ? 'error' : report.tone}>
            {hasDrift ? 'drift' : report.needsEffect ? 'effect нужен' : 'effect лишний'}
          </StatusPill>
        </div>

        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Прямое вычисление в render
          </p>
          <p className="mt-3 text-lg font-semibold text-emerald-950">{directPreview}</p>
        </div>

        <div
          className={clsx(
            'rounded-[24px] border p-4',
            hasDrift ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50',
          )}
        >
          <p
            className={clsx(
              'text-xs font-semibold uppercase tracking-[0.18em]',
              hasDrift ? 'text-rose-700' : 'text-slate-500',
            )}
          >
            Дублирование через effect
          </p>
          <p
            className={clsx(
              'mt-3 text-lg font-semibold',
              hasDrift ? 'text-rose-950' : 'text-slate-900',
            )}
          >
            {mirroredPreview}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
          <p>{report.summary}</p>
          <p className="mt-3">{report.guidance}</p>
        </div>
      </Panel>
    </div>
  );
}
