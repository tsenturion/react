import { DebugValueLab } from '../components/advanced-hooks/DebugValueLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function DebugValuePage() {
  const study = projectStudies.debug;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="useDebugValue и читаемые custom hooks"
        copy="`useDebugValue` нужен не для пользовательского UI, а для диагностики сложных custom hooks в DevTools. Он помогает не читать сырой внутренний объект hook-а, а сразу видеть короткую сводку о его состоянии."
      />

      <Panel>
        <DebugValueLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Назначение"
          value="DevTools"
          hint="Hook становится понятнее в дереве отладки."
          tone="cool"
        />
        <MetricCard
          label="Не делает"
          value="Новый state"
          hint="`useDebugValue` не меняет контракт hook-а и не влияет на рендер."
        />
        <MetricCard
          label="Полезно когда"
          value="Hook сложный"
          hint="Особенно ценно, если hook агрегирует несколько ограничений и derived signals."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
