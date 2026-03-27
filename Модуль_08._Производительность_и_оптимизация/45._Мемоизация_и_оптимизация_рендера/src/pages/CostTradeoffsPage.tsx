import { MemoCostAdvisorLab } from '../components/memoization/MemoCostAdvisorLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function CostTradeoffsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Cost and trade-offs"
        title="Цена мемоизации должна быть ниже той работы, которую вы реально удерживаете от повторения"
        copy="Последняя страница собирает тему обратно в decision model: где есть измеренный лаг, дорогой subtree и стабильный prop contract, а где useMemo/useCallback только усложнят dependencies и чтение кода."
        aside={<StatusPill tone="error">avoid cargo cult</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Преждевременная мемоизация"
        before="Hook добавляется на всякий случай, хотя лаг не измерен, вычисление почти бесплатное, а child ниже по дереву вообще не зависит от referential equality."
        afterTitle="Измеренная мемоизация"
        after="Вы сначала подтверждаете bottleneck, затем выбираете узкую точку применения и только после этого добавляете memo boundary или stable derived values."
      />

      <MemoCostAdvisorLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['cost-tradeoffs']} />
      </Panel>
    </div>
  );
}
