import { ClassStateLab } from '../components/legacy-react-labs/ClassStateLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ClassStatePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Class state"
        title="Как queue setState меняет поведение class components и почему updater-form важен для зависимых обновлений"
        copy="В class-based React важно отличать присваивание нового поля от вычисления следующего state на основе предыдущего. Старый код ломается не из-за синтаксиса класса, а из-за неверного понимания очереди обновлений."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Object-form может дать stale result</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если следующий state зависит от прошлого, object-form setState слишком легко
              читает устаревший snapshot.
            </p>
          </div>
        }
      />

      <ClassStateLab />

      <ProjectStudy
        files={projectStudyByLab.state.files}
        snippets={projectStudyByLab.state.snippets}
      />
    </div>
  );
}
