'use client';

import { useState } from 'react';

import {
  planRenderingStrategy,
  type RenderingFrameworkId,
} from '../../lib/rendering-family-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function RenderingDirectionLab() {
  const [framework, setFramework] = useState<RenderingFrameworkId>('next-app-router');
  const [seoCritical, setSeoCritical] = useState(true);
  const [personalizedShell, setPersonalizedShell] = useState(false);
  const [longTailStatic, setLongTailStatic] = useState(true);
  const [dataLatency, setDataLatency] = useState<'low' | 'medium' | 'high'>('high');
  const [interactionDepth, setInteractionDepth] = useState<'low' | 'medium' | 'high'>(
    'medium',
  );

  const report = planRenderingStrategy({
    framework,
    seoCritical,
    personalizedShell,
    longTailStatic,
    dataLatency,
    interactionDepth,
  });

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Rendering planner</span>
          <p className="text-sm leading-6 text-slate-600">
            Эта лаборатория связывает rendering mode с framework pipeline. Здесь видно,
            что partial prerendering и resume/prerender direction нельзя обсуждать в
            отрыве от layouts, data latency и персонализации.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            ['next-app-router', 'react-router-framework', 'platform-direction'] as const
          ).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFramework(value)}
              className={`chip ${framework === value ? 'chip-active' : ''}`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            { value: seoCritical, setValue: setSeoCritical, label: 'SEO критичен' },
            {
              value: personalizedShell,
              setValue: setPersonalizedShell,
              label: 'Shell персонализирован',
            },
            {
              value: longTailStatic,
              setValue: setLongTailStatic,
              label: 'Есть long-tail static трафик',
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => item.setValue(!item.value)}
              className={`rounded-[24px] border px-4 py-4 text-left transition ${
                item.value
                  ? 'border-sky-500 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="mt-2 block text-sm leading-6 opacity-80">
                {item.value ? 'Да' : 'Нет'}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Data latency: {dataLatency}
            </span>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['low', 'medium', 'high'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDataLatency(value)}
                  className={`chip ${dataLatency === value ? 'chip-active' : ''}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </label>

          <label className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Interaction depth: {interactionDepth}
            </span>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['low', 'medium', 'high'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setInteractionDepth(value)}
                  className={`chip ${interactionDepth === value ? 'chip-active' : ''}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </label>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell strategy"
          value={report.shellStrategy}
          hint="Как framework должен собрать каркас страницы для текущего маршрута."
          tone="accent"
        />
        <MetricCard
          label="Streaming"
          value={report.streamingHelpful ? 'Да' : 'Нет'}
          hint="Нужен ли потоковый вывод вместо ожидания всего экрана."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Partial prerendering
          </p>
          <div className="mt-3">
            <StatusPill tone={report.pprEligible ? 'success' : 'warn'}>
              {report.pprEligible ? 'Хороший fit' : 'Ограниченный fit'}
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{report.directionNote}</p>
        </div>
      </div>

      <Panel>
        <ListBlock title="Rendering phases" items={report.phases} />
      </Panel>
    </div>
  );
}
