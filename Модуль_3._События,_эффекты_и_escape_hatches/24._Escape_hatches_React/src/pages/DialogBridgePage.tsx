import { DialogBridgeLab } from '../components/escape-hatches/DialogBridgeLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildDialogBridgeReport } from '../lib/dialog-bridge-model';
import { getProjectStudy } from '../lib/project-study';

export function DialogBridgePage() {
  const bridgeReport = buildDialogBridgeReport('state');
  const driftReport = buildDialogBridgeReport('forced');
  const cleanupReport = buildDialogBridgeReport('cleanup');
  const study = getProjectStudy('bridge');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Интеграция React с imperative browser API"
        copy="Часть platform API не знает ничего о React state. Нативный dialog — хороший пример: он открывается через imperative методы showModal() и close(). В таких случаях нужен мост между React state и внешним API, а не прямой обход state."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Recommended path"
          value="state bridge"
          hint={bridgeReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Risk path"
          value="drift"
          hint={driftReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Must-have sync"
          value="close listener"
          hint={cleanupReport.summary}
          tone="dark"
        />
      </div>

      <DialogBridgeLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={bridgeReport.title} code={bridgeReport.snippet} />
        <CodeBlock label={driftReport.title} code={driftReport.snippet} />
        <CodeBlock label={cleanupReport.title} code={cleanupReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
