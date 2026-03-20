import { DelayedIncrementSandbox } from '../components/state/DelayedIncrementSandbox';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { simulateDelayedIncrements } from '../lib/stale-state-model';

export function StaleStatePage() {
  const stale = simulateDelayedIncrements(0, 3, 'direct');
  const fresh = simulateDelayedIncrements(0, 3, 'functional');
  const study = getProjectStudy('stale');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Stale state и отложенные обновления"
        copy="Проблема stale state проявляется особенно заметно в таймерах, промисах и других отложенных callback. Здесь можно несколько раз подряд поставить инкремент в очередь и увидеть, как stale closure теряет обновления."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="stale final"
            value={String(stale.finalValue)}
            hint="Несколько stale callback часто приводят только к одному реальному шагу."
            tone="accent"
          />
          <MetricCard
            label="functional final"
            value={String(fresh.finalValue)}
            hint="Functional update сохраняет все отложенные инкременты."
            tone="cool"
          />
          <MetricCard
            label="Источник ошибки"
            value="stale closure"
            hint="Callback замкнул старое значение из прошлого рендера."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone={stale.tone}>stale callback</StatusPill>
          <p className="text-sm leading-6 text-slate-600">{stale.summary}</p>
        </div>

        <BeforeAfter
          beforeTitle="Если callback запомнил старый count"
          before={stale.summary}
          afterTitle="Если callback использует functional update"
          after={fresh.summary}
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Ключевая разница</h2>
            <div className="grid gap-4">
              <CodeBlock label="Stale update" code={stale.snippet} />
              <CodeBlock label="Functional update" code={fresh.snippet} />
            </div>
          </Panel>

          <DelayedIncrementSandbox />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
