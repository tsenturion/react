import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { UpgradeDisciplineLab } from '../components/migration-labs/UpgradeDisciplineLab';
import { projectStudyByLab } from '../lib/project-study';

export function UpgradeDisciplinePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="React 18.3 → 19"
        title="Обновление версии полезно рассматривать как audit assumptions, а не как список механических replacements"
        copy="Эта страница показывает, что bridge release и release notes полезны только тогда, когда они переводятся в список реальных предположений: что считается безопасным в effects, где refs служат скрытым каналом, как ведут себя формы и что происходит в supporting code."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Assumptions first</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если версия меняется, а assumptions остаются неявными, риск просто
              переносится из compile-time в runtime.
            </p>
          </div>
        }
      />

      <UpgradeDisciplineLab />

      <BeforeAfter
        beforeTitle="Codemod-only upgrade"
        before="Переход выглядит завершённым, как только deprecated вызовы заменены и проект снова собирается."
        afterTitle="Migration discipline"
        after="Переход считается доказанным только после того, как assumptions зафиксированы, проверены тестами и прошли staged rollout."
      />

      <ProjectStudy
        files={projectStudyByLab.upgrade.files}
        snippets={projectStudyByLab.upgrade.snippets}
      />
    </div>
  );
}
