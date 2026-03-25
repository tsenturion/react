import { ReactProfilerLab } from '../components/profiling/ReactProfilerLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function ReactProfilerPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="React Profiler"
        title="Profiler показывает стоимость commit, а не просто ощущение тяжёлого интерфейса"
        copy="Здесь вы разбираете, как actual duration, base duration и scope profiling помогают отличить дорогой subtree от шумного, но дешёвого набора обновлений."
      />

      <ReactProfilerLab />

      <ProjectStudy
        files={projectStudyByLab['react-profiler'].files}
        snippets={projectStudyByLab['react-profiler'].snippets}
      />
    </div>
  );
}
