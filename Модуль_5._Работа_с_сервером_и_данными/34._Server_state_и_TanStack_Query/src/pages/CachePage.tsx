import { CacheSharingLab } from '../components/server-state/CacheSharingLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function CachePage() {
  const study = projectStudies.cache;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Caching и shared query cache"
        copy="Здесь несколько UI-потребителей смотрят в один и тот же query key. Если кэш спроектирован правильно, второй observer не запускает новый transport request, а использует уже существующий cache entry."
      />

      <Panel>
        <CacheSharingLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="One query key"
          value="Shared entry"
          hint="Одинаковый query key означает общий cache entry и общую lifecycle-модель."
          tone="cool"
        />
        <MetricCard
          label="Deduplication"
          value="Less transport noise"
          hint="Второй consumer не обязан снова идти в сеть, если cache уже держит нужные данные."
        />
        <MetricCard
          label="Result"
          value="Same requestNo"
          hint="Одинаковый request number в двух панелях показывает, что они смотрят на один fetch-result."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
