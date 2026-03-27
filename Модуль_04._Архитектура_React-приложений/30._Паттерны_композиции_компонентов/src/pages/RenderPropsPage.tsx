import { RenderPropsLab } from '../components/composition-patterns/RenderPropsLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function RenderPropsPage() {
  const study = projectStudies['render-props'];

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Render props"
        copy="Render props полезны там, где слой поведения и слой отображения нужно разделить особенно жёстко: один компонент держит данные и действия, а внешний код полностью управляет итоговым render. Это даёт большую свободу, но может быстро сделать JSX шумным."
      />

      <Panel>
        <RenderPropsLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Когда помогает"
          value="Flexible rendering"
          hint="Поведение общее, а варианты визуализации отличаются слишком сильно для обычных props."
          tone="cool"
        />
        <MetricCard
          label="Что даёт"
          value="Caller control"
          hint="Caller полностью владеет render layer, не ломая поведенческую логику компонента-источника."
        />
        <MetricCard
          label="Где ломается"
          value="Nested functions"
          hint="Слишком много render functions делают API менее читаемым, чем обычная композиция."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
