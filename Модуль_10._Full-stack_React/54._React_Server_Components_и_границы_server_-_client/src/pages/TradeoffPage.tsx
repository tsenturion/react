import { BundleTradeoffLab } from '../components/rsc-labs/BundleTradeoffLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function TradeoffPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Bundle and data trade-offs"
        title="Как выбранная граница влияет на bundle, hydration и доступность данных"
        copy="На этой странице сравниваются уже не отдельные компоненты, а целые архитектурные профили mixed приложения. Это помогает увидеть цену каждой стратегии на уровне системы."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Client-heavy остаётся рабочим, но дорогим</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Урок не делит решения на “правильные” и “неправильные”, а показывает, когда
              архитектурная цена начинает превышать практический выигрыш.
            </p>
          </div>
        }
      />

      <BundleTradeoffLab />

      <ProjectStudy
        files={projectStudyByLab.tradeoffs.files}
        snippets={projectStudyByLab.tradeoffs.snippets}
      />
    </div>
  );
}
