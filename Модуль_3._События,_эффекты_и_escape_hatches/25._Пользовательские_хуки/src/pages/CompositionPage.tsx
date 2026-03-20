import { WorkspaceCompositionLab } from '../components/custom-hooks/WorkspaceCompositionLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function CompositionPage() {
  const study = projectStudies.composition;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Композиция smaller hooks"
        copy="Custom hook редко существует один. Намного чаще он собирает smaller hooks в screen-level модель, где уже видно, как фильтры, persistent preference и история действий образуют единый workflow."
      />

      <Panel>
        <WorkspaceCompositionLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Смысл композиции"
          value="Один workflow"
          hint="Несколько hooks должны складываться в одну историю пользовательского экрана."
          tone="cool"
        />
        <MetricCard
          label="Риск"
          value="Скрытый хаос"
          hint="Если composed hook просто прячет беспорядок, читать код становится сложнее, а не проще."
          tone="accent"
        />
        <MetricCard
          label="Практика"
          value="Sync + UI"
          hint="localStorage, выбор карточки и derived list держатся в одном контракте."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
