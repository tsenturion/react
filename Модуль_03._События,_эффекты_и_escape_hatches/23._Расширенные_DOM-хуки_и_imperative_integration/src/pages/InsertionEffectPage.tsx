import { InsertionEffectLab } from '../components/dom-hooks/InsertionEffectLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildInjectedThemeCss,
  buildInjectionTimeline,
  describeInjectionMode,
} from '../lib/insertion-effect-model';
import { getProjectStudy } from '../lib/project-study';

export function InsertionEffectPage() {
  const insertionReport = describeInjectionMode('insertion');
  const effectReport = describeInjectionMode('effect');
  const cssLength = buildInjectedThemeCss('scope-demo', 'signal').length;
  const study = getProjectStudy('insertion');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="useInsertionEffect и критичная инъекция стилей"
        copy="Этот hook нужен не для обычной бизнес-логики и даже не для большинства DOM-операций. Его реальная зона применения намного уже: подготовить style rules до того, как другие эффекты начнут измерять layout."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Scoped CSS bytes"
          value={String(cssLength)}
          hint={insertionReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Timeline length"
          value={String(buildInjectionTimeline('insertion').length)}
          hint={effectReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Primary use case"
          value="CSS-in-JS runtime"
          hint="Если задача не про style injection, useInsertionEffect почти наверняка не нужен."
          tone="dark"
        />
      </div>

      <InsertionEffectLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={insertionReport.title} code={insertionReport.snippet} />
        <CodeBlock label={effectReport.title} code={effectReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
