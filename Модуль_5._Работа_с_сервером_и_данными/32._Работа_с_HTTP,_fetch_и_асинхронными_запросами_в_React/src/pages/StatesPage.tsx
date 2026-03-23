import { LoadingStatesLab } from '../components/http-fetch/LoadingStatesLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function StatesPage() {
  const study = projectStudies.states;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Loading, error, empty и success"
        copy="Сетевой запрос — это не бинарное состояние «есть данные / нет данных». Здесь вы видите четыре разных UI-состояния, которые нельзя схлопывать друг в друга без потери смысла."
      />

      <Panel>
        <LoadingStatesLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Loading"
          value="Expectation"
          hint="Показывает, что UI не завис, а ждёт результат запроса."
          tone="cool"
        />
        <MetricCard
          label="Empty"
          value="Valid result"
          hint="Пустой ответ успешен и требует собственного UX, а не generic error."
        />
        <MetricCard
          label="Error"
          value="Recovery path"
          hint="Ошибка без понятного recovery flow превращается в тупик для пользователя."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
