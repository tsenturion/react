import { ConstraintsLab } from '../components/server-functions-labs/ConstraintsLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ConstraintsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Constraints"
        title="Какие правила и ограничения нельзя игнорировать при работе с `use server` и server boundaries"
        copy="Server Function особенно удобна на submit и click boundaries. Но как только сценарий упирается в browser APIs, несериализуемые значения или мгновенный onChange-цикл, граница начинает ломаться и требует другого решения."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">
              Server Function не заменяет browser event loop
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Она не читает `window`, DOM и не подходит для живого ввода по каждому
              символу. Для этого нужен client island.
            </p>
          </div>
        }
      />

      <BeforeAfter
        beforeTitle="Хрупкий паттерн"
        before="Серверную функцию пытаются использовать как универсальный обработчик для любого onChange, browser API и несериализуемого payload."
        afterTitle="Рабочий паттерн"
        after="Server boundary оставляют для явных submit/click действий и сериализуемых данных, а локальный интерактивный цикл держат в клиентском поддереве."
      />

      <ConstraintsLab />

      <ProjectStudy
        files={projectStudyByLab.constraints.files}
        snippets={projectStudyByLab.constraints.snippets}
      />
    </div>
  );
}
