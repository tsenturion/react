import { ObjectMutationPanel } from '../components/complex-state/ObjectMutationPanel';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { createLessonSettings } from '../lib/complex-state-domain';
import { buildObjectStateReport } from '../lib/object-state-model';
import { getProjectStudy } from '../lib/project-study';

export function ObjectStatePage() {
  const report = buildObjectStateReport(createLessonSettings());
  const study = getProjectStudy('objects');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Объекты в state: копирование против мутации"
        copy="Когда состояние хранится объектом, React ожидает новый reference на каждом реальном изменении. Здесь можно буквально увидеть, как прямое изменение поля прячется до следующего чужого рендера, а копия даёт предсказуемый UI сразу."
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Что важно</h2>
          <div className="space-y-3 text-sm leading-6 text-slate-700">
            <p>Объект в state нельзя менять “на месте”.</p>
            <p>
              Новый UI должен строиться из новой ссылки, а не из мутированного старого
              значения.
            </p>
            <p>Ошибка часто проявляется не сразу, а на следующем внешнем ререндере.</p>
          </div>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="State shape"
              value="object"
              hint="Один state-объект объединяет несколько связанных полей настройки."
              tone="cool"
            />
            <MetricCard
              label="Безопасный update"
              value="new reference"
              hint={report.summary}
            />
            <MetricCard
              label="Риск мутации"
              value="same reference"
              hint={report.mutationWarning}
              tone="accent"
            />
          </div>

          <BeforeAfter
            beforeTitle="Если менять поле напрямую"
            before={report.mutationWarning}
            afterTitle="Если заменить объект копией"
            after={report.summary}
          />

          <ObjectMutationPanel />
          <CodeBlock label="Object update" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
