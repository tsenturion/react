import { StreamingHydrationLab } from '../components/render-modes/StreamingHydrationLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function StreamingPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Streaming"
        title="Streaming SSR и selective hydration как разбор большого экрана на границы"
        copy="Streaming нужен не затем, чтобы просто «стримить что-нибудь». Его смысл в том, чтобы shell и критичные блоки появлялись раньше, а hydration следовала за пользовательским намерением, а не за механическим порядком дерева."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Streaming без правильных boundaries мало что даёт
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если весь экран завязан на одну общую Suspense boundary, потоковый рендер
              теряет главное преимущество.
            </p>
          </div>
        }
      />

      <StreamingHydrationLab />

      <BeforeAfter
        beforeTitle="Слабая граница"
        before="Один большой fallback блокирует смысл streaming: shell уже есть, но полезные секции всё равно появляются слишком поздно."
        afterTitle="Сильная граница"
        after="Критичные поддеревья отделены так, чтобы HTML приходил частями, а пользовательское взаимодействие могло ускорять hydration именно нужной секции."
      />

      <ProjectStudy
        files={projectStudyByLab.streaming.files}
        snippets={projectStudyByLab.streaming.snippets}
      />
    </div>
  );
}
