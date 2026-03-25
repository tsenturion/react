import { ActivityVisibilityLab } from '../components/priority-async/ActivityVisibilityLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ActivityPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Activity"
        title="Activity управляет видимостью поддерева без автоматической потери его локальной работы"
        copy="Здесь можно сравнить Activity boundary и обычный conditional render. Оба умеют скрывать экран, но только Activity нужен там, где скрываемое поддерево должно вернуться с сохранённым draft и локальным прогрессом."
      />

      <ActivityVisibilityLab />

      <ProjectStudy
        files={projectStudyByLab.activity.files}
        snippets={projectStudyByLab.activity.snippets}
      />
    </div>
  );
}
