import { PlacementAdvisorLab } from '../components/state-architecture/PlacementAdvisorLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function PlacementAdvisorPage() {
  const study = projectStudies.advisor;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Trade-offs: как выбрать правильное место хранения"
        copy="У одного и того же экрана могут быть сразу несколько видов состояния. Важно не искать один универсальный store, а понимать сигналы сценария: нужно ли делиться ссылкой, синхронизировать далёкие ветки, получать данные извне, хранить временный черновик только рядом с компонентом."
      />

      <Panel>
        <PlacementAdvisorLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Главный вопрос"
          value="Кто владелец?"
          hint="Архитектура состояния начинается не с hooks, а с ответа на вопрос об источнике истины."
          tone="cool"
        />
        <MetricCard
          label="Типичная ошибка"
          value="Один store для всего"
          hint="Такое решение прячет реальные границы ответственности и делает экран хрупким."
          tone="accent"
        />
        <MetricCard
          label="Полезный итог"
          value="Ясные границы"
          hint="Когда роли слоёв понятны, и отладка, и повторное использование становятся проще."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
