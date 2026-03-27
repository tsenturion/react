import { UseMemoDerivedLab } from '../components/memoization/UseMemoDerivedLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function UseMemoPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useMemo and derived values"
        title="`useMemo` нужен не для каждой переменной, а для дорогих или сравниваемых derived values"
        copy="Смотрите не на сам факт вычисления, а на то, участвует ли derived object в downstream сравнении и действительно ли expensive derive повторяется на unrelated render."
        aside={<StatusPill tone="warn">measure the derive</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Шумный вариант"
        before="Projection object пересоздаётся на каждый render shell и пробивает memo-child ниже по дереву, даже если фильтры не менялись."
        afterTitle="Осмысленный вариант"
        after="useMemo привязывает derived object только к реальным dependencies, поэтому shell-state не тянет за собой лишний expensive path."
      />

      <UseMemoDerivedLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['use-memo']} />
      </Panel>
    </div>
  );
}
