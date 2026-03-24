import { useMemo, useState } from 'react';

import { summarizeArchitectureScenario } from '../../lib/accessibility-runtime';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function QualityBlueprintLab() {
  const [hasForms, setHasForms] = useState(true);
  const [hasNavigation, setHasNavigation] = useState(true);
  const [hasDialog, setHasDialog] = useState(true);
  const [hasCustomWidget, setHasCustomWidget] = useState(false);
  const [hasAsyncStatus, setHasAsyncStatus] = useState(true);
  const [testsByBehavior, setTestsByBehavior] = useState(true);

  const summary = useMemo(
    () =>
      summarizeArchitectureScenario({
        hasForms,
        hasNavigation,
        hasDialog,
        hasCustomWidget,
        hasAsyncStatus,
        testsByBehavior,
      }),
    [
      hasAsyncStatus,
      hasCustomWidget,
      hasDialog,
      hasForms,
      hasNavigation,
      testsByBehavior,
    ],
  );

  const surfaces = [
    {
      label: 'Forms',
      active: hasForms,
      hint: 'labels, helper text, errors, submit flow',
    },
    {
      label: 'Navigation',
      active: hasNavigation,
      hint: 'landmarks, route changes, skip link, current location',
    },
    {
      label: 'Dialog',
      active: hasDialog,
      hint: 'initial focus, escape, return focus',
    },
    {
      label: 'Custom widget',
      active: hasCustomWidget,
      hint: 'roles, keyboard map, compare with native alternative',
    },
    {
      label: 'Async status',
      active: hasAsyncStatus,
      hint: 'loading, status, alert, retry, consistent announcements',
    },
    {
      label: 'Behavior tests',
      active: testsByBehavior,
      hint: 'queries by role/name and end-user paths',
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Architecture score"
          value={String(summary.score)}
          hint="Чем больше экран зависит от форм, диалогов, навигации и custom widgets, тем раньше accessibility должна войти в архитектуру."
        />
        <MetricCard
          label="Verdict"
          value={summary.verdict}
          hint="Когда доступность планируется поздно, качество расползается между компонентами, маршрутами и тестами."
          tone="accent"
        />
        <MetricCard
          label="Active surfaces"
          value={String(surfaces.filter((item) => item.active).length)}
          hint="Blueprint показывает, какие части экрана сильнее всего влияют на устойчивость интерфейса."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Accessibility architecture
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Карта качества рождается из экранов, состояний и пользовательских путей
            </h2>
          </div>
          <StatusPill tone={summary.score >= 70 ? 'success' : 'warn'}>
            architecture first
          </StatusPill>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasForms}
              onChange={(event) => setHasForms(event.target.checked)}
            />
            <span>Экран содержит формы</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasNavigation}
              onChange={(event) => setHasNavigation(event.target.checked)}
            />
            <span>Экран зависит от маршрутов и навигации</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasDialog}
              onChange={(event) => setHasDialog(event.target.checked)}
            />
            <span>Есть диалог или popover layer</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasCustomWidget}
              onChange={(event) => setHasCustomWidget(event.target.checked)}
            />
            <span>Есть кастомный widget вместо native control</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasAsyncStatus}
              onChange={(event) => setHasAsyncStatus(event.target.checked)}
            />
            <span>Есть загрузка, ошибки и retry</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={testsByBehavior}
              onChange={(event) => setTestsByBehavior(event.target.checked)}
            />
            <span>Тесты описывают поведение, а не реализацию</span>
          </label>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          {surfaces.map((item) => (
            <div
              key={item.label}
              className={`rounded-[22px] border px-4 py-4 ${
                item.active
                  ? 'border-teal-300 bg-teal-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <StatusPill tone={item.active ? 'success' : 'warn'}>
                  {item.active ? 'active' : 'idle'}
                </StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.hint}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <ListBlock title="Архитектурные приоритеты" items={summary.priorities} />
        </Panel>
        <Panel>
          <ListBlock
            title="Как читать итоговый blueprint"
            items={[
              'Если экран живёт на формах и async status, доступность должна проектироваться до начала детальной стилизации.',
              'Если появляется custom widget, сравните его с native alternative и зафиксируйте keyboard map до реализации.',
              'Если tests не user-centric, даже хорошая архитектура быстро теряет страховку от регрессий.',
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}
