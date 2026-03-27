import { EnrollmentWorkbench } from '../components/state/EnrollmentWorkbench';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildEnrollmentViewModel, type EnrollmentState } from '../lib/state-flow-model';
import { getProjectStudy } from '../lib/project-study';

const defaultState: EnrollmentState = {
  plan: 'starter',
  seats: 3,
  acceptedRules: false,
  submitted: false,
};

export function ActionFlowPage() {
  const viewModel = buildEnrollmentViewModel(defaultState);
  const study = getProjectStudy('flow');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как пользовательское действие превращается в новый UI через state"
        copy="В реальном интерфейсе одно действие пользователя редко меняет только одно число. Чаще оно затрагивает выбранный режим, доступность кнопки, подтверждение, остаток мест и текстовые подсказки. Здесь можно увидеть этот поток на одном экране."
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Поток данных</h2>
          <ListBlock
            title="user action → state → render"
            items={[
              'Клик меняет владельца состояния через `setState`.',
              'Новый рендер читает уже обновлённые значения.',
              'Кнопка, подписи и доступность меняются как следствие нового state.',
            ]}
          />
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="State-срезов"
              value="4"
              hint="План, количество мест, принятие правил и факт отправки хранятся отдельно."
              tone="cool"
            />
            <MetricCard
              label="Доступность"
              value={viewModel.availability}
              hint="Даже текст доступности — это отражение текущего state."
            />
            <MetricCard
              label="CTA"
              value={viewModel.actionLabel}
              hint={viewModel.summary}
              tone="accent"
            />
          </div>

          <EnrollmentWorkbench />
          <CodeBlock label="Набор useState для экрана" code={viewModel.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
