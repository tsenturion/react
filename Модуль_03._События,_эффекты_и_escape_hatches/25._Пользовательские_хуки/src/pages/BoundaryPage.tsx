import { HookBoundaryLab } from '../components/custom-hooks/HookBoundaryLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function BoundaryPage() {
  const study = projectStudies.boundary;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Границы абстракции"
        copy="Не вся логика должна становиться custom hook-ом. Иногда честнее оставить её рядом с компонентом, а иногда сначала выделить pure helper. Эта лаборатория помогает увидеть границу между полезной абстракцией и переусложнением."
      />

      <Panel>
        <HookBoundaryLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Выносить в hook"
          value="Когда есть контракт"
          hint="Повторение, скрытое состояние и внешняя синхронизация делают hook полезным."
          tone="cool"
        />
        <MetricCard
          label="Не выносить"
          value="Одноразовый toggle"
          hint="Tiny local logic прямо в компоненте часто честнее и читаемее."
        />
        <MetricCard
          label="Промежуточный вариант"
          value="Pure helper"
          hint="Чистое вычисление без state/effect логично оставлять обычной функцией."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
