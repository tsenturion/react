import { NonCaughtLab } from '../components/error-boundaries/NonCaughtLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function NonCaughtPage() {
  const study = projectStudies['non-caught'];

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Что boundaries не ловят"
        copy="Boundary не стоит понимать как глобальный try/catch для React-приложения. Здесь видно, что event handlers и async callbacks живут вне render-пути и требуют отдельной обработки."
      />

      <Panel>
        <NonCaughtLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Event handler"
          value="Outside render"
          hint="Ошибка уже произошла после render, поэтому boundary до неё не дотянется."
        />
        <MetricCard
          label="Timer / promise"
          value="Async gap"
          hint="Любой callback, ушедший во внешний event loop, уже не принадлежит boundary автоматически."
          tone="accent"
        />
        <MetricCard
          label="Практический ход"
          value="Promote to state"
          hint="Если вы переводите async-сбой в render через state, boundary снова может изолировать UI."
          tone="cool"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
