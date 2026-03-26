import { InvocationFlowLab } from '../components/server-functions-labs/InvocationFlowLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function InvocationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Invocation flow"
        title="Как меняется путь от submit до серверной мутации, когда между формой и сервером исчезает часть ручного API-клея"
        copy="Server Function не отменяет сеть и не убирает границы. Но она сокращает число ручных шагов между формой и серверной логикой: меньше промежуточного glue-кода, меньше дублирования контракта и более прямой full-stack поток."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Меньше glue не означает отсутствие архитектуры
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Важна не магия вызова, а то, где живут права, валидация, сериализация и
              точка возврата результата обратно в UI.
            </p>
          </div>
        }
      />

      <InvocationFlowLab />

      <ProjectStudy
        files={projectStudyByLab.invocation.files}
        snippets={projectStudyByLab.invocation.snippets}
      />
    </div>
  );
}
