import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { MigrationWorkflowLab } from '../components/migration-labs/MigrationWorkflowLab';
import { projectStudyByLab } from '../lib/project-study';

export function MigrationWorkflowPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Migration workflow"
        title="Обновление версии React становится управляемым только тогда, когда оно оформлено как sequence шагов и доказательств"
        copy="Финальная страница собирает всю тему вместе: inventory deprecated API, codemods, проверка assumptions, test suite, release channels и rollout. Здесь видно, что migration discipline — это не один инструмент, а связанный рабочий процесс."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Workflow over patch</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Завершённая миграция определяется не количеством заменённых вызовов, а
              качеством собранных доказательств.
            </p>
          </div>
        }
      />

      <MigrationWorkflowLab />

      <BeforeAfter
        beforeTitle="Миграция как patch"
        before="Работа сводится к набору исправленных мест в коде без общей карты рисков, порядка шагов и доказательств."
        afterTitle="Миграция как change program"
        after="Команда заранее знает blockers, слои доказательств, release channel и критерии того, что обновление действительно завершено."
      />

      <ProjectStudy
        files={projectStudyByLab.workflow.files}
        snippets={projectStudyByLab.workflow.snippets}
      />
    </div>
  );
}
