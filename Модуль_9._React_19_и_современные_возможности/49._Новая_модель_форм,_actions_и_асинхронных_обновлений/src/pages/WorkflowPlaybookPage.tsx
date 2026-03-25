import { WorkflowPlaybookLab } from '../components/form-actions/WorkflowPlaybookLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function WorkflowPlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Новая модель форм полезна, когда соответствует реальному submit flow"
        copy="Здесь вы сводите тему в практическую схему выбора. Важно не просто знать API, а понимать, когда форма действительно выигрывает от action-модели, а когда достаточно более простого решения."
      />

      <WorkflowPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab['workflow-playbook'].files}
        snippets={projectStudyByLab['workflow-playbook'].snippets}
      />
    </div>
  );
}
