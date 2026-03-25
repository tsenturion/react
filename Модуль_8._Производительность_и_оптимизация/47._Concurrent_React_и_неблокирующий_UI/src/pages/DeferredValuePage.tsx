import { DeferredValueLab } from '../components/concurrent/DeferredValueLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function DeferredValuePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useDeferredValue"
        title="useDeferredValue полезен, когда тяжёлый consumer может отставать от input без потери смысла"
        copy="Эта лаборатория показывает разницу между текущим значением input и его deferred-версией. Важно, что быстрым остаётся именно сам ввод, а не expensive subtree ниже."
      />

      <DeferredValueLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['deferred-value']} />
      </Panel>
    </div>
  );
}
