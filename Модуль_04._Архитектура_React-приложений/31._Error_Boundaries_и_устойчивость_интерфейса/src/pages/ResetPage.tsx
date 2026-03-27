import { ResetStrategiesLab } from '../components/error-boundaries/ResetStrategiesLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ResetPage() {
  const study = projectStudies.reset;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Reset strategies"
        copy="Boundary умеет не только падать в fallback, но и возвращаться обратно. Здесь вы сравниваете ручной retry, автоматический reset по новым входным данным и жёсткий remount через key."
      />

      <Panel>
        <ResetStrategiesLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Повторить без изменений"
        before="Если причина сбоя осталась той же, boundary просто снова встретит ту же ошибку на следующем render."
        afterTitle="Исправить входные данные или remount subtree"
        after="Если вы меняете problem input или пересоздаёте subtree, boundary получает шанс выйти из fallback и восстановить нормальный UI."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Manual retry"
          value="Fast check"
          hint="Подходит, когда причина могла исчезнуть сама: например, краткий сбой сети или race во внешней системе."
        />
        <MetricCard
          label="resetKeys"
          value="Input-driven reset"
          hint="Полезно, когда recovery естественно привязан к смене route params, filters или selected entity."
          tone="cool"
        />
        <MetricCard
          label="Remount by key"
          value="Hard reset"
          hint="Жёсткий remount удобен, когда нужно полностью выбросить внутреннее состояние сломанного subtree."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
