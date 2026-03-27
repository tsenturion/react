import { WorkflowPlaybookLab } from '../components/profiling/WorkflowPlaybookLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function WorkflowPlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Рабочий процесс важнее любого отдельного инструмента"
        copy="Здесь вы переводите симптом в диагностическую стратегию: где начинать, какую гипотезу проверять первой и как не перепутать slow React commit с layout, paint или network cost."
      />

      <WorkflowPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab['workflow-playbook'].files}
        snippets={projectStudyByLab['workflow-playbook'].snippets}
      />
    </div>
  );
}
