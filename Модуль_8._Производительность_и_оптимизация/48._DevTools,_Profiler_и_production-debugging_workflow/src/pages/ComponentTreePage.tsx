import { ComponentTreeLab } from '../components/profiling/ComponentTreeLab';
import { projectStudyByLab } from '../lib/project-study';
import { ProjectStudy, SectionIntro } from '../components/ui';

export function ComponentTreePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Component tree"
        title="Дерево компонентов нужно читать как карту ownership и ререндеров"
        copy="React DevTools особенно полезен там, где проблема ещё не локализована. Здесь вы смотрите, какие ветки обновляются вместе, где state поднят слишком высоко и почему рядом с одним действием вспыхивает половина экрана."
      />

      <ComponentTreeLab />

      <ProjectStudy
        files={projectStudyByLab['component-tree'].files}
        snippets={projectStudyByLab['component-tree'].snippets}
      />
    </div>
  );
}
