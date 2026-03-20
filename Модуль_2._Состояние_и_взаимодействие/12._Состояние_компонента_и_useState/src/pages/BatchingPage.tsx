import { BatchingScene } from '../components/state/BatchingScene';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildBatchingReport } from '../lib/batching-model';
import { getProjectStudy } from '../lib/project-study';

export function BatchingPage() {
  const report = buildBatchingReport();
  const study = getProjectStudy('batching');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Batching: один обработчик, несколько обновлений, один новый UI"
        copy="Когда обработчик вызывает несколько `setState`, React не обязан показывать промежуточные полушаги между ними. Здесь одно действие меняет сразу несколько state-срезов, а пользователь сразу видит итоговую версию интерфейса следующего рендера."
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">После одного клика</h2>
          <ListBlock
            title="Что меняется"
            items={report.visibleAfterEvent.map((item) => `Обновляется ${item}.`)}
          />
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="State-срезов"
              value={String(report.touchedSlices)}
              hint="Один обработчик меняет сразу несколько частей состояния."
              tone="cool"
            />
            <MetricCard
              label="Промежуточный UI"
              value="не виден"
              hint="React группирует обновления и показывает итог после завершения обработчика."
            />
            <MetricCard
              label="Результат"
              value="batched"
              hint={report.summary}
              tone="accent"
            />
          </div>

          <BatchingScene />
          <CodeBlock label="Несколько setState в одном действии" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
