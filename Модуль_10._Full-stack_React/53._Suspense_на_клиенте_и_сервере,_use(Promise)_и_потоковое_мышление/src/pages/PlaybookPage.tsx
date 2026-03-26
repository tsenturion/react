import { SuspensePlaybookLab } from '../components/suspense-labs/SuspensePlaybookLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Как выбирать Suspense-подход без догматизма"
        copy="Финальная лаборатория собирает всё вместе: boundaries, lazy, use(Promise), HTML до JS и server streaming. Здесь выбор строится не по модности API, а по устройству конкретного экрана."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Не каждый loading state нужно переводить в Suspense
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если экран маленький и не раскрывается частями, простая локальная индикация
              иногда остаётся более честным решением.
            </p>
          </div>
        }
      />

      <SuspensePlaybookLab />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
