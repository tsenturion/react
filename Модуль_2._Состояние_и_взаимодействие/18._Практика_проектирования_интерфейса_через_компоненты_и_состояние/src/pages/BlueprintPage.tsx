import { BlueprintWorkshopLab } from '../components/interface-practice/BlueprintWorkshopLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildBlueprintPlan } from '../lib/blueprint-model';
import { getProjectStudy } from '../lib/project-study';

export function BlueprintPage() {
  const plan = buildBlueprintPlan('course-console');
  const study = getProjectStudy('blueprint');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Как перейти от текстового макета к реактовской архитектуре"
        copy="Текстовый бриф сначала раскладывается на части экрана, потом на state-срезы, потом на derived values и события. И только после этого появляется окончательная форма компонентов."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Компоненты"
          value={String(plan.components.length)}
          hint="Компоненты появляются из screen parts, а не из случайного желания дробить код."
          tone="cool"
        />
        <MetricCard
          label="State slices"
          value={String(plan.state.length)}
          hint="В план попадают только те значения, которые действительно меняются от действий."
        />
        <MetricCard
          label="Events"
          value={String(plan.events.length)}
          hint="Список событий фиксирует причинно-следственную цепочку для будущих обработчиков."
          tone="accent"
        />
      </div>

      <BlueprintWorkshopLab />

      <Panel className="space-y-4">
        <CodeBlock label="Architecture from brief" code={plan.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
