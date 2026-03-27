import { PurityLab } from '../components/advanced-hooks/PurityLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function PurityPage() {
  const study = projectStudies.purity;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Purity, render-phase и ref pitfalls"
        copy="Компонент и hooks должны оставаться предсказуемыми. Это означает: не мутировать ref в теле компонента, не вызывать setState прямо в render-phase и не выносить чистые вычисления в effect без необходимости."
      />

      <Panel>
        <PurityLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Чистота"
          value="Функция от входов"
          hint="Рендер зависит только от props, state и context."
          tone="cool"
        />
        <MetricCard
          label="Опасно"
          value="ref mutation"
          hint="Скрытые записи во время рендера разрушают модель выполнения."
          tone="accent"
        />
        <MetricCard
          label="Полезный ориентир"
          value="Derived in render"
          hint="Если вычисление чистое, React ожидает увидеть его прямо в рендере."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
