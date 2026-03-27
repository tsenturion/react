import { NavigationPlayground } from '../components/routing/NavigationPlayground';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function NavigationPage() {
  const study = projectStudies.navigation;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Навигация между экранами"
        copy="Один router даёт несколько способов перехода: `Link`, `NavLink` и `useNavigate`. Здесь вы сравниваете их не по синтаксису, а по роли в пользовательском сценарии."
      />

      <Panel>
        <NavigationPlayground />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Link"
          value="Declarative"
          hint="Подходит там, где переход является частью разметки и навигации."
          tone="cool"
        />
        <MetricCard
          label="NavLink"
          value="Active-aware"
          hint="Подходит для меню и мест, где текущий активный экран должен быть видим визуально."
        />
        <MetricCard
          label="useNavigate"
          value="Imperative"
          hint="Нужен там, где переход зависит от события, действия или завершения сценария."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
