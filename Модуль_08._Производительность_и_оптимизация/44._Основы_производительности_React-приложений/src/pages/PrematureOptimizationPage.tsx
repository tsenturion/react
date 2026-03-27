import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { OptimizationAdvisorLab } from '../components/performance/OptimizationAdvisorLab';
import { prematureOptimizationCards } from '../lib/performance-domain';
import { projectStudyByLab } from '../lib/project-study';

export function PrematureOptimizationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Premature optimization"
        title="Сначала назовите проблему, потом выбирайте оптимизацию"
        copy="Оптимизация полезна только тогда, когда она лечит измеренную причину. Если сначала добавить `memo`, refs и сложные обходные пути, код быстро становится тяжелее, а источник тормоза остаётся на месте."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">measure first</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Хорошая оптимизация начинается с формулировки: где lag, как часто и из-за
              чего.
            </p>
          </div>
        }
      />

      <OptimizationAdvisorLab />

      <Panel className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Частые anti-patterns
        </h3>
        <ul className="space-y-2 text-sm leading-6 text-slate-700">
          {prematureOptimizationCards.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              {item}
            </li>
          ))}
        </ul>
      </Panel>

      <BeforeAfter
        beforeTitle="Преждевременная оптимизация"
        before="Код уже усложнён, но ответ на вопрос «какой interaction реально медленный?» всё ещё не найден."
        afterTitle="Осознанная оптимизация"
        after="Сначала известны scenario, scope и bottleneck. Только после этого выбирается самый дешёвый архитектурный ход."
      />

      <ProjectStudy {...projectStudyByLab['premature-optimization']} />
    </div>
  );
}
