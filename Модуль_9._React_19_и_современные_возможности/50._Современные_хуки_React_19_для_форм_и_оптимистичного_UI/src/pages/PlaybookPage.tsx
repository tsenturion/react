import { HooksPlaybookLab } from '../components/form-hooks/HooksPlaybookLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Современные form hooks нужно выбирать по структуре async потока, а не по новизне API"
        copy="Здесь вы проверяете, когда достаточно plain action, когда нужен returned state, когда важен nested pending и когда optimistic UI требует отдельного слоя и rollback-логики."
      />

      <HooksPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab['hooks-playbook'].files}
        snippets={projectStudyByLab['hooks-playbook'].snippets}
      />
    </div>
  );
}
