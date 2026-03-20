import { WidgetIntegrationLab } from '../components/dom-hooks/WidgetIntegrationLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildWidgetLifecycleReport,
  describeWidgetSyncMode,
} from '../lib/widget-integration-model';
import { getProjectStudy } from '../lib/project-study';

export function WidgetIntegrationPage() {
  const syncReport = describeWidgetSyncMode('layout');
  const mountReport = buildWidgetLifecycleReport('mount');
  const updateReport = buildWidgetLifecycleReport('update');
  const cleanupReport = buildWidgetLifecycleReport('cleanup');
  const study = getProjectStudy('widget');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Imperative integration со сторонними виджетами"
        copy="React не запрещает внешние библиотеки, но требует чёткой границы. У виджета должен быть собственный host node, жизненный цикл подключения и явный cleanup, чтобы не смешивать React-owned DOM с чужим imperative runtime."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Bridge hook"
          value="useLayoutEffect"
          hint={syncReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Host contract"
          value="single host div"
          hint={mountReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Must-have cleanup"
          value="destroy()"
          hint={cleanupReport.summary}
          tone="dark"
        />
      </div>

      <WidgetIntegrationLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={mountReport.title} code={mountReport.snippet} />
        <CodeBlock label={updateReport.title} code={updateReport.snippet} />
        <CodeBlock label={cleanupReport.title} code={cleanupReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
