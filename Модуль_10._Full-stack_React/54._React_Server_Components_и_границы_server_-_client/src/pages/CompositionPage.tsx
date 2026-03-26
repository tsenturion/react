import { CompositionBoundaryLab } from '../components/rsc-labs/CompositionBoundaryLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function CompositionPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Server/client composition"
        title="Как смешанное дерево собирается без нарушения import direction"
        copy="Главный вопрос этой страницы: кто кого имеет право импортировать и как передавать server output в client wrapper так, чтобы граница оставалась корректной."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Client wrapper != право импортировать server child
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если server content нужен внутри client блока, чаще всего правильная
              композиция проходит через parent server component и slot/children.
            </p>
          </div>
        }
      />

      <CompositionBoundaryLab />

      <ProjectStudy
        files={projectStudyByLab.composition.files}
        snippets={projectStudyByLab.composition.snippets}
      />
    </div>
  );
}
