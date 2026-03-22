import { FluxCycleLab } from '../components/redux-architecture/FluxCycleLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function FluxPage() {
  const study = projectStudies.flux;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Flux как модель однонаправленного цикла"
        copy="Flux важен не названием библиотек, а правилом: view выражает намерение через action, reducer-слой готовит следующее состояние, selectors формируют данные для веток интерфейса, а UI снова читает результат. Здесь хорошо видно, почему shared state на уровне приложения перестаёт быть набором случайных setState-вызовов."
      />

      <Panel>
        <FluxCycleLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Источник intent"
          value="Action"
          hint="Пользовательское действие сначала получает имя и форму, а не изменяет store напрямую."
          tone="cool"
        />
        <MetricCard
          label="Ключевой выигрыш"
          value="Traceability"
          hint="Путь от клика до нового интерфейса остаётся читаемым даже при росте приложения."
        />
        <MetricCard
          label="Главный риск"
          value="Bypass flow"
          hint="Если менять shared state мимо action/reducer слоя, архитектура снова теряет предсказуемость."
          tone="accent"
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если каждый виджет меняет shared data как хочет"
          before="Список, счётчики и inspector начинают расходиться, потому что у обновления нет единого маршрута и единой точки ответственности."
          afterTitle="Если действие проходит полный Flux cycle"
          after="У клика появляется явный action type, reducer описывает следующее состояние, а selectors отдают всем веткам один согласованный результат."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
