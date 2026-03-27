import { QualityControlSystemLab } from '../components/tooling-labs/QualityControlSystemLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function QualityControlSystemPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Quality system"
        title="Tooling становится по-настоящему полезным, когда замыкается в контур качества"
        copy="DevTools помогает наблюдать, линтер предотвращает часть ошибок заранее, Rules of React ограничивают архитектурные решения, а тесты закрепляют найденные баги как guardrail. Здесь можно собрать этот контур из shape codebase и реальных gaps."
      />

      <QualityControlSystemLab />

      <section className="panel p-5 sm:p-6">
        <ProjectStudy {...projectStudyByLab.quality} />
      </section>
    </div>
  );
}
