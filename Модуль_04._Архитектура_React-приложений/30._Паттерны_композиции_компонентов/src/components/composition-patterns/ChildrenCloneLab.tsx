import clsx from 'clsx';
import { useState } from 'react';

import { inspectChildContract } from '../../lib/children-api-model';
import { childModes } from '../../lib/pattern-domain';
import { MetricCard, StatusPill } from '../ui';
import { ActionRail } from './ActionRail';

export function ChildrenCloneLab() {
  const [mode, setMode] = useState<'direct' | 'wrapped' | 'mixed'>('direct');
  const [activeValue, setActiveValue] = useState('overview');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const report = inspectChildContract(mode);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={report.tone}>{report.directChildSafety}</StatusPill>
        <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Child structure
            </p>
            <div className="mt-4 grid gap-2">
              {childModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={clsx(
                    'rounded-xl border px-3 py-3 text-left text-sm transition',
                    mode === item.id
                      ? 'border-blue-500 bg-blue-50 text-blue-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  )}
                >
                  <span className="block font-medium">{item.label}</span>
                  <span className="mt-1 block leading-6 text-slate-500">
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Injected size
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['comfortable', 'compact'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDensity(value)}
                  className={clsx(
                    'rounded-xl px-3 py-2 text-sm font-medium transition',
                    density === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Action rail preview</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Активный шаг: <strong>{activeValue}</strong>
            </p>
            <div className="mt-4">
              <ActionRail
                value={activeValue}
                onValueChange={setActiveValue}
                size={density}
              >
                <ActionRail.Button value="overview">Overview</ActionRail.Button>
                {mode === 'direct' ? (
                  <ActionRail.Button value="api">API</ActionRail.Button>
                ) : null}
                {mode === 'wrapped' ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-2">
                    <ActionRail.Button value="api">API</ActionRail.Button>
                  </div>
                ) : null}
                {mode === 'mixed' ? (
                  <>
                    <div className="rounded-xl border border-dashed border-slate-300 p-2">
                      <ActionRail.Button value="api">API</ActionRail.Button>
                    </div>
                    <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
                      decorative note
                    </span>
                  </>
                ) : null}
                <ActionRail.Button value="pitfalls">Pitfalls</ActionRail.Button>
              </ActionRail>
            </div>
          </div>

          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-950">Boundary warning</p>
            <p className="mt-2 text-sm leading-6 text-amber-950">{report.warning}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Direct child safety"
          value={report.directChildSafety}
          hint="cloneElement работает предсказуемо только пока структура children полностью контролируема."
          tone="cool"
        />
        <MetricCard
          label="Главный плюс"
          value="Targeted injection"
          hint="В узких случаях root действительно удобно навешивает active state и handlers на прямых детей."
        />
        <MetricCard
          label="Главный риск"
          value="Fragile tree"
          hint="Любая внешняя обёртка или посторонний child ломают неявный контракт структуры."
          tone="accent"
        />
      </div>
    </div>
  );
}
