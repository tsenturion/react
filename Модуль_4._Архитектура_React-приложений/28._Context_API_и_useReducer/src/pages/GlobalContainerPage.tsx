import { GlobalContainerLab } from '../components/context-reducer/GlobalContainerLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function GlobalContainerPage() {
  const study = projectStudies.container;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как не превратить context в глобальный контейнер для всего подряд"
        copy="Context не должен становиться местом, куда складывается всё: theme, draft, dialog, server data, hover state и любая случайная мелочь. У такого контейнера быстро пропадает ясная ответственность, а каждая ветка начинает видеть слишком много несвязанных полей. Эта лаборатория показывает, как размывается API провайдера и как его снова разделить по ролям."
      />

      <Panel>
        <GlobalContainerLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Контекст хорош для"
          value="Shared delivery"
          hint="Theme, session и общие workspace preferences подходят для context намного лучше, чем hover или draft."
          tone="cool"
        />
        <MetricCard
          label="Контекст плох для"
          value="Everything app-wide"
          hint="Один общий контейнер быстро смешивает local, scoped и server concerns."
          tone="accent"
        />
        <MetricCard
          label="Нормальный итог"
          value="Split by role"
          hint="Shared context, local state, scoped providers и data layer должны оставаться отдельными уровнями."
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Один AppContext для всех задач"
          before="Любая ветка знает слишком много лишних полей, а provider перестаёт отражать понятную ответственность."
          afterTitle="Разделение по ролям"
          after="Context остаётся средством доставки shared values, локальные детали живут рядом с компонентом, а server data уходит в отдельный слой."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
