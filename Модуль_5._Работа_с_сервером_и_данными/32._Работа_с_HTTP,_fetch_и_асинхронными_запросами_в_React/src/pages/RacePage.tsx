import { RaceConditionsLab } from '../components/http-fetch/RaceConditionsLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function RacePage() {
  const study = projectStudies.race;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Race conditions и устаревшие ответы"
        copy="Сетевая гонка появляется там, где старый запрос возвращается позже нового и перезаписывает более актуальный UI. Здесь это видно прямо вживую на unsafe и safe версиях одного и того же поиска."
      />

      <Panel>
        <RaceConditionsLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Unsafe запрос"
        before="Поздний ответ от старого query всё ещё считается валидным и попадает в интерфейс, хотя пользователь уже ждёт другой результат."
        afterTitle="Safe запрос"
        after="Abort и stale-guard не дают устаревшему ответу перезаписать более новый UI."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Источник бага"
          value="Out-of-order responses"
          hint="Проблема не в fetch как таковом, а в том, что несколько запросов конкурируют за один и тот же UI."
        />
        <MetricCard
          label="Рабочая защита"
          value="Abort + guard"
          hint="Нужна и отмена старого запроса, и защита от позднего ответа на уровне состояния."
          tone="cool"
        />
        <MetricCard
          label="Практический эффект"
          value="Predictable UI"
          hint="Пользователь видит результат именно для текущего ввода, а не для предыдущего."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
