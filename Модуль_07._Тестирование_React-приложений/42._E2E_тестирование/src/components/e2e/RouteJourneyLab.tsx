import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { routeScreens } from '../../lib/e2e-domain';
import { Panel, StatusPill } from '../ui';

const routeStages = [
  {
    id: 'catalog',
    label: 'Каталог сценариев',
    summary:
      'Путь начинается с экрана, где пользователь выбирает нужный сценарий и понимает, куда идти дальше.',
    assertion:
      'В системном тесте здесь полезно проверять не только текст, но и URL, потому что именно он фиксирует воспроизводимый вход в путь.',
  },
  {
    id: 'filters',
    label: 'Фильтры в URL',
    summary:
      'Следующий экран показывает, как поисковые параметры удерживают выбранную вкладку и делают путь воспроизводимым после refresh.',
    assertion:
      'E2E должен подтверждать, что адресная строка и экран говорят об одном и том же состоянии.',
  },
  {
    id: 'handoff',
    label: 'Передача в защищённый flow',
    summary:
      'Финальный шаг переводит пользователя из общего каталога в защищённый релизный экран, где уже начинает играть роль auth state.',
    assertion:
      'Этот переход полезно проверять целиком: стартовая точка, redirect и итоговый защищённый screen.',
  },
] as const;

export function RouteJourneyLab() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentStage =
    routeStages.find((item) => item.id === searchParams.get('screen')) ?? routeStages[0];

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Route journey sandbox
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Переключайте шаги пользовательского пути через URL
            </h2>
          </div>
          <StatusPill tone="success">{currentStage.id}</StatusPill>
        </div>

        <div className="flex flex-wrap gap-2">
          {routeStages.map((stage) => (
            <Link
              key={stage.id}
              to={`/route-journeys?screen=${stage.id}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                currentStage.id === stage.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {stage.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Текущий шаг
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              {currentStage.label}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {currentStage.summary}
            </p>
            <p className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
              <strong>Что лучше утверждать в E2E:</strong> {currentStage.assertion}
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Текущий адрес
            </p>
            <code className="mt-3 block break-all text-sm font-semibold text-slate-900">
              {`${location.pathname}${location.search}`}
            </code>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Когда шаги выражены через URL, Playwright может подтверждать путь целиком, а
              не только локальные DOM-изменения в одном компоненте.
            </p>
          </div>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              System checkpoints
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Реальные экраны, по которым проходит браузерный сценарий
            </h2>
          </div>
          <Link
            to="/workspace/release"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Открыть защищённый релизный экран
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {routeScreens.map((screen) => (
            <div
              key={screen.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {screen.path}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {screen.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{screen.purpose}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
