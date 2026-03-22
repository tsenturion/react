import { ContextVsReduxLab } from '../components/redux-architecture/ContextVsReduxLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ComparePage() {
  const study = projectStudies.compare;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Context vs Redux: где проходит граница"
        copy="Context и Redux решают разные классы задач. Context помогает доставить данные через дерево, а Redux оправдан там, где нужен app-level слой действий, переходов и derived data. Здесь можно проверить, как архитектурное решение меняется вместе с глубиной дерева, сложностью transitions и масштабом shared state."
      />

      <Panel>
        <ContextVsReduxLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Когда хватает context"
          value="Delivery"
          hint="Если главная проблема в глубоком дереве, но не в app-wide координации, Redux может быть лишним."
          tone="cool"
        />
        <MetricCard
          label="Когда помогает reducer"
          value="Complexity"
          hint="Сложные transitions часто требуют отдельного update-слоя ещё до полноценного Redux."
        />
        <MetricCard
          label="Когда нужен Redux"
          value="App-level"
          hint="Redux начинает выигрывать, когда shared state и actions уже координируют несколько feature-модулей."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
