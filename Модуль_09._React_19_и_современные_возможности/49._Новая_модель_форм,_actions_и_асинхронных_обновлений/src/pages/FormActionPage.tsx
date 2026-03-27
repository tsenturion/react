import { ActionBasicsLab } from '../components/form-actions/ActionBasicsLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function FormActionPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Form action"
        title="Форма может запускать async submit напрямую"
        copy="На этой странице submit-логика живёт в `action` самой формы. Payload приходит как `FormData`, а история результатов обновляется после завершения async action без отдельной ручной orchestration-цепочки."
      />

      <ActionBasicsLab />

      <ProjectStudy
        files={projectStudyByLab['form-action'].files}
        snippets={projectStudyByLab['form-action'].snippets}
      />
    </div>
  );
}
