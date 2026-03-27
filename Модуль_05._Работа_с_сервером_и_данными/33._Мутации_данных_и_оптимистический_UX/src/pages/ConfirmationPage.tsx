import { ConfirmationGapLab } from '../components/mutations/ConfirmationGapLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ConfirmationPage() {
  const study = projectStudies.confirmation;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Pending vs confirmed"
        copy="Иногда сервер не просто подтверждает мутацию, а нормализует или меняет итог. Здесь особенно важно не выдавать локально показанное значение за уже подтверждённый результат."
      />

      <Panel>
        <ConfirmationGapLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Pending value"
          value="Expectation"
          hint="Это то, что интерфейс показывает заранее, чтобы не заставлять ждать."
        />
        <MetricCard
          label="Confirmed value"
          value="Server truth"
          hint="Это реальный итог, который сервер принял и вернул обратно."
          tone="cool"
        />
        <MetricCard
          label="UX boundary"
          value="Do not blur"
          hint="Если размыть границу между ними, пользователь перестаёт понимать, чему можно доверять."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
