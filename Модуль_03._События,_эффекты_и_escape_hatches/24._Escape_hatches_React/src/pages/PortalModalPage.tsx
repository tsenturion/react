import { PortalModalLab } from '../components/escape-hatches/PortalModalLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { modalLayers, PORTAL_ROOT_ID } from '../lib/escape-domain';
import { buildPortalReport, describePortalMode } from '../lib/portal-model';
import { getProjectStudy } from '../lib/project-study';

export function PortalModalPage() {
  const portalReport = buildPortalReport('modal');
  const study = getProjectStudy('modal');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="createPortal и modal layer вне обычного DOM-контейнера"
        copy="Modal часто должна выйти из обычного layout-потока: поверх clipping-контейнеров, поверх локальных stacking context и ближе к body-level overlay host. createPortal решает именно это, не разрывая React ownership."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Portal host id"
          value={PORTAL_ROOT_ID}
          hint={portalReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Layer steps"
          value={String(modalLayers.length)}
          hint={describePortalMode('portal')}
          tone="accent"
        />
        <MetricCard
          label="Inline risk"
          value="clipping / stacking"
          hint={describePortalMode('inline')}
          tone="dark"
        />
      </div>

      <PortalModalLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={portalReport.title} code={portalReport.snippet} />
        <CodeBlock
          label="Portal root in HTML"
          code={['<div id="root"></div>', `<div id="${PORTAL_ROOT_ID}"></div>`].join(
            '\n',
          )}
        />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
