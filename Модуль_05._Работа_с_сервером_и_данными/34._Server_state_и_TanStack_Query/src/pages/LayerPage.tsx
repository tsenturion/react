import { ServerStateSplitLab } from '../components/server-state/ServerStateSplitLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function LayerPage() {
  const study = projectStudies.layer;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Server state как отдельный слой"
        copy="Один и тот же экран держит и локальные UI-переключатели, и данные, которые пришли с сервера. Здесь видно, что это не один тип state, а два разных мира с разными правилами жизни."
      />

      <Panel>
        <ServerStateSplitLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Client state"
          value="Instant and local"
          hint="Фильтр и раскрытие карточки живут рядом с компонентом и меняются сразу."
          tone="cool"
        />
        <MetricCard
          label="Server state"
          value="Async and shared"
          hint="Данные приходят позже, могут устареть и принадлежат не компоненту, а серверу."
        />
        <MetricCard
          label="Main boundary"
          value="Do not mix"
          hint="Если смешать их в один тип состояния, компонент быстро теряет предсказуемость."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
