import { Panel, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { ReleaseWorkbench } from '../components/testing-strategy/ReleaseWorkbench';
import { projectStudyByLab } from '../lib/project-study';

export function IntegrationWorkflowPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Integration Tests"
        title="Integration test проверяет согласованность нескольких частей UI, а не один isolated widget"
        copy="В этой лаборатории важна не отдельная кнопка, а то, как scope, риски, набор checks и итоговый release verdict влияют друг на друга в одном пользовательском сценарии."
        aside={<StatusPill tone="success">workflow-level</StatusPill>}
      />

      <ReleaseWorkbench />

      <Panel className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">
          Такой сценарий уже плохо описывается unit-тестами отдельных функций и ещё не
          обязательно требует браузерного E2E. Здесь integration-level покрытие даёт
          лучший баланс цены и уверенности.
        </p>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab.integration} />
      </Panel>
    </div>
  );
}
