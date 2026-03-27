import { SharedDiscountWorkbench } from '../components/shared-state/SharedDiscountWorkbench';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildLiftingReport } from '../lib/lifting-state-model';
import { createDiscountState } from '../lib/shared-state-domain';
import { getProjectStudy } from '../lib/project-study';

export function LiftingStatePage() {
  const report = buildLiftingReport(createDiscountState());
  const study = getProjectStudy('lifting');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Lifting state up: общий владелец для нескольких контролов"
        copy="Когда два визуально независимых child-компонента должны показывать согласованное значение, состояние поднимается к их общему parent. Здесь одно discount state синхронизирует percent editor, net price editor и summary."
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Что происходит</h2>
          <p className="text-sm leading-6 text-slate-600">
            Изменение одного поля сразу переводит второе и summary в новый UI, потому что
            все они читают один источник истины у parent-компонента.
          </p>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Gross"
              value={report.grossLabel}
              hint="Базовая цена."
              tone="cool"
            />
            <MetricCard
              label="Net"
              value={report.netLabel}
              hint="Вычисляется из shared state."
            />
            <MetricCard
              label="Source"
              value="one parent"
              hint={report.summary}
              tone="accent"
            />
          </div>

          <SharedDiscountWorkbench />
          <CodeBlock label="Lifting state" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
