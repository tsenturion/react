import { OptimisticComparisonLab } from '../components/mutations/OptimisticComparisonLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function OptimisticPage() {
  const study = projectStudies.optimistic;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Optimistic UX против ожидания ответа"
        copy="Один и тот же server request можно отрисовать двумя способами: ждать подтверждения или показать ожидаемый результат сразу. Здесь разница особенно заметна на задержке."
      />

      <Panel>
        <OptimisticComparisonLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Conservative UX"
        before="Интерфейс не утверждает, что действие уже завершилось, но ощущается медленнее."
        afterTitle="Optimistic UX"
        after="Интерфейс реагирует мгновенно, но берёт на себя обязательство уметь честно пережить ошибку и rollback."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Оптимистический выигрыш"
          value="Perceived speed"
          hint="Пользователь получает отклик без ожидания сетевой задержки."
          tone="cool"
        />
        <MetricCard
          label="Цена"
          value="State complexity"
          hint="Нужны pending-маркеры, rollback и понимание границы между ожиданием и фактом."
        />
        <MetricCard
          label="Не универсально"
          value="Depends on risk"
          hint="Чем выше цена ошибки, тем меньше смысла в безусловном optimistic UX."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
