import { SnapshotLogger } from '../components/state/SnapshotLogger';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildSnapshotNarrative } from '../lib/snapshot-model';
import { getProjectStudy } from '../lib/project-study';

export function SnapshotPage() {
  const narrative = buildSnapshotNarrative(2, 1);
  const study = getProjectStudy('snapshot');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="State as a snapshot"
        copy="Состояние нельзя понимать как переменную, которая изменилась прямо в той же строчке после `setState`. Каждый рендер получает свой snapshot значений, и обработчик события работает именно с ним."
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Логика snapshot</h2>
          <ListBlock
            title="Последовательность"
            items={[
              narrative.currentRenderLabel,
              narrative.scheduledLabel,
              narrative.sameHandlerLabel,
              narrative.nextRenderLabel,
            ]}
          />
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Текущий рендер"
              value="snapshot"
              hint="Обработчик читает именно значения того рендера, в котором он был создан."
              tone="cool"
            />
            <MetricCard
              label="setState"
              value="queue"
              hint="Вызов не мутирует значение сразу, а планирует следующее состояние."
            />
            <MetricCard
              label="Следующий UI"
              value="next render"
              hint="Новый интерфейс появляется только после нового рендера."
              tone="accent"
            />
          </div>

          <SnapshotLogger />
          <CodeBlock label="Snapshot handler" code={narrative.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
