import { UnifiedFeedbackFlowLab } from '../components/form-hooks/UnifiedFeedbackFlowLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function UnifiedFlowPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Pending / Error / Result UX"
        title="Новые hooks наиболее полезны там, где форма должна пройти полный async цикл"
        copy="Эта лаборатория соединяет useActionState, useFormStatus и useOptimistic в одном submit-потоке. Так видно, как меняется проектирование формы, если мгновенный отклик, pending и итог сервера нужно выразить явно и без ручного glue-кода."
      />

      <UnifiedFeedbackFlowLab />

      <ProjectStudy
        files={projectStudyByLab['pending-error-result'].files}
        snippets={projectStudyByLab['pending-error-result'].snippets}
      />
    </div>
  );
}
