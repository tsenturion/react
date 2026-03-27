import { ProgressiveLoadingLab } from '../components/lazy-loading/ProgressiveLoadingLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ProgressiveLoadingPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Progressive loading"
        title="Отзывчивость строится через сохранённый контекст, а не только через меньший bundle"
        copy="Spinner, skeleton и shell-first дают три разных ощущения одного и того же ожидания. Эта страница показывает, как fallback влияет на восприятие экрана до прихода chunk."
      />

      <ProgressiveLoadingLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['progressive-loading']} />
      </Panel>
    </div>
  );
}
