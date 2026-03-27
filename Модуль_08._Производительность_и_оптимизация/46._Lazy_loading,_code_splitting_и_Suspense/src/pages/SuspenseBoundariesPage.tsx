import { SuspenseBoundariesLab } from '../components/lazy-loading/SuspenseBoundariesLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function SuspenseBoundariesPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Suspense boundaries"
        title="Fallback-граница управляет тем, сколько интерфейса исчезает во время ожидания"
        copy="Локальная и глобальная границы на одном и том же heavy widget ведут себя совершенно по-разному. Разница здесь не косметическая, а архитектурная."
      />

      <SuspenseBoundariesLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['suspense-boundaries']} />
      </Panel>
    </div>
  );
}
