import { DeferredValueLab } from '../components/priority-async/DeferredValueLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function DeferredValuePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useDeferredValue"
        title="useDeferredValue даёт свежий input и отстающее heavy-представление"
        copy="Здесь вы видите современный сценарий search/filter UI, где raw query обновляется сразу, а тяжёлое результирующее представление догоняет его отдельно. Это не debounce и не замена network-level контроля."
      />

      <DeferredValueLab />

      <ProjectStudy
        files={projectStudyByLab['deferred-value'].files}
        snippets={projectStudyByLab['deferred-value'].snippets}
      />
    </div>
  );
}
