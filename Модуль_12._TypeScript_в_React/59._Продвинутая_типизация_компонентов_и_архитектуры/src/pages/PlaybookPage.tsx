import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { AdvancedTypingPlaybookLab } from '../components/advanced-types-labs/AdvancedTypingPlaybookLab';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Advanced typing лучше раскатывать по типу проблемы, а не как тотальный rewrite всей кодовой базы"
        copy="В финальной лаборатории выбираются pain point, зрелость команды и масштаб rollout. Это показывает, что reducers, generics и design-system typing окупаются в разных местах и не требуют одинаковой стратегии внедрения."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Rollout важнее синтаксической полноты</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если типы появляются быстрее, чем у проекта возникают ясные contracts, они
              создают шум вместо пользы.
            </p>
          </div>
        }
      />

      <Panel>
        <AdvancedTypingPlaybookLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Rollout без стратегии"
        before="Команда пытается generic-типизировать всё подряд, получает сложные utility types и быстро теряет уверенность, где типы помогают, а где мешают."
        afterTitle="Rollout по pain points"
        after="Сначала оформляются самые дорогие ошибки: reducer transitions, reusable API contracts или design-system recipes. После этого advanced typing масштабируется уже на устойчивые слои."
      />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
