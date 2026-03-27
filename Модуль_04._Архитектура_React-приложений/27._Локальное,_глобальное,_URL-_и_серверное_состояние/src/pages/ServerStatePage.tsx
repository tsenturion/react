import { ServerStateLab } from '../components/state-architecture/ServerStateLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ServerStatePage() {
  const study = projectStudies.server;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Server state: внешние данные, cache, loading и refetch"
        copy="Server state отличается от обычного state тем, что источник истины находится вне компонента и вообще вне браузера. Вместе с данными приходят loading, error, cache, refetch, stale snapshots и вопрос актуальности. Если относиться к этому как к обычному local state, интерфейс быстро теряет ясность."
      />

      <Panel>
        <ServerStateLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Источник истины"
          value="Вне клиента"
          hint="Компонент только синхронизируется с внешними данными, но не становится их владельцем."
          tone="cool"
        />
        <MetricCard
          label="Типичный просчёт"
          value="Mask as local"
          hint="Если серверные данные выдавать за обычный useState, теряются loading, error и refetch semantics."
          tone="accent"
        />
        <MetricCard
          label="Нормальная модель"
          value="Cache layer"
          hint="Нужен отдельный слой загрузки и кэширования, а не просто массив в компоненте."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
