import { BoundaryBasicsLab } from '../components/error-boundaries/BoundaryBasicsLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function BoundaryPage() {
  const study = projectStudies.boundaries;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Boundary basics"
        copy="Здесь вы видите базовый contract Error Boundary: ошибка возникает в render-пути дочернего subtree, boundary переводит этот участок в fallback UI и оставляет остальной интерфейс живым."
      />

      <Panel>
        <BoundaryBasicsLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Что boundary делает"
          value="Swap subtree"
          hint="Сломанный subtree заменяется fallback UI без полного падения страницы."
          tone="cool"
        />
        <MetricCard
          label="Что boundary не делает"
          value="Not all errors"
          hint="Boundary не является универсальным try/catch для всего JavaScript вокруг компонента."
        />
        <MetricCard
          label="Ключевая ценность"
          value="Local recovery"
          hint="Вы можете изолировать сбой и дать точечный recovery flow прямо рядом с проблемной частью."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
