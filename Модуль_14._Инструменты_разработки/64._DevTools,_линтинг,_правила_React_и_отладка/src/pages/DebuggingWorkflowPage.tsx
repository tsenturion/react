import { DebuggingWorkflowLab } from '../components/tooling-labs/DebuggingWorkflowLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function DebuggingWorkflowPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Debug flow"
        title="Отладка быстрее, когда у симптома есть правильная первая остановка"
        copy="Разные баги требуют разных первых инструментов: где-то нужен живой snapshot в DevTools, где-то hooks lint, а где-то profiler-style reasoning. Эта страница превращает symptom в маршрут диагностики и показывает, какого слоя инструментов не хватает."
      />

      <DebuggingWorkflowLab />

      <section className="panel p-5 sm:p-6">
        <ProjectStudy {...projectStudyByLab.debug} />
      </section>
    </div>
  );
}
