import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { DataStructureLab } from '../components/performance/DataStructureLab';
import { projectStudyByLab } from '../lib/project-study';

export function DataStructurePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Data structure"
        title="Иногда тормозит не React, а объём работы, который вы сами описали"
        copy="Если каждое изменение гоняет большие nested структуры через filter, map и sort, проблема не исчезнет только от смены рендер-трюка. Важно смотреть на форму данных и candidate set, который попадает в вычисление."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">shape changes cost</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Один и тот же UI можно поддерживать с очень разной ценой вычислений.
            </p>
          </div>
        }
      />

      <DataStructureLab />

      <BeforeAfter
        beforeTitle="Nested traversal"
        before="Каждый рендер заново обходит секции, уроки и только потом отбрасывает лишнее."
        afterTitle="Indexed projection"
        after="Фильтр стартует с более узкого набора данных и тратит меньше шагов до итогового списка."
      />

      <ProjectStudy {...projectStudyByLab['data-structure']} />
    </div>
  );
}
