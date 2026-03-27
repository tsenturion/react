import { useJourneyState } from '../state/JourneyStateContext';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { AuthFlowPanel } from '../components/e2e/AuthFlowPanel';
import { projectStudyByLab } from '../lib/project-study';

export function AuthJourneysPage() {
  const { session } = useJourneyState();

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Auth journeys"
        title="В E2E важен не факт логина сам по себе, а то, что после него браузер попадает в нужную защищённую ветку"
        copy="Авторизация становится системным сценарием тогда, когда она меняет маршруты, защищает экран, хранит намерение пользователя и определяет, куда ведёт путь после входа."
        aside={
          <StatusPill tone={session ? 'success' : 'warn'}>
            {session ? 'session open' : 'login required'}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current session"
          value={session ? `${session.name}` : 'none'}
          hint="Текущая сессия живёт в общем provider и влияет на скрытые маршруты проекта."
        />
        <MetricCard
          label="Protected screen"
          value="/workspace/release"
          hint="Именно этот route подтверждает, что вход завершился не только сменой флага, но и доступом к экрану."
          tone="accent"
        />
        <MetricCard
          label="Main rule"
          value="login -> redirect -> screen"
          hint="Сильный E2E-assert смотрит на финальный экран, а не на внутренние auth callbacks."
          tone="cool"
        />
      </div>

      <AuthFlowPanel />

      <BeforeAfter
        beforeTitle="Хрупкий подход"
        before="Тест проверяет только факт вызова login-функции или смену local flag внутри формы."
        afterTitle="Системный подход"
        after="Тест открывает защищённый URL, получает redirect на login, проходит вход и подтверждает возврат в нужную ветку приложения."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.auth} />
      </Panel>
    </div>
  );
}
