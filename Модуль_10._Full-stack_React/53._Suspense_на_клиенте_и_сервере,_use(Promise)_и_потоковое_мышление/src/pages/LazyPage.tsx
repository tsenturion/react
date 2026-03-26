import { LazyBoundaryLab } from '../components/suspense-labs/LazyBoundaryLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function LazyPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="lazy + Suspense"
        title="Как code splitting меняет UX только вместе с правильно выбранной границей"
        copy="React.lazy сам по себе просто откладывает загрузку кода. Полезным его делает Suspense boundary, которая решает, останется ли рядом уже открытый блок видимым или исчезнет вместе с новым pending chunk."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">lazy не проектирует reveal автоматически</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Одна глобальная граница вокруг нескольких lazy chunks легко превращает
              локальную загрузку в ощутимую потерю контекста для пользователя.
            </p>
          </div>
        }
      />

      <LazyBoundaryLab />

      <BeforeAfter
        beforeTitle="Грубая граница"
        before="Открытие второго lazy chunk скрывает первый уже загруженный блок, потому что оба висят под одной общей границей."
        afterTitle="Локальная граница"
        after="Каждый chunk грузится отдельно, а уже открытый контент остаётся на месте, пока соседний блок ещё pending."
      />

      <ProjectStudy
        files={projectStudyByLab.lazy.files}
        snippets={projectStudyByLab.lazy.snippets}
      />
    </div>
  );
}
