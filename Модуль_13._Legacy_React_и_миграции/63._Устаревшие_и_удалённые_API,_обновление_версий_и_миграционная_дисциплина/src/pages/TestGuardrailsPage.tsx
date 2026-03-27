import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { TestGuardrailLab } from '../components/migration-labs/TestGuardrailLab';
import { projectStudyByLab } from '../lib/project-study';

export function TestGuardrailsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Test suite as guardrail"
        title="Тесты во время миграции должны ловить реальные поведенческие провалы, а не подтверждать старые implementation details"
        copy="Эта страница нужна, чтобы увидеть разницу между “тесты в проекте есть” и “тесты реально защищают миграцию”. Важен не только сам слой тестов, но и то, какие поверхности обновления он способен увидеть: bootstrap, refs, forms, effects и интеграции."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Behavior over syntax</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Сильный migration suite проверяет не старое имя функции, а то, остался ли
              корректным пользовательский и системный поток.
            </p>
          </div>
        }
      />

      <TestGuardrailLab />

      <BeforeAfter
        beforeTitle="Формальное покрытие"
        before="В проекте много unit tests, но они почти не видят bootstrap, refs и интеграционные слои."
        afterTitle="Migration guardrail"
        after="Тестовый набор строится вокруг реальных migration-sensitive сценариев и поэтому может подтвердить новое поведение системы."
      />

      <ProjectStudy
        files={projectStudyByLab.tests.files}
        snippets={projectStudyByLab.tests.snippets}
      />
    </div>
  );
}
