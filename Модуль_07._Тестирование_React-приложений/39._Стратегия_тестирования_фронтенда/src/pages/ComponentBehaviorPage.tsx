import { Panel, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { BehaviorWorkbench } from '../components/testing-strategy/BehaviorWorkbench';
import { projectStudyByLab } from '../lib/project-study';

export function ComponentBehaviorPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Component Tests"
        title="Component test должен видеть то, что видит пользователь: поля, кнопки, предупреждения и доступные роли"
        copy="Компонент ниже намеренно построен вокруг доступных лейблов, disabled state, live feedback и user-visible banner. Именно это и проверяют component tests в текущем проекте."
        aside={<StatusPill tone="success">behavior-first</StatusPill>}
      />

      <BehaviorWorkbench />

      <Panel className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">
          Смысл component-теста здесь не в том, чтобы узнать, какое значение лежит в
          `useState`, а в том, чтобы доказать:
        </p>
        <ul className="space-y-2 text-sm leading-6 text-slate-700">
          <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            кнопка действительно заблокирована, пока сценарий невалиден;
          </li>
          <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            предупреждение и баннер появляются только после действий пользователя;
          </li>
          <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            доступный UI можно найти по ролям и лейблам, а не по className или внутренним
            id.
          </li>
        </ul>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab.component} />
      </Panel>
    </div>
  );
}
