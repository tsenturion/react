import { ArchitectureAdvisorLab } from '../components/server-state/ArchitectureAdvisorLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ArchitecturePage() {
  const study = projectStudies.architecture;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Когда TanStack Query действительно нужен"
        copy="Здесь вы подбираете архитектуру не по моде, а по нагрузке на слой данных: shared cache, retries, freshness strategy, mutations и reuse между экранами."
      />

      <Panel>
        <ArchitectureAdvisorLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Simple screen"
          value="Local fetch is enough"
          hint="Если data-flow одноразовый и не растёт, отдельный query layer может быть лишним."
          tone="cool"
        />
        <MetricCard
          label="Growing complexity"
          value="Dedicated hook"
          hint="Промежуточный шаг полезен, когда transport-шум уже мешает компоненту, но cache layer ещё не обязателен."
        />
        <MetricCard
          label="Server-state layer"
          value="TanStack Query"
          hint="Нужен там, где важны shared cache, stale policy, retries, invalidation и reuse."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
