import { FormStatusInspectorLab } from '../components/form-hooks/FormStatusInspectorLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function FormStatusPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useFormStatus"
        title="useFormStatus даёт дочерним элементам формы ближайший pending и snapshot payload"
        copy="В этой лаборатории кнопка и status-панель узнают, что именно сейчас отправляется, напрямую из form context. Это убирает лишние loading-props и делает внутренний UX формы связным."
      />

      <FormStatusInspectorLab />

      <ProjectStudy
        files={projectStudyByLab['use-form-status'].files}
        snippets={projectStudyByLab['use-form-status'].snippets}
      />
    </div>
  );
}
