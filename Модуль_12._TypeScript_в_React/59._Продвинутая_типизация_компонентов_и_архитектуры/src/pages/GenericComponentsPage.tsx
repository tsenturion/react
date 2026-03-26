import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { GenericComponentsLab } from '../components/advanced-types-labs/GenericComponentsLab';
import { projectStudyByLab } from '../lib/project-study';

export function GenericComponentsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Generic APIs"
        title="Generics полезны тогда, когда abstraction повторяет форму взаимодействия, а не просто прячет JSX"
        copy="Здесь один generic list primitive обслуживает два разных типа сущностей. Смотрите, как reusable API переносится между ними, но при этом не теряет domain-specific selectors и detail view."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Сначала форма повторения, потом generic</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если одинаков только визуальный блок, но не interaction model, generic API
              обычно не нужен.
            </p>
          </div>
        }
      />

      <Panel>
        <GenericComponentsLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Over-generic abstraction"
        before="Компонент пытается охватить любой случай и требует длинный список callbacks, custom renderers и флагов, так что понять API становится труднее, чем написать две ясные реализации."
        afterTitle="Focused reusable API"
        after="Generic contract описывает именно повторяемую форму: selection, rendering, details. Предметные selectors остаются рядом со своей сущностью."
      />

      <ProjectStudy
        files={projectStudyByLab.generics.files}
        snippets={projectStudyByLab.generics.snippets}
      />
    </div>
  );
}
