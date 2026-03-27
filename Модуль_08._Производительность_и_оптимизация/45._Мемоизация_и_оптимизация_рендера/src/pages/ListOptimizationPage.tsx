import { ListOptimizationLab } from '../components/memoization/ListOptimizationLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ListOptimizationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="List optimization"
        title="Списки лучше всего показывают, работает ли ваша мемоизация как система, а не как отдельный hook"
        copy="На списке быстро видно, что row memoization без stable callbacks и stable derived arrays не даёт нужной локальности. Здесь можно сравнить широкий и удержанный render на одинаковом наборе rows."
        aside={<StatusPill tone="warn">rows multiply the cost</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Wide rerender"
        before="Unrelated shell-state задевает весь visible slice, потому что rows не удерживают стабильность props и callbacks."
        afterTitle="Contained rerender"
        after="memo rows, useMemo для visible slice и useCallback для handler вместе удерживают локальность и сохраняют render-budget списка."
      />

      <ListOptimizationLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['list-optimization']} />
      </Panel>
    </div>
  );
}
