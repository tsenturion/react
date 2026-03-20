import { CriticalPositioningLab } from '../components/dom-hooks/CriticalPositioningLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { computeIndicatorBox, describePositioningMode } from '../lib/positioning-model';
import { getProjectStudy } from '../lib/project-study';

export function PositioningPage() {
  const layoutReport = describePositioningMode('layout', 'wide');
  const effectReport = describePositioningMode('effect', 'compact');
  const sample = computeIndicatorBox(
    { left: 180, width: 108 },
    { left: 120, width: 420 },
  );
  const study = getProjectStudy('positioning');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Критичные измерения и позиционирование"
        copy="Когда UI зависит от реальной геометрии DOM, важна не только формула измерения, но и момент, в который она срабатывает. Подчеркивание, overlay, sliding highlight и подобные элементы особенно чувствительны к timing."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Sample left offset"
          value={`${sample.left}px`}
          hint={layoutReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Indicator width"
          value={`${sample.width}px`}
          hint={effectReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Observer support"
          value="ResizeObserver"
          hint="Для remeasure на ширину/resize underline должен знать, что layout реально изменился."
          tone="dark"
        />
      </div>

      <CriticalPositioningLab />

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
