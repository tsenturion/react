import { StableIdLab } from '../components/advanced-hooks/StableIdLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function UseIdPage() {
  const study = projectStudies.useid;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="useId и стабильные DOM-связи"
        copy="`useId` нужен там, где React-компоненту нужны устойчивые id для `label`, `input`, `aria-describedby` и похожих DOM-связей. Это не ключ для списка и не случайный id из рендера, а tree-stable идентификатор для доступности и корректного монтирования."
      />

      <Panel>
        <StableIdLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Подходит для"
          value="DOM ids"
          hint="Labels, описания, поля формы и доступность."
          tone="cool"
        />
        <MetricCard
          label="Не подходит для"
          value="key"
          hint="Идентичность в списке и DOM-id решают разные задачи."
          tone="accent"
        />
        <MetricCard
          label="Главный плюс"
          value="Стабильность"
          hint="Повторный рендер не меняет уже созданные связи внутри компонента."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
