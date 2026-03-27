import { TransitionPriorityLab } from '../components/concurrent/TransitionPriorityLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function TransitionPriorityPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useTransition"
        title="useTransition помогает отделить срочный input от тяжёлой фоновой перерисовки"
        copy="На этой странице видно, как одна и та же строка поиска может вести себя по-разному: либо каждый символ тащит expensive list сразу, либо список обновляется как background work, а ввод остаётся живым."
      />

      <TransitionPriorityLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['transition-priority']} />
      </Panel>
    </div>
  );
}
