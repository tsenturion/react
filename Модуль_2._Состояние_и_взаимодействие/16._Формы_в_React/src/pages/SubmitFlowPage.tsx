import { SubmitFlowLab } from '../components/forms/SubmitFlowLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildSubmitFlowReport } from '../lib/submit-flow-model';
import { getProjectStudy } from '../lib/project-study';

export function SubmitFlowPage() {
  const report = buildSubmitFlowReport('idle', true);
  const study = getProjectStudy('submit');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Submit flow, payload и reset формы"
        copy="Submit flow включает больше, чем нажатие кнопки: остановку нативного поведения, проверку актуального state, сбор payload, стадию отправки, обработку результата и понятный reset."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Idle"
          value="ready or blocked"
          hint="Submit зависит от текущей готовности state формы."
          tone="cool"
        />
        <MetricCard
          label="Submitting"
          value="async stage"
          hint="Во время отправки UI должен ясно показывать, что происходит."
        />
        <MetricCard
          label="Success/Error"
          value="explicit result"
          hint={report.summary}
          tone="accent"
        />
      </div>

      <SubmitFlowLab />

      <Panel className="space-y-4">
        <CodeBlock label="Submit flow" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
