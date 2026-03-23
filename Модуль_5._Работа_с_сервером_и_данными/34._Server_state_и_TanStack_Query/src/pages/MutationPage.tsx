import { MutationInvalidationLab } from '../components/server-state/MutationInvalidationLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function MutationPage() {
  const study = projectStudies.mutations;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Server mutations и invalidation"
        copy="TanStack Query закрывает не только чтение, но и server mutations. Здесь видно, как `useMutation` связан с invalidation и почему сама мутация не синхронизирует query cache автоматически."
      />

      <Panel>
        <MutationInvalidationLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Mutation"
          value="Server write"
          hint="Изменение данных живёт отдельно от чтения и требует собственного lifecycle."
          tone="cool"
        />
        <MetricCard
          label="Invalidate"
          value="Refresh affected queries"
          hint="После успешной записи надо решить, какие cache entries уже устарели."
        />
        <MetricCard
          label="Main risk"
          value="No automatic sync"
          hint="Если не обновить query cache, UI останется в старой серверной реальности."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
