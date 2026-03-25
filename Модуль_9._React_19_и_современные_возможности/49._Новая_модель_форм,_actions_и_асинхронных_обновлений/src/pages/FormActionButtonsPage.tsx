import { FormActionButtonsLab } from '../components/form-actions/FormActionButtonsLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function FormActionButtonsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="formAction"
        title="Разные submit intents живут в разных кнопках формы"
        copy="Когда одна форма поддерживает несколько async outcomes, `formAction` позволяет вынести их в структуру кнопок. Так publish, review и draft перестают быть ветками внутри одного общего обработчика."
      />

      <FormActionButtonsLab />

      <ProjectStudy
        files={projectStudyByLab['form-action-buttons'].files}
        snippets={projectStudyByLab['form-action-buttons'].snippets}
      />
    </div>
  );
}
