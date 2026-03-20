import clsx from 'clsx';
import { useState } from 'react';

import type { EffectPitfallMode } from '../../lib/effect-domain';
import { derivePreviewLabel } from '../../lib/effect-need-model';
import {
  buildPitfallReport,
  getExpectedEffectRuns,
  simulateLoopTrace,
} from '../../lib/effect-pitfall-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

const modes: readonly { id: EffectPitfallMode; label: string }[] = [
  { id: 'derived-in-effect', label: 'Лишний effect' },
  { id: 'unstable-dependency', label: 'Нестабильные deps' },
  { id: 'loop-risk', label: 'Loop risk' },
];

export function PitfallLab() {
  const [mode, setMode] = useState<EffectPitfallMode>('derived-in-effect');
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');
  const [renders, setRenders] = useState(4);
  const [steps, setSteps] = useState(5);

  const report = buildPitfallReport(mode);
  const renderValue = derivePreviewLabel(firstName, lastName, 'Effects');
  const mirroredBadValue = derivePreviewLabel(firstName, '', 'Effects');
  const unstableRuns = getExpectedEffectRuns(renders, 'unstable');
  const stableRuns = getExpectedEffectRuns(renders, 'stable');
  const loopTrace = simulateLoopTrace(steps);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={clsx('chip', mode === item.id && 'chip-active')}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mode === 'derived-in-effect' ? (
          <div className="space-y-4">
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
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  вычисление в render
                </p>
                <p className="mt-3 text-lg font-semibold text-emerald-950">
                  {renderValue}
                </p>
              </div>
              <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                  плохой effect с пропущенной dep
                </p>
                <p className="mt-3 text-lg font-semibold text-rose-950">
                  {mirroredBadValue}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {mode === 'unstable-dependency' ? (
          <div className="space-y-4">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Количество render-проходов</span>
              <input
                type="range"
                min="1"
                max="8"
                value={renders}
                onChange={(event) => setRenders(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  stable deps
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-950">
                  {stableRuns}
                </p>
              </div>
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  unstable deps
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-amber-950">
                  {unstableRuns}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {mode === 'loop-risk' ? (
          <div className="space-y-4">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Показать шагов цикла</span>
              <input
                type="range"
                min="3"
                max="8"
                value={steps}
                onChange={(event) => setSteps(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <div className="space-y-2">
              {loopTrace.map((entry) => (
                <div
                  key={entry}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {entry}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock label="Bad snippet" code={report.badSnippet} />
          <CodeBlock label="Good snippet" code={report.goodSnippet} />
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
          <StatusPill tone={report.tone}>{mode}</StatusPill>
        </div>
        <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          Эту лабораторию лучше читать как безопасный симулятор: здесь собраны те
          сценарии, которые в реальном приложении либо создают drift, либо запускают
          effect слишком часто, либо вообще уходят в бесконечный цикл.
        </div>
      </Panel>
    </div>
  );
}
