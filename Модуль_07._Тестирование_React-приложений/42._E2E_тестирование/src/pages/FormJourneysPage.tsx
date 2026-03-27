import { useJourneyState } from '../state/JourneyStateContext';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { ReleaseFormLab } from '../components/e2e/ReleaseFormLab';
import { projectStudyByLab } from '../lib/project-study';

export function FormJourneysPage() {
  const { lastSubmission } = useJourneyState();

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Form journeys"
        title="Форма становится системным сценарием, когда после submit меняется не только локальный state, но и сам экран"
        copy="Важный E2E-путь на форме начинается с ввода и ошибок, но заканчивается уже на отдельном review route, где пользователь видит итог всей операции."
        aside={
          <StatusPill tone={lastSubmission ? 'success' : 'warn'}>
            {lastSubmission ? 'review visited' : 'draft only'}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Draft target"
          value="/submission-review"
          hint="Финальный экран вынесен из формы, чтобы путь был виден как полноценная навигация."
        />
        <MetricCard
          label="Last review"
          value={lastSubmission?.title ?? 'ещё не отправлялся'}
          hint="Контекст хранит только итог маршрута, а не промежуточные детали поля."
          tone="accent"
        />
        <MetricCard
          label="Main rule"
          value="input -> submit -> review route"
          hint="Такая цепочка объясняет, что именно должен подтверждать E2E на формах."
          tone="cool"
        />
      </div>

      <ReleaseFormLab />

      <BeforeAfter
        beforeTitle="Локальный успех"
        before="После submit компонент просто показывает зелёную плашку и остаётся на том же экране."
        afterTitle="Наблюдаемый journey"
        after="После submit путь продолжается на review route, где итог виден уже как новый screen state приложения."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.forms} />
      </Panel>
    </div>
  );
}
