import { ArchitecturePlaybookLab } from '../components/error-boundaries/ArchitecturePlaybookLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ArchitecturePage() {
  const study = projectStudies.architecture;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Архитектура безопасной деградации"
        copy="Boundary имеет архитектурный смысл только тогда, когда его placement отражает реальную структуру риска в интерфейсе. Здесь вы подбираете слой boundary под риск, shared state, критичность и наличие сторонних виджетов."
      />

      <Panel>
        <ArchitecturePlaybookLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Widget layer"
          value="Max locality"
          hint="Лучший выбор для графиков, editors, embeds и прочих нестабильных islands."
          tone="cool"
        />
        <MetricCard
          label="Route layer"
          value="Shared recovery"
          hint="Подходит, когда несколько панелей завязаны на общий источник данных и единый recovery flow."
        />
        <MetricCard
          label="Shell safeguard"
          value="Last resort"
          hint="Нужен как последняя страховка, но не должен быть единственным boundary во всём приложении."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
