import { EscapeBoundaryLab } from '../components/escape-hatches/EscapeBoundaryLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getEscapeRecommendation } from '../lib/escape-boundary-model';
import { buildFlushSyncReport } from '../lib/flush-sync-model';
import { buildPortalReport } from '../lib/portal-model';
import { getProjectStudy } from '../lib/project-study';

export function EscapeBoundaryPage() {
  const portalScenario = getEscapeRecommendation('modal-layer');
  const filterScenario = getEscapeRecommendation('derived-filter');
  const widgetScenario = getEscapeRecommendation('widget-command');
  const portalReport = buildPortalReport('modal');
  const flushReport = buildFlushSyncReport('rare');
  const study = getProjectStudy('boundary');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как использовать escape hatches точечно, не разрушая архитектуру"
        copy="createPortal, flushSync и bridge к imperative API полезны только там, где обычная декларативная модель действительно упирается в ограничения DOM или внешней системы. Если задача решается чистым render-вычислением или обычным state, escape hatch становится лишним усложнением."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Modal scenario"
          value={portalScenario.recommended}
          hint={portalScenario.why}
          tone="cool"
        />
        <MetricCard
          label="Derived filter"
          value={filterScenario.recommended}
          hint={filterScenario.why}
          tone="accent"
        />
        <MetricCard
          label="Widget command"
          value={widgetScenario.recommended}
          hint={widgetScenario.why}
          tone="dark"
        />
      </div>

      <EscapeBoundaryLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={portalReport.title} code={portalReport.snippet} />
        <CodeBlock label={flushReport.title} code={flushReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
