import { EffectEventLab } from '../components/priority-async/EffectEventLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function EffectEventPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useEffectEvent"
        title="useEffectEvent оставляет effect подписанным, но даёт ему свежую логику реакции"
        copy="В этой лаборатории theme меняется часто, но внешний listener не должен пересоздаваться из-за чисто визуального контекста. useEffectEvent помогает отделить setup effect от актуального callback-поведения."
      />

      <EffectEventLab />

      <ProjectStudy
        files={projectStudyByLab['effect-event'].files}
        snippets={projectStudyByLab['effect-event'].snippets}
      />
    </div>
  );
}
