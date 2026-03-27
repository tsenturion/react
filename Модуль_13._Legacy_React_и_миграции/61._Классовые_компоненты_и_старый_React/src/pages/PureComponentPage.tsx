import { PureComponentLab } from '../components/legacy-react-labs/PureComponentLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function PureComponentPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="PureComponent"
        title="Как shallow compare помогает и как он же ломается, когда legacy код мутирует объекты по ссылке"
        copy="PureComponent - это не магия и не самостоятельная архитектура. Он просто не ререндерит класс, пока верхнеуровневые props и state поверхностно равны. Поэтому цена ошибки в immutable discipline здесь особенно заметна."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Reference equality matters</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              PureComponent выигрывает только там, где ссылки действительно отражают факт
              изменения данных.
            </p>
          </div>
        }
      />

      <PureComponentLab />

      <BeforeAfter
        beforeTitle="Mutation by reference"
        before="Объект меняется внутри, но ссылка остаётся прежней. PureComponent считает props неизменными и пропускает ререндер."
        afterTitle="Immutable update"
        after="Новая ссылка на объект делает change видимым для shallow compare и позволяет PureComponent вести себя предсказуемо."
      />

      <ProjectStudy
        files={projectStudyByLab.pure.files}
        snippets={projectStudyByLab.pure.snippets}
      />
    </div>
  );
}
