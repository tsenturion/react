import { SyntheticEventLab } from '../components/react-events/SyntheticEventLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildHandlerPatternReport } from '../lib/synthetic-event-model';

export function SyntheticEventPage() {
  const direct = buildHandlerPatternReport('direct');
  const inline = buildHandlerPatternReport('inline');
  const curried = buildHandlerPatternReport('curried');
  const study = getProjectStudy('synthetic');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Synthetic Events и паттерны назначения обработчиков"
        copy="React передаёт в обработчик нормализованный SyntheticEvent и даёт доступ к nativeEvent. Главное решение на этом уровне: какой обработчик назначить напрямую, а где нужен wrapper для аргументов или factory function."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Event object"
          value="SyntheticEvent"
          hint="React выравнивает API события и поверх него открывает `nativeEvent`."
          tone="cool"
        />
        <MetricCard label="Direct handler" value="без args" hint={direct.summary} />
        <MetricCard
          label="Wrapper pattern"
          value="inline / curried"
          hint="Нужен, когда вместе с событием надо передать id, action name или другой параметр."
          tone="accent"
        />
      </div>

      <SyntheticEventLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={direct.title} code={direct.snippet} />
        <CodeBlock label={inline.title} code={inline.snippet} />
        <CodeBlock label={curried.title} code={curried.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
