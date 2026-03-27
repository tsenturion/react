import { MemoBoundariesLab } from '../components/memoization/MemoBoundariesLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function MemoBoundariesPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="memo and prop equality"
        title="`memo` полезен только если вы действительно удерживаете стабильный prop contract"
        copy="На этой странице видно, что `memo` не отменяет parent render и не спасает child от новой object reference. Он нужен там, где downstream subtree действительно тяжёлый и props могут оставаться теми же по смыслу и по ссылке."
        aside={<StatusPill tone="success">boundary first</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Что ломает memo"
        before="Parent меняет только shell state, но child получает новый object prop и заново ререндерится, хотя визуально ничего не изменилось."
        afterTitle="Что помогает memo"
        after="Child получает стабильные primitive props или memoized derived object, поэтому unrelated parent render остаётся выше границы."
      />

      <MemoBoundariesLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['memo-boundaries']} />
      </Panel>
    </div>
  );
}
