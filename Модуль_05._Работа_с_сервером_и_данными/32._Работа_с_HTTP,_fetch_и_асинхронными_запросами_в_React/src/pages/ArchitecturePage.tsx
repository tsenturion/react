import { FetchingArchitectureLab } from '../components/http-fetch/FetchingArchitectureLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ArchitecturePage() {
  const study = projectStudies.architecture;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Архитектура data fetching без useEffect-хаоса"
        copy="Чем больше у запроса lifecycle, retries, abort, shared use и stale-защиты, тем опаснее держать его как набор ручных флагов прямо в компоненте. Здесь вы подбираете подход под реальную сложность сценария."
      />

      <Panel>
        <FetchingArchitectureLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Inline handler"
          value="Simple and explicit"
          hint="Хорош для редкого ручного fetch по кнопке без сложного lifecycle."
        />
        <MetricCard
          label="Dedicated hook"
          value="Middle layer"
          hint="Нужен, когда fetch уже требует abort, retry, lifecycle и защиты от stale responses."
          tone="cool"
        />
        <MetricCard
          label="Server-state layer"
          value="Next step"
          hint="Когда появляются shared cache и cross-screen reuse, пора подниматься выше локального data-fetching hook."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
