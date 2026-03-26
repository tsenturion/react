import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { ConfigurationRolloutLab } from '../components/compiler-labs/ConfigurationRolloutLab';
import { projectStudyByLab } from '../lib/project-study';

export function ConfigurationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Config & rollout"
        title="Как включать React Compiler так, чтобы это было инженерным rollout, а не прыжком веры"
        copy="Эта страница связывает реальные файлы проекта с rollout-логикой: compiler plugin, compiler-aware lint preset, выбор первого surface и работа с риском при постепенном внедрении."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Lint-first discipline</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              До масштабного rollout важнее увидеть compiler diagnostics и baseline в
              Profiler, чем быстро удалить всё ручное memo API.
            </p>
          </div>
        }
      />

      <ConfigurationRolloutLab />

      <ProjectStudy
        files={projectStudyByLab.configuration.files}
        snippets={projectStudyByLab.configuration.snippets}
      />
    </div>
  );
}
