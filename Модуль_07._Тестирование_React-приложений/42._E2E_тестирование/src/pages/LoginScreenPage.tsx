import { useLocation } from 'react-router-dom';

import { AuthFlowPanel } from '../components/e2e/AuthFlowPanel';
import { Panel, SectionIntro, StatusPill } from '../components/ui';

export function LoginScreenPage() {
  const location = useLocation();

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Hidden login route"
        title="Этот экран не виден в верхнем меню, но именно через него проходит реальный protected journey"
        copy="Скрытые маршруты нужны затем, чтобы E2E проверял настоящее приложение, а не специально упрощённую витрину для урока."
        aside={<StatusPill tone="warn">/auth/login</StatusPill>}
      />

      <Panel className="rounded-[24px] border border-slate-200 bg-slate-50">
        <p className="text-sm leading-6 text-slate-600">
          Текущий URL:
          <code className="ml-2 break-all text-xs font-semibold text-slate-900">
            {`${location.pathname}${location.search}`}
          </code>
        </p>
      </Panel>

      <AuthFlowPanel mode="screen" />
    </div>
  );
}
