import { StaleRetriesLab } from '../components/server-state/StaleRetriesLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function StalePage() {
  const study = projectStudies.stale;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Stale data strategy и retries"
        copy="Server state не обязан быть либо просто свежим, либо просто устаревшим. Здесь вы видите, как staleTime и retry-policy меняют поведение query layer и стоимость обновления данных."
      />

      <Panel>
        <StaleRetriesLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Stale time"
          value="Freshness budget"
          hint="Чем меньше staleTime, тем агрессивнее query слой считает данные устаревшими."
          tone="cool"
        />
        <MetricCard
          label="Retries"
          value="Failure policy"
          hint="Повторный запрос становится частью query architecture, а не ручной логикой компонента."
        />
        <MetricCard
          label="Key idea"
          value="Success can be stale"
          hint="Даже успешная query может уже не совпадать с актуальным состоянием сервера."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
