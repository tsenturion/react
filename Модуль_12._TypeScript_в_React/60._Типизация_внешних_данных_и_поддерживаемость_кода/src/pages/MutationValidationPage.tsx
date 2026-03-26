import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { MutationValidationLab } from '../components/external-data-labs/MutationValidationLab';
import { projectStudyByLab } from '../lib/project-study';

export function MutationValidationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Forms & mutations"
        title="Form payload и ответ мутации требуют одинаково честной проверки"
        copy="Пользовательский ввод и серверный response одинаково внешние по отношению к вашему приложению. Если schema стоит только на форме или только на ответе, половина mutation flow остаётся без контракта."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Two boundaries</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              В мутации обычно нужно валидировать и входящий payload, и исходящий ответ.
            </p>
          </div>
        }
      />

      <Panel>
        <MutationValidationLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Submit без явного контракта"
        before="Форма держит строки, сервер возвращает что-то похожее на ожидаемый объект, а реальные несоответствия раскрываются только дальше по потоку."
        afterTitle="Mutation с двумя schema checks"
        after="Сначала форма проходит parse, затем response снова проходит parse, и только после этого mutation считается завершённой корректно."
      />

      <ProjectStudy
        files={projectStudyByLab.mutations.files}
        snippets={projectStudyByLab.mutations.snippets}
      />
    </div>
  );
}
