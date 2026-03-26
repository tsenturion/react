import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { UiStatesLab } from '../components/typescript-labs/UiStatesLab';
import { projectStudyByLab } from '../lib/project-study';

export function UiStatesPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="UI states"
        title="Как типы данных и состояние экрана начинают работать вместе и убирают невозможные комбинации интерфейса"
        copy="На этой странице TypeScript уже влияет на устойчивость экрана напрямую: loading, error, empty и ready оформляются как явные ветки, а не как набор несвязанных флагов."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Флаги без модели быстро расходятся</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Discriminated union полезен тем, что новая ветка состояния вынуждает
              обновить UI осознанно, а не надеяться на случайный if.
            </p>
          </div>
        }
      />

      <UiStatesLab />

      <ProjectStudy
        files={projectStudyByLab.states.files}
        snippets={projectStudyByLab.states.snippets}
      />
    </div>
  );
}
