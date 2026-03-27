import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { RefMigrationLab } from '../components/legacy-api-labs/RefMigrationLab';
import { describeRefMigration } from '../lib/ref-migration-model';
import { projectStudyByLab } from '../lib/project-study';

const comparisonChoices = [
  describeRefMigration('dom'),
  describeRefMigration('forward-ref'),
  describeRefMigration('ref-as-prop'),
] as const;

export function RefMigrationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Refs migration"
        title="От createRef и forwardRef к React 19 ref-as-prop: тот же imperative мост, но с более коротким API"
        copy="Refs остаются escape hatch. React 19 не меняет их природу, но меняет ergonomics: там, где раньше нужен был forwardRef wrapper, теперь часто достаточно ref-as-prop. Важно видеть не только новый синтаксис, но и старые слои совместимости, которые ещё долго будут жить рядом."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Escape hatch</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Даже современный ref-as-prop не делает refs “обычным каналом данных”: это
              по-прежнему точечный imperative bridge.
            </p>
          </div>
        }
      />

      <Panel className="grid gap-4 md:grid-cols-3">
        {comparisonChoices.map((choice) => (
          <div
            key={choice.title}
            className="rounded-[24px] border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">{choice.title}</h3>
              <StatusPill tone={choice.tone}>{choice.tone}</StatusPill>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{choice.note}</p>
          </div>
        ))}
      </Panel>

      <RefMigrationLab />

      <BeforeAfter
        beforeTitle="forwardRef wrapper era"
        before="Даже простой passthrough к DOM input требует отдельную обёртку с forwardRef, что добавляет ceremony и ещё один слой чтения."
        afterTitle="React 19 ref-as-prop"
        after="Если компонент просто прокидывает ref дальше, тот же путь становится короче. Но сам imperative характер ref от этого не исчезает."
      />

      <ProjectStudy
        files={projectStudyByLab.refs.files}
        snippets={projectStudyByLab.refs.snippets}
      />
    </div>
  );
}
