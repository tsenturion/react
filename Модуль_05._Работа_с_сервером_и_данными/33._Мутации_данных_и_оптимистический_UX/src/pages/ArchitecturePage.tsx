import { MutationArchitectureLab } from '../components/mutations/MutationArchitectureLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ArchitecturePage() {
  const study = projectStudies.architecture;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Архитектура mutation UX"
        copy="Optimistic UX не должен быть религией. Здесь вы подбираете подход под обратимость, риск, destructive nature операции и вероятность того, что сервер изменит итог."
      />

      <Panel>
        <MutationArchitectureLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Optimistic"
          value="Fastest feel"
          hint="Подходит для дешёвых, обратимых действий с высокой ценностью мгновенного отклика."
          tone="cool"
        />
        <MetricCard
          label="Hybrid"
          value="Fast but marked"
          hint="Интерфейс реагирует быстро, но не скрывает, что сервер ещё не подтвердил итог."
        />
        <MetricCard
          label="Conservative"
          value="Trust first"
          hint="Лучше для дорогих, рисковых и необратимых операций."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
