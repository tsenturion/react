import { Link, useNavigate } from 'react-router-dom';

import { Panel, SectionIntro, StatusPill } from '../components/ui';
import { useJourneyState } from '../state/JourneyStateContext';

export function ReleaseWorkspacePage() {
  const navigate = useNavigate();
  const { session, logout } = useJourneyState();

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Protected route"
        title="Защищённый экран открыт"
        copy="Если вы видите этот экран, значит guard, login flow и возврат по intended route сработали как единый системный путь."
        aside={<StatusPill tone="success">/workspace/release</StatusPill>}
      />

      <Panel className="space-y-4">
        <div
          role="status"
          className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-950"
        >
          Protected route reached для <strong>{session?.name}</strong> с ролью{' '}
          <strong>{session?.role}</strong>.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Почему это важно
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              E2E подтверждает не локальную форму логина, а то, что после неё браузер
              действительно вошёл в нужную ветку приложения.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Следующий системный шаг
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Отсюда можно пойти дальше в form journey и проверить, что путь продолжается
              на review screen без разрыва в состоянии приложения.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/form-journeys"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Открыть form journey
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              void navigate('/auth-journeys');
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Выйти и вернуться в лабораторию
          </button>
        </div>
      </Panel>
    </div>
  );
}
