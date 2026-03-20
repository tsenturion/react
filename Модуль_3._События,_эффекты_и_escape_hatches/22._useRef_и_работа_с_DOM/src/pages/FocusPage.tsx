import { FocusLab } from '../components/dom-refs/FocusLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildFocusReport } from '../lib/focus-dom-model';
import { getProjectStudy } from '../lib/project-study';

export function FocusPage() {
  const manual = buildFocusReport('manual-focus');
  const validation = buildFocusReport('validation-focus');
  const restore = buildFocusReport('restore-last');
  const study = getProjectStudy('focus');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Refs к DOM-элементам и управление фокусом"
        copy="Focus — типичный пример допустимого imperative DOM. Здесь ref помогает обратиться к конкретному input в нужный момент, не превращая DOM-узел в state."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Manual focus"
          value="focus()"
          hint={manual.summary}
          tone="cool"
        />
        <MetricCard
          label="Submit flow"
          value="first invalid"
          hint={validation.summary}
          tone="accent"
        />
        <MetricCard
          label="Restore"
          value="last focused"
          hint={restore.summary}
          tone="dark"
        />
      </div>

      <FocusLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={manual.title} code={manual.snippet} />
        <CodeBlock label={validation.title} code={validation.snippet} />
        <CodeBlock label={restore.title} code={restore.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
