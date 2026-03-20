import { MutationHistoryLab } from '../components/complex-state/MutationHistoryLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { createHistorySnapshots } from '../lib/complex-state-domain';
import {
  appendHistoryImmutably,
  appendHistoryWithMutation,
  buildHistoryComparisonReport,
} from '../lib/mutation-history-model';
import { getProjectStudy } from '../lib/project-study';

export function MutationBugsPage() {
  const report = buildHistoryComparisonReport(
    appendHistoryWithMutation(appendHistoryWithMutation(createHistorySnapshots())),
    appendHistoryImmutably(appendHistoryImmutably(createHistorySnapshots())),
  );
  const study = getProjectStudy('bugs');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Невидимые баги от мутации: потеря истории и рассинхрон интерфейса"
        copy="Самые неприятные ошибки от мутации часто не выглядят как мгновенный крэш. Они проявляются тише: история версий перестаёт быть историей, прошлые значения внезапно “переписываются”, а UI теряет предсказуемость."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Broken unique refs"
            value={String(report.bad.uniqueReferences)}
            hint="В сломанной истории несколько записей смотрят на один и тот же объект."
            tone="accent"
          />
          <MetricCard
            label="Safe unique refs"
            value={String(report.good.uniqueReferences)}
            hint="Корректная история хранит отдельный snapshot для каждой версии."
            tone="cool"
          />
          <MetricCard label="Эффект" value="history drift" hint={report.summary} />
        </div>

        <BeforeAfter
          beforeTitle="Если в history сохранять ту же ссылку"
          before={report.summary}
          afterTitle="Если каждый шаг сохранять новой копией"
          after="Прошлые версии остаются прошлым, и интерфейс может честно показывать, как данные менялись шаг за шагом."
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-4">
            <CodeBlock label="Broken history" code={report.badSnippet} />
            <CodeBlock label="Immutable history" code={report.goodSnippet} />
          </Panel>

          <MutationHistoryLab />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
