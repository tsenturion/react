import { ConcurrentSearchLab } from '../components/concurrent/ConcurrentSearchLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ConcurrentSearchPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Search and heavy lists"
        title="Реальный неблокирующий UI обычно комбинирует несколько concurrent-приёмов сразу"
        copy="На этой странице объединены срочный input, deferred query и transition для фильтров. Именно такой состав чаще всего встречается в list-heavy интерфейсе, а не isolated demo только одного hook."
      />

      <ConcurrentSearchLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['concurrent-search']} />
      </Panel>
    </div>
  );
}
