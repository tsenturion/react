import { ProviderBoundaryLab } from '../components/context-reducer/ProviderBoundaryLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function BoundariesPage() {
  const study = projectStudies.boundaries;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Границы providers и независимые state islands"
        copy="Provider важен не только тем, что доставляет context, но и тем, где он начинается и заканчивается. Его граница определяет, какие ветки делят одно состояние, а какие остаются независимыми. Ошибка здесь опасна в обе стороны: слишком низкий provider не решает delivery-проблему, слишком высокий начинает собирать лишние локальные детали."
      />

      <Panel>
        <ProviderBoundaryLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Ключевой принцип"
          value="Scope matters"
          hint="Сам факт наличия context ничего не решает без правильной границы provider."
          tone="cool"
        />
        <MetricCard
          label="Что показывает лаба"
          value="State islands"
          hint="Соседние и вложенные providers создают независимые области состояния."
        />
        <MetricCard
          label="Типичный сбой"
          value="Scope too high"
          hint="Локальные детали начинают жить в слишком широком общем контейнере."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
