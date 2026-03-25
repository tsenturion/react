import { ProductionDebugLab } from '../components/profiling/ProductionDebugLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function ProductionDebugPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Production debug"
        title="Настоящая диагностика связывает symptom, evidence и candidate fix"
        copy="В этой лаборатории инструментов уже несколько: component tree, Profiler и trace. Задача не собрать больше графиков, а быстрее сузить проблему до конкретного слоя приложения."
      />

      <ProductionDebugLab />

      <ProjectStudy
        files={projectStudyByLab['production-debug'].files}
        snippets={projectStudyByLab['production-debug'].snippets}
      />
    </div>
  );
}
