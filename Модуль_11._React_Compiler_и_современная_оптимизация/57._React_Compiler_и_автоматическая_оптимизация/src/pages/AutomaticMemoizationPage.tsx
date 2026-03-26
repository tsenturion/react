import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { AutomaticMemoizationLab } from '../components/compiler-labs/AutomaticMemoizationLab';
import { projectStudyByLab } from '../lib/project-study';

export function AutomaticMemoizationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Auto memoization"
        title="Когда compiler-ready код даёт почти тот же выигрыш, что и ручная мемоизация, но остаётся заметно чище"
        copy="Здесь важно не выучить новый “правильный синтаксис”, а увидеть разницу между полезной ручной оптимизацией, избыточным memo-шумом и кодом, который React Compiler может оптимизировать автоматически."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Цель не в удалении useMemo любой ценой</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Цель в том, чтобы не держать ручную оптимизацию там, где она больше не
              оправдывает свою сложность.
            </p>
          </div>
        }
      />

      <AutomaticMemoizationLab />

      <BeforeAfter
        beforeTitle="До compiler mindset"
        before="Родитель дрожит от state churn, а код обрастает `memo`, `useMemo` и `useCallback` на каждом втором шаге, потому что других способов остановить повторную работу дерева почти не видно."
        afterTitle="После compiler mindset"
        after="Сначала пишут чистый compiler-friendly компонент, затем включают profiling и только потом оставляют ручную мемоизацию там, где она реально нужна из-за library contracts или внешнего caching."
      />

      <ProjectStudy
        files={projectStudyByLab.automatic.files}
        snippets={projectStudyByLab.automatic.snippets}
      />
    </div>
  );
}
