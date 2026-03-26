import { RenderingPlaybookLab } from '../components/render-modes/RenderingPlaybookLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Как выбирать между CSR, SSR, SSG и streaming без догматизма"
        copy="Финальная лаборатория собирает все ограничения вместе: SEO, статичность, per-request данные, персонализацию, стоимость сервера и потребность в раннем shell."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Нет универсально правильного режима</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Верный выбор зависит от природы экрана и инфраструктуры, а не от стремления
              использовать максимум server-side возможностей.
            </p>
          </div>
        }
      />

      <RenderingPlaybookLab />

      <BeforeAfter
        beforeTitle="Плохой критерий"
        before="Выбор строится по знакомству с API: если есть SSR, значит нужно SSR; если есть streaming, значит его надо включить везде."
        afterTitle="Рабочий критерий"
        after="Выбор строится по тому, какой HTML нужен в первый момент, как часто меняются данные, что индексируется и насколько оправдана серверная стоимость."
      />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
