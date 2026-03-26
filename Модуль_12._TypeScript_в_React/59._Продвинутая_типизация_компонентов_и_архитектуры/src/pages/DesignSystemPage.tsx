import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { DesignSystemTypingLab } from '../components/advanced-types-labs/DesignSystemTypingLab';
import { projectStudyByLab } from '../lib/project-study';

export function DesignSystemPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Design-system typing"
        title="Typed recipes и token maps укрепляют primitive layer лучше, чем набор свободных строк"
        copy="Здесь design-system primitive получает recipe union, а token classes выводятся из typed maps. Смотрите, как variants, modes и semantics держатся синхронно в одном контракте."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Variant name = часть публичного API</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если название variant доступно снаружи, оно должно быть связано и с token
              map, и с tests, и с документацией.
            </p>
          </div>
        }
      />

      <Panel>
        <DesignSystemTypingLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Class strings scattered"
        before="Размер, тон и режим действия разъезжаются между JSX, class maps и документацией, поэтому новый variant добавляется только наполовину."
        afterTitle="Typed recipe layer"
        after="PrimitiveRecipe связывает публичный режим компонента с token maps и не даёт silently забыть часть поддерживаемых вариантов."
      />

      <ProjectStudy
        files={projectStudyByLab['design-system'].files}
        snippets={projectStudyByLab['design-system'].snippets}
      />
    </div>
  );
}
