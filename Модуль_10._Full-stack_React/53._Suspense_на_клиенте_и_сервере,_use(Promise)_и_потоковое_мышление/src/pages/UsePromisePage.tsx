import { UsePromiseLab } from '../components/suspense-labs/UsePromiseLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function UsePromisePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="use(Promise)"
        title="Resource reading через use(Promise): как Suspense переносит ожидание внутрь render"
        copy="Эта страница показывает, что use(Promise) — не просто более короткий loading state. Компонент читает ресурс прямо в render, а Suspense boundary берёт на себя ожидание и reveal без ручной синхронизации через effect."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Стабильный cache key важнее короткого синтаксиса
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Один и тот же resource должен читаться по одному и тому же ключу, иначе
              Suspense превратится в повторное ожидание без пользы.
            </p>
          </div>
        }
      />

      <UsePromiseLab />

      <BeforeAfter
        beforeTitle="Хрупкая версия"
        before="Каждый рендер создаёт новый promise, поэтому чтение никогда не стабилизируется и компонент снова уходит в ожидание."
        afterTitle="Рабочая версия"
        after="Promise берётся из resource cache по стабильному ключу, а несколько компонентов могут разделять одно и то же ожидание."
      />

      <ProjectStudy
        files={projectStudyByLab['use-promise'].files}
        snippets={projectStudyByLab['use-promise'].snippets}
      />
    </div>
  );
}
