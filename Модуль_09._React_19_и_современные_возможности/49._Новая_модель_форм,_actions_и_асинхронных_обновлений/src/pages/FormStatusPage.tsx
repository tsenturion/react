import { FormStatusWorkflowLab } from '../components/form-actions/FormStatusWorkflowLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function FormStatusPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useFormStatus"
        title="Компоненты внутри формы видят pending и текущий payload напрямую"
        copy="Эта страница показывает, как `useFormStatus` делает асинхронный submit наблюдаемым изнутри самой формы. Pending indicator и snapshot отправляемых полей не требуют отдельного bridge через parent state."
      />

      <FormStatusWorkflowLab />

      <ProjectStudy
        files={projectStudyByLab['form-status'].files}
        snippets={projectStudyByLab['form-status'].snippets}
      />
    </div>
  );
}
