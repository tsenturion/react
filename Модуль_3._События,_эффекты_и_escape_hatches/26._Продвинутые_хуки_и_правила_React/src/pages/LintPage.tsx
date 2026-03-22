import { LintDisciplineLab } from '../components/advanced-hooks/LintDisciplineLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function LintPage() {
  const study = projectStudies.lint;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Lint-first discipline и guardrails React"
        copy="`eslint-plugin-react-hooks` важен не как формальная галочка перед merge, а как система ранних ограничений. Она фиксирует cases, где код ещё выглядит рабочим, но уже нарушает rules of hooks, зависимости effect-а, purity или ref-boundaries."
      />

      <Panel>
        <LintDisciplineLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Минимум"
          value="recommended"
          hint="Rules of hooks и exhaustive-deps закрывают базовые, но уже критичные риски."
        />
        <MetricCard
          label="Расширение"
          value="recommended-latest"
          hint="Purity и refs добавляют ещё один слой guardrail-ограничений."
          tone="cool"
        />
        <MetricCard
          label="Дисциплина"
          value="Lint first"
          hint="Чем раньше правило срабатывает, тем дешевле исправление и тем меньше скрытых багов уходит дальше."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
