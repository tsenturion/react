import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { SchemaBoundaryLab } from '../components/external-data-labs/SchemaBoundaryLab';
import { projectStudyByLab } from '../lib/project-study';

export function SchemaBoundaryPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Runtime schemas"
        title="Schema boundary: где raw payload перестаёт быть предположением и становится проверенными данными"
        copy="Здесь вы сравниваете не “TypeScript против Zod”, а `unsafe cast` против настоящего runtime parse. Это главный переход темы: внешние данные сначала проверяются, и только потом попадают в typed React-код."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">Boundary first</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Чем раньше schema поймает mismatch, тем меньше сырого payload попадёт в UI.
            </p>
          </div>
        }
      />

      <Panel>
        <SchemaBoundaryLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Loose assumption"
        before="`const item = payload as ExternalReviewItem` выглядит аккуратно, но не доказывает вообще ничего о форме реальных данных."
        afterTitle="Validated contract"
        after="`safeParse` разделяет valid branch и schema mismatch branch. Только в valid branch inferred type действительно заслужен."
      />

      <ProjectStudy
        files={projectStudyByLab.schemas.files}
        snippets={projectStudyByLab.schemas.snippets}
      />
    </div>
  );
}
