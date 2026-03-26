import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { ProfilingDebugLab } from '../components/compiler-labs/ProfilingDebugLab';
import { projectStudyByLab } from '../lib/project-study';

export function ProfilingPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Profiling"
        title="Как проверять compiler rollout по реальному поведению: commit time, rerender reasons и interaction latency"
        copy="React Compiler имеет смысл тогда, когда его эффект можно показать в одном и том же interaction сценарии до и после включения. Эта страница заставляет читать тему через profiler workflow, а не через вкусовое впечатление от кода."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Profiler before syntax</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Сначала симптом и trace, потом compiler. Не наоборот.
            </p>
          </div>
        }
      />

      <ProfilingDebugLab />

      <ProjectStudy
        files={projectStudyByLab.profiling.files}
        snippets={projectStudyByLab.profiling.snippets}
      />
    </div>
  );
}
