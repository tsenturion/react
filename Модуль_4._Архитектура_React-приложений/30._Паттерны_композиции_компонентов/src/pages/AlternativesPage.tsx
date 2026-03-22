import { AlternativesLab } from '../components/composition-patterns/AlternativesLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function AlternativesPage() {
  const study = projectStudies.alternatives;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Сравнение паттернов и современных альтернатив"
        copy="Один и тот же API-компонент можно построить разными способами, но правильный выбор зависит от требований. Здесь можно посмотреть, когда действительно нужен старший паттерн, а когда хватит custom hook и явной props/slots-композиции."
      />

      <Panel>
        <AlternativesLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Современный default"
          value="Hooks + slots"
          hint="Если логика и layout можно разделить явно, это обычно самый прозрачный и дешёвый путь."
          tone="cool"
        />
        <MetricCard
          label="Старшие паттерны"
          value="By need"
          hint="Compound, render props, HOC и cloneElement нужны не всегда, а только под конкретный тип API-задачи."
        />
        <MetricCard
          label="Главный фильтр"
          value="Requirements"
          hint="Выбор паттерна должен идти от требований сценария, а не от привычки или моды."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
