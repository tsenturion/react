import { ActionStateLab } from '../components/form-actions/ActionStateLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function ActionStatePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useActionState"
        title="useActionState возвращает результат submit как состояние action"
        copy="Здесь validation, pending и success-state живут вокруг одного async action. Это меняет роль submit-логики: она перестаёт быть набором разрозненных эффектов и становится частью модели формы."
      />

      <ActionStateLab />

      <ProjectStudy
        files={projectStudyByLab['use-action-state'].files}
        snippets={projectStudyByLab['use-action-state'].snippets}
      />
    </div>
  );
}
