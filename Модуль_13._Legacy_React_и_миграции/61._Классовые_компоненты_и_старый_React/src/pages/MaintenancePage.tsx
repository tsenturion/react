import { ErrorBoundariesLab } from '../components/legacy-react-labs/ErrorBoundariesLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function MaintenancePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Maintenance and migration"
        title="Как поддерживать legacy React без хаотичного переписывания: class-based boundaries, reset strategies и выбор зоны миграции"
        copy="Старый React лучше поддерживается не через тотальный rewrite, а через ясные границы ответственности. Сначала локализуйте падение и legacy surface, затем выбирайте, где классы ещё уместны, а где уже мешают."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Classes still have a job</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Error boundaries остаются практическим class-based API даже в современном
              React.
            </p>
          </div>
        }
      />

      <ErrorBoundariesLab />

      <ProjectStudy
        files={projectStudyByLab.maintenance.files}
        snippets={projectStudyByLab.maintenance.snippets}
      />
    </div>
  );
}
