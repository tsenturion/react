import { ActionStateFeedbackLab } from '../components/form-hooks/ActionStateFeedbackLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function ActionStatePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useActionState"
        title="useActionState делает submit результатом самой формы, а не внешней state-машины"
        copy="Здесь форма локально показывает validation issues, server failure и успешный receipt через returned state action. Важна не просто экономия кода, а то, что submit получает явную и наблюдаемую структуру."
      />

      <ActionStateFeedbackLab />

      <ProjectStudy
        files={projectStudyByLab['use-action-state'].files}
        snippets={projectStudyByLab['use-action-state'].snippets}
      />
    </div>
  );
}
