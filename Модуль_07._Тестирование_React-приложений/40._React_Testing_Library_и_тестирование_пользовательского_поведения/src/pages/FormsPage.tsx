import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { FeedbackFormLab } from '../components/testing-library/FeedbackFormLab';
import { projectStudyByLab } from '../lib/project-study';

export function FormsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Forms and Errors"
        title="Формы тестируются как поток ввода, ошибок и подтверждения результата"
        copy="Хороший RTL-тест на форму смотрит на поля, submit, alerts, status banners и доступный текст ошибок, а не на внутренние validator calls."
        aside={<StatusPill tone="success">form behavior</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Error surface"
          value="role=alert"
          hint="Ошибка должна быть не только текстом, но и доступным сигналом для пользователя."
        />
        <MetricCard
          label="Success surface"
          value="role=status"
          hint="Успешное завершение сценария лучше фиксировать через status banner, а не через private flag."
          tone="accent"
        />
        <MetricCard
          label="Main rule"
          value="input -> submit -> UI"
          hint="Порядок проверки должен повторять реальный поток ввода и реакции интерфейса."
          tone="cool"
        />
      </div>

      <FeedbackFormLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.forms} />
      </Panel>
    </div>
  );
}
