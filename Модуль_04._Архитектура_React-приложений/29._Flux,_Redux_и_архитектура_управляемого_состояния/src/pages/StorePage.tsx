import { ReduxStoreLab } from '../components/redux-architecture/ReduxStoreLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function StorePage() {
  const study = projectStudies.store;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Redux store, actions, reducers и selectors в реальном коде"
        copy="Здесь store уже работает как отдельный слой приложения: toolbar, list и inspector не синхронизируются вручную между собой, а читают один slice и отправляют actions назад в reducer. Это и есть главное изменение структуры кода при переходе от локального state к централизованной модели."
      />

      <Panel>
        <ReduxStoreLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Store layer"
          value="One source"
          hint="Shared data лежат в одном state tree, а не дублируются по нескольким компонентам."
          tone="cool"
        />
        <MetricCard
          label="Reducer layer"
          value="Transitions"
          hint="Reducer описывает не события интерфейса, а переходы модели данных после actions."
        />
        <MetricCard
          label="Selector layer"
          value="Derived view"
          hint="Selectors убирают вычисления из JSX и формируют данные под конкретные ветки UI."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
