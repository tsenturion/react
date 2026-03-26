import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { ValidatedRequestsLab } from '../components/external-data-labs/ValidatedRequestsLab';
import { projectStudyByLab } from '../lib/project-study';

export function ValidatedRequestsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Requests"
        title="Validated requests: почему `response.ok` ещё не означает, что экран действительно готов к рендеру"
        copy="В запросах нужно разделять минимум четыре ветки: loading, network error, schema error и ready/empty. Иначе ответ формально пришёл, но сломанный payload продолжает жить внутри приложения как будто он корректен."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Envelope matters</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Проверяется не только каждый item, но и структура всего ответа.
            </p>
          </div>
        }
      />

      <Panel>
        <ValidatedRequestsLab />
      </Panel>

      <BeforeAfter
        beforeTitle="После `.json()` сразу success"
        before="Экран считает запрос удачным сразу после ответа сервера, а nested mismatch всплывает позднее внутри списка или карточки."
        afterTitle="Success only after parse"
        after="Экран переходит в `success` только после schema validation, поэтому network и contract bugs больше не смешиваются."
      />

      <ProjectStudy
        files={projectStudyByLab.requests.files}
        snippets={projectStudyByLab.requests.snippets}
      />
    </div>
  );
}
