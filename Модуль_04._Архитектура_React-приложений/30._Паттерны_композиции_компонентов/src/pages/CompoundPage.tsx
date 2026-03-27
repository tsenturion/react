import { CompoundComponentsLab } from '../components/composition-patterns/CompoundComponentsLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function CompoundPage() {
  const study = projectStudies.compound;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Compound components"
        copy="Compound components нужны там, где несколько частей одного surface API должны делить состояние и semantics, но consumer должен свободно собирать layout из этих частей. Это особенно полезно для tabs, accordion, menu, stepper и похожих widget families."
      />

      <Panel>
        <CompoundComponentsLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Когда помогает"
          value="Shared surface"
          hint="Подкомпоненты принадлежат одному виджету и реально разделяют общую модель поведения."
          tone="cool"
        />
        <MetricCard
          label="Что даёт"
          value="Flexible API"
          hint="Consumer сам собирает структуру из частей, но state и semantics остаются общими."
        />
        <MetricCard
          label="Где ломается"
          value="Too many parts"
          hint="Если подкомпонентов становится слишком много, API теряет прозрачность."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
