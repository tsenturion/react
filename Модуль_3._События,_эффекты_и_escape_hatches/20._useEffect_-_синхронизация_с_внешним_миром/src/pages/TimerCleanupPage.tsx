import { TimerCleanupLab } from '../components/effects/TimerCleanupLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildTimerReport } from '../lib/effect-timer-model';
import { getProjectStudy } from '../lib/project-study';

export function TimerCleanupPage() {
  const safe = buildTimerReport('cleanup');
  const leak = buildTimerReport('leak');
  const study = getProjectStudy('timers');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Таймеры и cleanup"
        copy="Interval и timeout создают внешний процесс вне React render. Поэтому у них всегда две части: setup, который запускает процесс, и cleanup, который снимает его, когда зависимость изменилась или компонент ушёл."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="External process"
          value="interval"
          hint="Таймер продолжает работать сам по себе, пока его явно не остановить."
          tone="cool"
        />
        <MetricCard label="Cleanup" value="clearInterval" hint={safe.summary} />
        <MetricCard
          label="Leak"
          value="duplicated ticks"
          hint={leak.summary}
          tone="accent"
        />
      </div>

      <TimerCleanupLab />

      <BeforeAfter
        beforeTitle="Без cleanup"
        before="Каждая смена delay добавляет ещё один активный interval. UI получает дублирующиеся тики и начинает жить быстрее, чем вы ожидаете."
        afterTitle="С cleanup"
        after="Перед новым setup React снимает старый interval, поэтому активным остаётся только один источник тиков."
      />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={safe.title} code={safe.snippet} />
        <CodeBlock label={leak.title} code={leak.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
