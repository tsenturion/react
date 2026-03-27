import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { DeprecatedDomApisLab } from '../components/migration-labs/DeprecatedDomApisLab';
import { projectStudyByLab } from '../lib/project-study';

export function DeprecatedApisPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Removed DOM APIs"
        title="findDOMNode, render, hydrate и unmountComponentAtNode важны не сами по себе, а как след старого root mental model"
        copy="На этой странице removed и deprecated API рассматриваются как сигналы более глубокой проблемы: старого представления о том, как React монтирует, гидратирует и размонтирует дерево, и какие helper-слои вокруг этого выросли в проекте."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">Removed in React 19</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Удаление API важно читать не как “сломали старую функцию”, а как смену
              контракта между root и приложением.
            </p>
          </div>
        }
      />

      <DeprecatedDomApisLab />

      <Panel className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Что ломает migration
          </p>
          <p className="mt-3 text-sm leading-6 text-rose-950">
            Не только сам вызов removed API, но и старые wrappers, тестовые harnesses,
            cleanup paths и implicit lifecycle assumptions рядом с ним.
          </p>
        </div>
        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Что помогает
          </p>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            Инвентаризация call sites, явный root lifecycle и проверка supporting code, а
            не только замена синтаксиса в основном entrypoint.
          </p>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Старый подход"
        before="container рассматривается как достаточно надёжная точка управления всем lifecycle дерева."
        afterTitle="Современный подход"
        after="root становится явным объектом с собственным lifecycle, а supporting code должен следовать той же модели."
      />

      <ProjectStudy
        files={projectStudyByLab.dom.files}
        snippets={projectStudyByLab.dom.snippets}
      />
    </div>
  );
}
