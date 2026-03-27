import { ConcurrencyPlaybookLab } from '../components/concurrent/ConcurrencyPlaybookLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ConcurrencyPlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Concurrent playbook"
        title="Concurrent APIs работают лучше всего, когда причина лагов уже понята"
        copy="Финальная лаборатория помогает решить, нужен ли здесь `useTransition`, `startTransition`, `useDeferredValue` или проблема лежит в архитектуре, а не в приоритетах React."
      />

      <ConcurrencyPlaybookLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['concurrency-playbook']} />
      </Panel>
    </div>
  );
}
