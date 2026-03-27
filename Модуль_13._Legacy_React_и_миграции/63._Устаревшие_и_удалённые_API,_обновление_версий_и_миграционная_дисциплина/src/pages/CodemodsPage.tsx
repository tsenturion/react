import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { CodemodReleaseLab } from '../components/migration-labs/CodemodReleaseLab';
import { projectStudyByLab } from '../lib/project-study';

export function CodemodsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Codemods & Release Channels"
        title="Codemods ускоряют синтаксическую часть миграции, а release channels управляют риском и типом среды"
        copy="На этой странице codemods и release channels рассматриваются вместе, потому что в реальной миграции они часто смешиваются. Один отвечает за механические замены, другой — за то, насколько вообще допустимо делать такие изменения в выбранной среде."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Tooling is not strategy</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Полезный codemod не делает upgrade plan зрелым сам по себе. Он только
              убирает часть ручной рутины.
            </p>
          </div>
        }
      />

      <CodemodReleaseLab />

      <Panel className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Release notes</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Их лучше читать как список hypotheses: какие assumptions могли устареть, какие
            APIs убраны и где стоит усилить тестовый барьер.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Codemods</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Они полезны там, где проблема действительно синтаксическая. Но helpers,
            wrappers, supporting code и third-party adapters почти всегда требуют ручного
            reasoning.
          </p>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Слепой rollout"
        before="Команда берет самый новый канал и прогоняет codemod без разграничения между production upgrade и исследованием будущих API."
        afterTitle="Осмысленный rollout"
        after="Канал выбирается по задаче, codemods запускаются точечно, а нестандартные surfaces сразу уходят в ручной audit."
      />

      <ProjectStudy
        files={projectStudyByLab.codemods.files}
        snippets={projectStudyByLab.codemods.snippets}
      />
    </div>
  );
}
