import { StartTransitionLab } from '../components/concurrent/StartTransitionLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function StartTransitionPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="startTransition"
        title="Imported startTransition удобен для тяжёлых screen updates без отдельного pending hook"
        copy="Здесь heavy workspace switch запускается императивно. Это хороший сценарий, чтобы увидеть, где хватает plain `startTransition`, а где всё-таки нужен `useTransition` с `isPending`."
      />

      <StartTransitionLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['start-transition']} />
      </Panel>
    </div>
  );
}
