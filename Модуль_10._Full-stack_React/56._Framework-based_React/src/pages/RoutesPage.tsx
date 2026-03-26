import { RouteStructureLab } from '../components/framework-labs/RouteStructureLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function RoutesPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Route modules"
        title="Как framework перестраивает дерево проекта вокруг экранов, layouts, loaders и actions"
        copy="Эта лаборатория показывает, что в framework-first React структура проекта выражает ownership маршрута. Экран больше не живёт как отдельный компонент, которому “где-то рядом” помогают API и hooks."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Route tree начинает владеть архитектурой экрана
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Это особенно важно там, где есть nested layouts, protected areas и разные
              rendering surfaces внутри одного продукта.
            </p>
          </div>
        }
      />

      <RouteStructureLab />

      <ProjectStudy
        files={projectStudyByLab.routes.files}
        snippets={projectStudyByLab.routes.snippets}
      />
    </div>
  );
}
