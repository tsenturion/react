import { ReducerWorkflowLab } from '../components/context-reducer/ReducerWorkflowLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ReducerLogicPage() {
  const study = projectStudies.reducer;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="useReducer как модель сложных переходов состояния"
        copy="Reducer нужен там, где компонент уже живёт не одним `setOpen(true)`, а цепочкой намерений: focus, filter, apply draft, cycle priority, reset. Он собирает transitions в один предсказуемый switch и позволяет читать UI как набор dispatch-ов, а не как россыпь несвязанных setState-вызовов."
      />

      <Panel>
        <ReducerWorkflowLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Главный плюс"
          value="Action log"
          hint="Становится видно не только значение state, но и путь, которым оно изменилось."
          tone="cool"
        />
        <MetricCard
          label="Хороший сигнал"
          value="Complex transitions"
          hint="Несколько зависимых полей и последовательных действий удобнее собирать через reducer."
        />
        <MetricCard
          label="Риск"
          value="Reducer ради reducer"
          hint="Для маленького toggle лишний reducer только усложнит код."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
