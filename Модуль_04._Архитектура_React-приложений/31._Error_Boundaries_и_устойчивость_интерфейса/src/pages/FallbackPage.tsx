import { FallbackUxLab } from '../components/error-boundaries/FallbackUxLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function FallbackPage() {
  const study = projectStudies.fallback;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Fallback UX"
        copy="Fallback нужен не для того, чтобы спрятать проблему под общую плашку, а чтобы сохранить контекст, объяснить scope сбоя и дать адекватный путь восстановления. Здесь вы сравниваете слабый и сильный fallback на одном и том же сбое."
      />

      <Panel>
        <FallbackUxLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Слабый fallback"
        before="Без контекста, без recovery path и без понимания, что именно продолжает работать, fallback превращается в тупик."
        afterTitle="Сильный fallback"
        after="Хороший fallback объясняет scope проблемы, сохраняет живой контекст вокруг и предлагает действие: retry, safe mode, reset filters или возврат на безопасный маршрут."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Хороший сигнал"
          value="Keeps context"
          hint="Пользователь не теряет понимание, какая часть экрана сломалась и что ещё осталось рабочим."
          tone="cool"
        />
        <MetricCard
          label="Плохой сигнал"
          value="Opaque message"
          hint="Фраза «Что-то пошло не так» без границ проблемы и recovery action почти бесполезна."
        />
        <MetricCard
          label="Практический эффект"
          value="Safer degradation"
          hint="Интерфейс деградирует контролируемо, а не превращается в непредсказуемую пустую область."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
