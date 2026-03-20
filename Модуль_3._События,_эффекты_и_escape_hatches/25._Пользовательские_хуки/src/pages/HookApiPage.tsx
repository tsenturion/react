import { ChecklistApiLab } from '../components/custom-hooks/ChecklistApiLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function HookApiPage() {
  const study = projectStudies.api;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="API hook-а и explicit commands"
        copy="У хорошего hook-а есть собственный язык команд. Вместо того чтобы выдавать компоненту raw setter и заставлять его знать внутреннюю форму данных, hook может отдавать доменные действия: toggle, assign, reset, commit."
      />

      <Panel>
        <ChecklistApiLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="API"
          value="Команды"
          hint="Компонент работает с намерениями, а не с формой массива."
          tone="cool"
        />
        <MetricCard
          label="Анти-паттерн"
          value="setItems(...)"
          hint="Когда экран напрямую меняет структуру hook-а, контракт разваливается."
          tone="accent"
        />
        <MetricCard
          label="Практика"
          value="Reset"
          hint="Domain API удобно тестировать и удобно читать прямо в JSX."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
