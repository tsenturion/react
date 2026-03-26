import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { PolymorphicComponentsLab } from '../components/advanced-types-labs/PolymorphicComponentsLab';
import { projectStudyByLab } from '../lib/project-study';

export function PolymorphicComponentsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Polymorphic components"
        title="`as`-pattern меняет не только тег, но и саму семантику primitive"
        copy="В этой лаборатории один и тот же visual primitive рендерится как button, anchor и label. Смотрите, как меняются semantics, runtime effect и границы typed contract."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">Polymorphism нужен далеко не везде</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если primitive не живёт в shared layer и не переносит реальную семантику,
              проще и безопаснее оставить обычный компонент.
            </p>
          </div>
        }
      />

      <Panel>
        <PolymorphicComponentsLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Loose `as` prop"
        before="Компонент может рендериться чем угодно, но контракт перестаёт подсказывать, какие props нужны для выбранной семантики и какие accessibility-гарантии должны сохраниться."
        afterTitle="Typed polymorphic primitive"
        after="`as`-pattern ограничен и прозрачен: visual layer переносится, но semantics, link behavior и form binding остаются явной частью API."
      />

      <ProjectStudy
        files={projectStudyByLab.polymorphic.files}
        snippets={projectStudyByLab.polymorphic.snippets}
      />
    </div>
  );
}
