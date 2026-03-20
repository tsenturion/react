import { ArchitectureMiniDemoLab } from '../components/interface-practice/ArchitectureMiniDemoLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { createLessonCatalog } from '../lib/interface-practice-domain';
import { buildWorkbenchSummary, filterLessons } from '../lib/workbench-model';
import { getProjectStudy } from '../lib/project-study';

export function ArchitectureMiniDemoPage() {
  const lessons = createLessonCatalog();
  const visible = filterLessons(lessons, '', 'all');
  const summary = buildWorkbenchSummary(lessons, visible, lessons[0].id);
  const study = getProjectStudy('demo');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Итоговый экран: компоненты, state, вычисления и связи работают вместе"
        copy="Здесь вся тема собрана в одном месте. Экран реально разбит на компоненты, owner state хранит только минимальные значения, derived values вычисляются отдельно, а snapshot показывает, что именно нужно держать в состоянии."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Всего уроков"
          value={String(summary.total)}
          hint="Исходная коллекция остаётся данными экрана."
          tone="cool"
        />
        <MetricCard
          label="Derived summary"
          value={`${summary.visible} visible`}
          hint="Сводка пересчитывается из lessons и фильтров, а не хранится отдельно."
        />
        <MetricCard
          label="Source of truth"
          value="CourseWorkbench"
          hint="query, selectedId и draftsById живут у одного экранного owner state."
          tone="accent"
        />
      </div>

      <ArchitectureMiniDemoLab />

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
