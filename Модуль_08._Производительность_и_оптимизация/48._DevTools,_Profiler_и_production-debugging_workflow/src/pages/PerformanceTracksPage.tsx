import { PerformanceTracksLab } from '../components/profiling/PerformanceTracksLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function PerformanceTracksPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Browser Performance"
        title="Performance panel нужен там, где лаг может жить не только в React"
        copy="Trace связывает input, render, network, commit и paint. Это помогает отличить slow React subtree от browser-level bottleneck, layout jank или network waterfall."
      />

      <PerformanceTracksLab />

      <ProjectStudy
        files={projectStudyByLab['performance-tracks'].files}
        snippets={projectStudyByLab['performance-tracks'].snippets}
      />
    </div>
  );
}
