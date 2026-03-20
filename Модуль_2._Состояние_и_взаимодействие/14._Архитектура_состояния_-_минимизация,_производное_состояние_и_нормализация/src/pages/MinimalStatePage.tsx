import { MinimalStatePlanner } from '../components/state-architecture/MinimalStatePlanner';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildMinimalStateReport } from '../lib/minimal-state-model';
import { getProjectStudy } from '../lib/project-study';
import { createPlanningTasks } from '../lib/state-architecture-domain';

export function MinimalStatePage() {
  const report = buildMinimalStateReport(createPlanningTasks(), '', false);
  const study = getProjectStudy('minimal');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Минимальное состояние"
        copy="Архитектура становится устойчивее, когда в state остаются только raw данные и пользовательский ввод. Всё, что можно честно вычислить из них, лучше не хранить отдельной копией."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Raw state"
          value="tasks + query + filter"
          hint="Это ядро, без которого следующий UI нельзя восстановить."
          tone="cool"
        />
        <MetricCard
          label="Derived"
          value={`${report.visible} visible`}
          hint={report.summary}
        />
        <MetricCard
          label="Риск лишнего state"
          value="drift"
          hint="Если visibleTasks и completed хранить отдельно, их придётся синхронизировать после каждого изменения."
          tone="accent"
        />
      </div>

      <MinimalStatePlanner />

      <Panel className="space-y-4">
        <CodeBlock label="Minimal state shape" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
