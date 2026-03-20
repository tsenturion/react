import { SharedFilterDashboard } from '../components/shared-state/SharedFilterDashboard';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildDashboardSummary } from '../lib/shared-dashboard-model';
import { createCatalogItems } from '../lib/shared-state-domain';
import { getProjectStudy } from '../lib/project-study';

export function SharedStateDashboardPage() {
  const summary = buildDashboardSummary(createCatalogItems(), {
    query: '',
    track: 'all',
  });
  const study = getProjectStudy('shared');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Shared state: один фильтр для нескольких независимых частей интерфейса"
        copy="Один и тот же filter state часто влияет сразу на несколько визуально независимых зон: toolbar, список карточек, summary и пустые состояния. Здесь это поведение можно проверить вживую."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Visible"
            value={String(summary.visibleCount)}
            hint="Считается из общего фильтра."
            tone="cool"
          />
          <MetricCard
            label="Minutes"
            value={String(summary.totalDuration)}
            hint="Summary не хранит свою копию фильтра."
          />
          <MetricCard
            label="Effect"
            value="toolbar + grid + summary"
            hint={summary.summary}
            tone="accent"
          />
        </div>

        <SharedFilterDashboard />
        <CodeBlock label="Shared dashboard state" code={summary.snippet} />
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
