import { ServerSuspenseLab } from '../components/suspense-labs/ServerSuspenseLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ServerPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Server Suspense"
        title="Как Suspense на сервере меняет delivery HTML и потоковую сборку страницы"
        copy="На сервере Suspense — это уже не только локальный fallback. Границы влияют на то, когда flush-ится shell, как приходят части HTML и почему streaming требует мыслить экран как набор независимых reveal-этапов."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Streaming ускоряет reveal HTML, но не отменяет hydration
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              После раннего shell и streamed boundaries клиенту всё равно нужно оживить их
              на своей стороне.
            </p>
          </div>
        }
      />

      <ServerSuspenseLab />

      <BeforeAfter
        beforeTitle="Клиентское ожидание"
        before="Полезный HTML появляется только после старта клиента и готовности данных, поэтому весь экран фактически ждёт целиком."
        afterTitle="Потоковый серверный reveal"
        after="Shell приходит раньше, fallback и готовые boundaries раскрываются по частям, а экран перестаёт быть монолитной загрузкой."
      />

      <ProjectStudy
        files={projectStudyByLab.server.files}
        snippets={projectStudyByLab.server.snippets}
      />
    </div>
  );
}
