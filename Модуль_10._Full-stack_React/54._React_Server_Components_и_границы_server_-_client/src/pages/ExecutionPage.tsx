import { ExecutionBoundaryLab } from '../components/rsc-labs/ExecutionBoundaryLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ExecutionPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Execution boundaries"
        title="Какие части экрана выгодно оставить server, а какие обязаны стать client"
        copy="На этой странице границы можно двигать руками. Именно здесь хорошо видно, что RSC меняют не только import-ы, но и стоимость bundle, количество bridge-запросов и размер hydrate graph."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Server default не означает server everywhere
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Client слой нужен там, где есть реальная browser-интерактивность. Ошибка
              начинается тогда, когда в client уходит весь surrounding tree.
            </p>
          </div>
        }
      />

      <ExecutionBoundaryLab />

      <ProjectStudy
        files={projectStudyByLab.execution.files}
        snippets={projectStudyByLab.execution.snippets}
      />
    </div>
  );
}
