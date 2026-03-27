import { TimersObjectsLab } from '../components/dom-refs/TimersObjectsLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildTimerObjectReport, formatElapsed } from '../lib/timer-object-model';

export function TimersObjectsPage() {
  const timerRef = buildTimerObjectReport('timer-ref');
  const external = buildTimerObjectReport('external-object');
  const smell = buildTimerObjectReport('state-smell');
  const study = getProjectStudy('timers');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Таймеры, handles и внешние объекты в refs"
        copy="Ref удобен не только для DOM-элементов. Таймеры, imperative instances и другие mutable handles можно держать в ref, если они не описывают сам интерфейс."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Stopwatch sample"
          value={formatElapsed(125000)}
          hint={timerRef.summary}
          tone="cool"
        />
        <MetricCard
          label="External instance"
          value="single object"
          hint={external.summary}
          tone="dark"
        />
        <MetricCard
          label="Anti-pattern"
          value="handle in state"
          hint={smell.summary}
          tone="accent"
        />
      </div>

      <TimersObjectsLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={timerRef.title} code={timerRef.snippet} />
        <CodeBlock label={external.title} code={external.snippet} />
        <CodeBlock label={smell.title} code={smell.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
