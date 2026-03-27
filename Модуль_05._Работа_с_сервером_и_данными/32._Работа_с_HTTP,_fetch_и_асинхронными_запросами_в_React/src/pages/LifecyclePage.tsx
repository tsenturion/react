import { RequestLifecycleLab } from '../components/http-fetch/RequestLifecycleLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function LifecyclePage() {
  const study = projectStudies.lifecycle;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Жизненный цикл запроса"
        copy="Когда сетевой запрос описан как явный lifecycle, компонент становится предсказуемым: вы видите старт, ожидание, успешный ответ, ошибку или отмену, а не набор не связанных между собой флагов."
      />

      <Panel>
        <RequestLifecycleLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Idle"
          value="No request yet"
          hint="Полезно отделять ещё не начатый запрос от уже завершившегося пустым результатом."
        />
        <MetricCard
          label="Aborted"
          value="Stopped intentionally"
          hint="Отменённый запрос не равен ошибке сервера: причина и UX здесь другие."
          tone="cool"
        />
        <MetricCard
          label="Главный эффект"
          value="Traceability"
          hint="Лог lifecycle помогает понять, где именно запрос пошёл не так."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
