import { ArchitectureShiftLab } from '../components/redux-architecture/ArchitectureShiftLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ArchitecturePage() {
  const study = projectStudies.architecture;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как меняются код и мышление при переходе к Redux"
        copy="Переход к централизованной модели меняет не только API, но и точку, из которой вы проектируете интерфейс. Вместо компонента как владельца shared state появляется store layer, actions описывают намерения, reducers собирают transitions, а selectors становятся отдельным способом формировать данные для view-веток."
      />

      <Panel>
        <ArchitectureShiftLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Локальная модель"
          value="Component-first"
          hint="Сначала думаете о виджете и его состоянии, а затем тянете данные вверх по мере роста дерева."
          tone="cool"
        />
        <MetricCard
          label="Redux-модель"
          value="State-first"
          hint="Сначала появляется общая модель transitions и derived data, а затем компоненты подключаются к ней как потребители."
        />
        <MetricCard
          label="Цена перехода"
          value="Extra layer"
          hint="Redux добавляет actions, reducers и selectors, поэтому он нужен только там, где этот слой действительно окупается."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
