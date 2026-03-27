import { ValidationLab } from '../components/forms/ValidationLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { createSignupForm } from '../lib/form-domain';
import { getProjectStudy } from '../lib/project-study';
import { buildValidationReport, validateSignupForm } from '../lib/validation-model';

export function ValidationPage() {
  const report = buildValidationReport(validateSignupForm(createSignupForm()));
  const study = getProjectStudy('validation');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Валидация и UX ошибок"
        copy="Хорошая форма не просто запрещает submit, а объясняет, что исправить, где именно находится ошибка и когда её имеет смысл показывать пользователю."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Error count"
          value={String(report.errorCount)}
          hint="Ошибки считаются из актуального form-state."
          tone="accent"
        />
        <MetricCard
          label="Visibility"
          value="touched or submit"
          hint="Сообщения не должны появляться случайно до первого meaningful взаимодействия."
        />
        <MetricCard
          label="Goal"
          value="clear feedback"
          hint={report.summary}
          tone="cool"
        />
      </div>

      <BeforeAfter
        beforeTitle="Если error-UX не привязан к полям"
        before="Пользователь видит общий fail-state, но не понимает, где и как исправить ввод."
        afterTitle="Если ошибка адресная и синхронна полю"
        after="Ввод, ошибка и доступность submit остаются в одном понятном потоке."
      />

      <ValidationLab />

      <Panel className="space-y-4">
        <CodeBlock label="Validation gate" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
