import { TransitionPriorityLab } from '../components/priority-async/TransitionPriorityLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function TransitionPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Transitions"
        title="useTransition и startTransition разделяют срочный ввод и фоновую перестройку интерфейса"
        copy="Эта лаборатория показывает, как input может оставаться urgent, а тяжёлая рабочая доска — обновляться с пониженным приоритетом. Отдельно видно, когда нужен pending через useTransition, а когда достаточно standalone startTransition."
      />

      <TransitionPriorityLab />

      <ProjectStudy
        files={projectStudyByLab.transitions.files}
        snippets={projectStudyByLab.transitions.snippets}
      />
    </div>
  );
}
