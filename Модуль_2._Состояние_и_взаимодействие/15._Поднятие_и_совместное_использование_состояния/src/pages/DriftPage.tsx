import { SiblingDriftLab } from '../components/shared-state/SiblingDriftLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildSiblingSyncReport } from '../lib/sibling-sync-model';
import { createSelectionItems } from '../lib/shared-state-domain';
import { getProjectStudy } from '../lib/project-study';

export function DriftPage() {
  const report = buildSiblingSyncReport(createSelectionItems(), 'alpha', 'beta', 'alpha');
  const study = getProjectStudy('drift');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Рассинхронизация при дублировании состояния у siblings"
        copy="Если соседние компоненты держат собственные локальные копии одного и того же выбора, они быстро расходятся. Здесь рядом показаны плохая и правильная архитектуры для одного selectedId."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Bad state"
            value={report.badLabel}
            hint="Каждый sibling хранит свою копию."
            tone="accent"
          />
          <MetricCard
            label="Good state"
            value={report.goodLabel}
            hint="Один source of truth у общего parent."
            tone="cool"
          />
          <MetricCard
            label="Причина"
            value="duplicated selection"
            hint={report.summary}
          />
        </div>

        <BeforeAfter
          beforeTitle="Если у siblings разные selectedId"
          before="Toolbar и details реагируют на разные локальные копии и перестают быть согласованными."
          afterTitle="Если selectedId поднят к parent"
          after={report.summary}
        />

        <SiblingDriftLab />
        <CodeBlock label="Shared selectedId" code={report.snippet} />
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
