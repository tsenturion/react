import { MutationFlowLab } from '../components/mutations/MutationFlowLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function FlowPage() {
  const study = projectStudies.flow;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Mutation flow"
        copy="Оптимистическая мутация начинается не с ответа сервера, а с решения UI показать ожидаемый результат заранее. Здесь вы видите этот путь целиком: intent, optimistic patch, pending state и server confirmation."
      />

      <Panel>
        <MutationFlowLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Intent"
          value="User action"
          hint="Каждая мутация стартует от конкретного действия, а не от произвольного фона."
          tone="cool"
        />
        <MetricCard
          label="Pending"
          value="Not confirmed yet"
          hint="Локально показанный результат ещё не равен подтверждённой правде сервера."
        />
        <MetricCard
          label="Finish"
          value="Server confirm"
          hint="Только после подтверждения optimistic слой перестаёт быть предположением."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
