import { RouteCodeSplitLab } from '../components/lazy-loading/RouteCodeSplitLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function RouteSplitPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Route code splitting"
        title="Маршрут часто становится естественной границей для code splitting"
        copy="Здесь видно, как route-level split отличается от дробления отдельных controls. Сам shell урока уже использует lazy pages, поэтому тема выражена и в устройстве текущего приложения."
      />

      <RouteCodeSplitLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['route-splitting']} />
      </Panel>
    </div>
  );
}
