import { IsolationLab } from '../components/error-boundaries/IsolationLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function IsolationPage() {
  const study = projectStudies.isolation;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Isolation и blast radius"
        copy="Один и тот же сбой выглядит по-разному в зависимости от того, где вы поставили boundary. Здесь особенно хорошо видно, почему placement boundary — это архитектурное решение, а не декоративная обёртка."
      />

      <Panel>
        <IsolationLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Локальный boundary"
          value="Small blast radius"
          hint="Соседние части экрана продолжают жить даже при падении одного widget."
          tone="cool"
        />
        <MetricCard
          label="Общий boundary"
          value="Shared fallback"
          hint="Проще по коду, но один сбой выключает сразу весь раздел."
        />
        <MetricCard
          label="Практическое правило"
          value="Place by risk"
          hint="Чем выше риск или неопределённость поведения, тем ближе boundary стоит ставить к проблемной зоне."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
