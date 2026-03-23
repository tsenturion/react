import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { InteractionSequenceLab } from '../components/testing-library/InteractionSequenceLab';
import { projectStudyByLab } from '../lib/project-study';

export function InteractionsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="User Interactions"
        title="Testing Library ведёт тест через действия пользователя, а не через прямой вызов обработчиков"
        copy="Если пользователь кликает, вводит текст и ждёт результат на экране, тест должен делать то же самое. Это и есть user-centric surface."
        aside={<StatusPill tone="warn">act by behavior</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Action source"
          value="userEvent"
          hint="Клики, ввод и tab-навигация должны идти через пользовательские действия, а не через прямые вызовы callback."
        />
        <MetricCard
          label="Async result"
          value="findByRole"
          hint="Если результат появляется позже, тест ждёт видимый DOM-эффект, а не внутренний флаг."
          tone="accent"
        />
        <MetricCard
          label="What not to assert"
          value="setState calls"
          hint="Внутренние вызовы сами по себе не подтверждают пользовательский сценарий."
          tone="cool"
        />
      </div>

      <BeforeAfter
        beforeTitle="Слишком низкий уровень"
        before="Тест напрямую вызывает onApply и проверяет, что локальный state изменился."
        afterTitle="Поведенческая проверка"
        after="Тест открывает панель, вводит запрос, нажимает кнопку и ждёт баннер результата через доступную роль."
      />

      <InteractionSequenceLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.interactions} />
      </Panel>
    </div>
  );
}
