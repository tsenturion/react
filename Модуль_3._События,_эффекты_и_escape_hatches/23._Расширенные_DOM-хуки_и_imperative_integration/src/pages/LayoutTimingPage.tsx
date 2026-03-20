import { LayoutTimingLab } from '../components/dom-hooks/LayoutTimingLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildLayoutHookSequence,
  describeLayoutMode,
  fallbackPopoverPlacement,
} from '../lib/layout-timing-model';
import { getProjectStudy } from '../lib/project-study';

export function LayoutTimingPage() {
  const layoutReport = describeLayoutMode('layout');
  const effectReport = describeLayoutMode('effect');
  const study = getProjectStudy('timing');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="useLayoutEffect и timing относительно paint"
        copy="Здесь хорошо видно, что useLayoutEffect нужен не для «любого кода пораньше», а для очень узких сценариев: измерить DOM, согласовать критичную геометрию и отдать в paint уже готовый кадр."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Layout phase count"
          value={String(buildLayoutHookSequence('layout').length)}
          hint={layoutReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Passive correction"
          value={effectReport.title}
          hint={effectReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Fallback placement"
          value={`top ${fallbackPopoverPlacement.top}px`}
          hint="Fallback здесь намеренно виден, чтобы подчеркнуть разницу между sync и post-paint correction."
          tone="dark"
        />
      </div>

      <LayoutTimingLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={layoutReport.title} code={layoutReport.snippet} />
        <CodeBlock label={effectReport.title} code={effectReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
