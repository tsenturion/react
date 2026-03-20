import { DataDerivedEventsLab } from '../components/interface-practice/DataDerivedEventsLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildDataFlowReport } from '../lib/data-flow-model';
import { getProjectStudy } from '../lib/project-study';

export function DataDerivedEventsPage() {
  const report = buildDataFlowReport({
    filteredInState: false,
    summaryInState: false,
    selectedObjectInState: false,
  });
  const risky = buildDataFlowReport({
    filteredInState: true,
    summaryInState: true,
    selectedObjectInState: true,
  });
  const study = getProjectStudy('classification');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Как различать данные, state, derived значения и события"
        copy="Устойчивый экран хранит только то, что действительно меняется от действий пользователя и не может быть вычислено из других данных. Всё остальное лучше держать как derived values или как события."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Минимальный экран"
          value={`${report.riskCount} drift`}
          hint={report.summary}
          tone="cool"
        />
        <MetricCard
          label="Перегруженный экран"
          value={`${risky.riskCount} risks`}
          hint={risky.summary}
        />
        <MetricCard
          label="Практика"
          value="derive by render"
          hint="Если значение уже выводится из lessons + filters + selectedId, его не нужно дублировать."
          tone="accent"
        />
      </div>

      <DataDerivedEventsLab />

      <Panel className="space-y-4">
        <CodeBlock label="Derived workbench values" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
