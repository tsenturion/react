import { RetryAbortLab } from '../components/http-fetch/RetryAbortLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function RetryPage() {
  const study = projectStudies.retry;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Retries и abort"
        copy="Повторный запрос имеет смысл только там, где ошибка действительно временная. Здесь вы сравниваете retry-план, стабильный server error и отмену длинного запроса до его завершения."
      />

      <Panel>
        <RetryAbortLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Retry без модели ошибки"
        before="Если повторять любой провал подряд, вы получаете лишнюю нагрузку на сеть и тот же broken UX без реального выигрыша."
        afterTitle="Retry только для временных сбоев"
        after="Когда у ошибки есть retryable-смысл, повторные попытки и backoff действительно повышают устойчивость интерфейса."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Abort"
          value="Cancel stale work"
          hint="Отмена нужна, чтобы интерфейс не дожидался уже нерелевантного ответа."
          tone="cool"
        />
        <MetricCard
          label="Retry"
          value="Transient only"
          hint="Повторные попытки полезны для 503/429 и похожих временных сценариев."
        />
        <MetricCard
          label="Граница"
          value="Not every error"
          hint="Retry не должен лечить сценарии, где проблема не временная и не сетевого характера."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
