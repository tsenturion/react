import { RulesOrderLab } from '../components/advanced-hooks/RulesOrderLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function RulesPage() {
  const study = projectStudies.rules;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Rules of Hooks"
        copy="Правила hooks существуют не ради красивого стиля, а потому что React сопоставляет состояние hook-а по позиции вызова. Если порядок меняется между рендерами, React теряет возможность безопасно связать старое состояние с новым выполнением компонента."
      />

      <Panel>
        <RulesOrderLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Нельзя"
          value="Condition / loop"
          hint="Hook не должен появляться или исчезать по веткам данных."
          tone="accent"
        />
        <MetricCard
          label="Можно"
          value="Top-level"
          hint="Сначала вызывайте hooks, а уже потом ветвите поведение внутри них или после них."
          tone="cool"
        />
        <MetricCard
          label="Смысл"
          value="Предсказуемость"
          hint="React получает неизменную карту hook slots между рендерами."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
