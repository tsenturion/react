import { HttpBasicsLab } from '../components/http-fetch/HttpBasicsLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function HttpPage() {
  const study = projectStudies.http;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="HTTP basics"
        copy="Здесь вы связываете query, GET-запрос, response status и payload. Это базовый уровень, без которого loading/error/empty states дальше быстро превращаются в набор случайных if-ов."
      />

      <Panel>
        <HttpBasicsLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Method"
          value="GET"
          hint="Для клиентского data fetching в React это базовый сценарий чтения данных."
          tone="cool"
        />
        <MetricCard
          label="Status"
          value="200 / 204 / 503"
          hint="Даже если payload похож, статус меняет смысл результата для интерфейса."
        />
        <MetricCard
          label="Главная связь"
          value="Request -> UI"
          hint="Транспортные детали запроса должны становиться явными состояниями UI, а не скрытой внутренней магией."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
