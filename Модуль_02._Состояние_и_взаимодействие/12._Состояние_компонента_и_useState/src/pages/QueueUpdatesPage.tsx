import { QueueCounterSandbox } from '../components/state/QueueCounterSandbox';
import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { simulateQueuedIncrements } from '../lib/queue-model';

export function QueueUpdatesPage() {
  const direct = simulateQueuedIncrements(0, 3, 'direct');
  const functional = simulateQueuedIncrements(0, 3, 'functional');
  const study = getProjectStudy('queue');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Queued updates и functional updates"
        copy="Несколько обновлений одного и того же state за один обработчик складываются в очередь. Здесь можно напрямую сравнить обычный `setCount(count + 1)` и functional update через `prev => prev + 1`."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Direct result"
            value={String(direct.finalValue)}
            hint="Три одинаковых snapshot-обновления дают только +1."
            tone="accent"
          />
          <MetricCard
            label="Functional result"
            value={String(functional.finalValue)}
            hint="Каждая функция берёт актуальное queued value и действительно даёт +3."
            tone="cool"
          />
          <MetricCard
            label="Очередь"
            value="3 updates"
            hint="Разница не в количестве вызовов, а в том, как они читают исходное значение."
          />
        </div>

        <BeforeAfter
          beforeTitle="Если опираться на snapshot"
          before={direct.summary}
          afterTitle="Если опираться на очередь"
          after={functional.summary}
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Что попадает в очередь
            </h2>
            <ListBlock title="Direct queue" items={direct.operations} />
            <ListBlock title="Functional queue" items={functional.operations} />
          </Panel>

          <div className="space-y-6">
            <QueueCounterSandbox />
            <div className="grid gap-4 lg:grid-cols-2">
              <CodeBlock label="Direct updates" code={direct.snippet} />
              <CodeBlock label="Functional updates" code={functional.snippet} />
            </div>
          </div>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
