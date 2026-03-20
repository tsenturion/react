import { ImperativeHandleLab } from '../components/dom-hooks/ImperativeHandleLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildImperativeHandleReport } from '../lib/imperative-handle-model';
import { getProjectStudy } from '../lib/project-study';

export function ImperativeHandlePage() {
  const apiReport = buildImperativeHandleReport('api');
  const ownershipReport = buildImperativeHandleReport('ownership');
  const focusReport = buildImperativeHandleReport('focus');
  const study = getProjectStudy('handle');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="useImperativeHandle и узкий imperative API child-компонента"
        copy="Когда родителю нужна команда к дочернему компоненту, useImperativeHandle позволяет отдать наружу очень ограниченный API. Это отличается и от передачи raw DOM, и от проброса внутренних state-setter-ов."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="API boundary"
          value="commands only"
          hint={apiReport.summary}
          tone="cool"
        />
        <MetricCard
          label="State owner"
          value="child"
          hint={ownershipReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Focus handoff"
          value="open → focus"
          hint={focusReport.summary}
          tone="dark"
        />
      </div>

      <ImperativeHandleLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={apiReport.title} code={apiReport.snippet} />
        <CodeBlock label={ownershipReport.title} code={ownershipReport.snippet} />
        <CodeBlock label={focusReport.title} code={focusReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
