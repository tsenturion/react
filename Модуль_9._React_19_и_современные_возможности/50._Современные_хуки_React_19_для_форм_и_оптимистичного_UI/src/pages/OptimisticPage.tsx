import { OptimisticQueueLab } from '../components/form-hooks/OptimisticQueueLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function OptimisticPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useOptimistic"
        title="useOptimistic показывает ожидаемый результат заранее, но не путает его с server truth"
        copy="Здесь форма мгновенно добавляет карточку в ленту как optimistic overlay. Если сервер подтверждает действие, запись становится частью базового состояния; если отклоняет, optimistic UI откатывается."
      />

      <OptimisticQueueLab />

      <ProjectStudy
        files={projectStudyByLab['use-optimistic'].files}
        snippets={projectStudyByLab['use-optimistic'].snippets}
      />
    </div>
  );
}
