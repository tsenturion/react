import { DefaultActionLab } from '../components/react-events/DefaultActionLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildDefaultActionReport } from '../lib/default-action-model';
import { getProjectStudy } from '../lib/project-study';

export function DefaultActionPage() {
  const allowed = buildDefaultActionReport({
    preventLink: false,
    preventCheckbox: false,
  });
  const blocked = buildDefaultActionReport({ preventLink: true, preventCheckbox: true });
  const study = getProjectStudy('default');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="`preventDefault()` отменяет действие браузера, а не само событие"
        copy="React handler по-прежнему получает объект события и может продолжать логику приложения. Но вызов `preventDefault()` останавливает именно browser default behavior: переход по ссылке, нативный submit, переключение checkbox и другие встроенные действия."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Default action"
          value="браузерное поведение"
          hint={allowed.summary}
          tone="cool"
        />
        <MetricCard
          label="Prevent default"
          value="не bubble stop"
          hint="Всплытие и отмена действия браузера решают разные задачи и управляются разными методами."
        />
        <MetricCard
          label="Практика"
          value="link / checkbox"
          hint="Ссылки, формы и поля ввода особенно чувствительны к этому различию."
          tone="accent"
        />
      </div>

      <DefaultActionLab />

      <BeforeAfter
        beforeTitle="Без preventDefault"
        before={allowed.consequences.join(' ')}
        afterTitle="С preventDefault"
        after={blocked.consequences.join(' ')}
      />

      <Panel className="space-y-4">
        <CodeBlock label="Prevent default" code={blocked.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
