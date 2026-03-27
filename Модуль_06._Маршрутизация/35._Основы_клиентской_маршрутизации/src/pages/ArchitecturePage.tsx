import clsx from 'clsx';
import { useState } from 'react';

import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';
import { recommendRoutePlacement } from '../lib/routing-domain';

export function ArchitecturePage() {
  const [hasShareableUrl, setHasShareableUrl] = useState(true);
  const [representsScreen, setRepresentsScreen] = useState(true);
  const [needsBrowserHistory, setNeedsBrowserHistory] = useState(true);
  const [deepLinkingMatters, setDeepLinkingMatters] = useState(true);
  const [onlyTogglesUiFragment, setOnlyTogglesUiFragment] = useState(false);
  const recommendation = recommendRoutePlacement({
    hasShareableUrl,
    representsScreen,
    needsBrowserHistory,
    deepLinkingMatters,
    onlyTogglesUiFragment,
  });
  const study = projectStudies.architecture;

  const toggles = [
    {
      label: 'Состоянием можно поделиться через URL',
      value: hasShareableUrl,
      toggle: () => setHasShareableUrl((current) => !current),
    },
    {
      label: 'Это полноценный экран',
      value: representsScreen,
      toggle: () => setRepresentsScreen((current) => !current),
    },
    {
      label: 'Нужна работа back/forward history',
      value: needsBrowserHistory,
      toggle: () => setNeedsBrowserHistory((current) => !current),
    },
    {
      label: 'Deep link реально важен',
      value: deepLinkingMatters,
      toggle: () => setDeepLinkingMatters((current) => !current),
    },
    {
      label: 'Это только локальный UI-fragment',
      value: onlyTogglesUiFragment,
      toggle: () => setOnlyTogglesUiFragment((current) => !current),
    },
  ];

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Когда экрану нужен маршрут"
        copy="Маршрутизация полезна не везде. Здесь вы проверяете, достоин ли конкретный сценарий собственного URL, или его честнее оставить в локальном UI-состоянии."
      />

      <Panel className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          {toggles.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.toggle}
              className={clsx(
                'rounded-[24px] border p-5 text-left transition',
                item.value
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-slate-200 bg-white hover:bg-slate-50',
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Toggle
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.value ? 'Да' : 'Нет'}
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recommendation
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {recommendation.approach}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Score: {recommendation.score}
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Почему так
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {recommendation.rationale.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Anti-pattern
            </p>
            <p className="mt-3 text-sm leading-6 text-amber-950">
              {recommendation.antiPattern}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Route"
          value="Addressable screen"
          hint="Подходит для самостоятельных экранов, deep links и историй браузера."
          tone="cool"
        />
        <MetricCard
          label="Local state"
          value="UI fragment"
          hint="Подходит для небольших переключателей, которые не стоят собственного адреса."
        />
        <MetricCard
          label="Main rule"
          value="URL must earn itself"
          hint="Маршрут должен отражать самостоятельный пользовательский сценарий, а не любой toggle подряд."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
