import { PriorityPlaybookLab } from '../components/priority-async/PriorityPlaybookLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Современные concurrent и visibility API нужно выбирать по типу проблемы, а не по новизне"
        copy="Эта лаборатория сводит тему урока в архитектурный playbook: где хватает обычного state, когда нужен transition, где полезен deferred read, когда оправдан useEffectEvent и в каком случае Activity действительно добавляет ценность."
      />

      <PriorityPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
