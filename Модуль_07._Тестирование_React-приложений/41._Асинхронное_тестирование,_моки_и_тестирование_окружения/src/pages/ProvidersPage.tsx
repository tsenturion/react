import { useState } from 'react';

import { ProviderHarnessLab } from '../components/async-testing/ProviderHarnessLab';
import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import { summarizeProviderHarness } from '../lib/async-testing-runtime';
import {
  AsyncTestHarnessProvider,
  type AssertionMode,
  type NetworkMode,
} from '../state/AsyncTestHarnessContext';

export function ProvidersPage() {
  const [assertionMode, setAssertionMode] = useState<AssertionMode>('integration');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('mocked-http');
  const [seedKey, setSeedKey] = useState(0);
  const [coverage, setCoverage] = useState({
    needsRouter: true,
    needsContext: true,
    needsSearchParams: true,
    hidesUserIntent: false,
  });

  const summary = summarizeProviderHarness(coverage);
  const tone = coverage.hidesUserIntent
    ? 'error'
    : summary.verdict === 'Provider helper здесь не обязателен'
      ? 'warn'
      : 'success';

  function toggle(field: keyof typeof coverage) {
    setCoverage((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Providers and context"
        title="Компоненту с router и context нужен focused harness, а не тяжёлый скрытый framework"
        copy="На этой странице видно, где helper действительно избавляет от boilerplate, а где начинает прятать исходные условия сценария. Важна не абстрактная переиспользуемость, а прозрачность тестового контракта."
        aside={<StatusPill tone={tone}>{summary.verdict}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Router Need"
          value={coverage.needsRouter ? 'yes' : 'no'}
          hint="Route и search params должны быть явной частью test arrangement."
        />
        <MetricCard
          label="Assertion Mode"
          value={assertionMode}
          hint="Initial provider state показывает, что helper задаёт контекст сценария, а не магию после render."
          tone="accent"
        />
        <MetricCard
          label="Network Mode"
          value={networkMode}
          hint="Даже у test harness есть собственный контракт: isolation и integration проверяются по-разному."
          tone="cool"
        />
      </div>

      <BeforeAfter
        beforeTitle="Тяжёлый helper"
        before="Custom render сам строит половину пользовательского пути, скрывает route и не даёт быстро понять исходные условия теста."
        afterTitle="Focused helper"
        after="Helper поднимает только MemoryRouter и provider, а route, search params и действия пользователя остаются видны прямо в тесте."
      />

      <Panel className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Стартовый assertion mode
              </span>
              <select
                value={assertionMode}
                onChange={(event) =>
                  setAssertionMode(event.target.value as AssertionMode)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                <option value="integration">integration</option>
                <option value="isolated">isolated</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Стартовый network mode
              </span>
              <select
                value={networkMode}
                onChange={(event) => setNetworkMode(event.target.value as NetworkMode)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                <option value="mocked-http">mocked-http</option>
                <option value="injected-client">injected-client</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setSeedKey((current) => current + 1)}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Смонтировать заново с этим harness state
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={coverage.needsRouter}
                  onChange={() => toggle('needsRouter')}
                />
                Компонент зависит от router
              </label>
              <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={coverage.needsContext}
                  onChange={() => toggle('needsContext')}
                />
                Компонент зависит от context
              </label>
              <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={coverage.needsSearchParams}
                  onChange={() => toggle('needsSearchParams')}
                />
                Важны search params
              </label>
              <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={coverage.hidesUserIntent}
                  onChange={() => toggle('hidesUserIntent')}
                />
                Helper прячет смысл сценария
              </label>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <StatusPill tone={tone}>{summary.verdict}</StatusPill>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{summary.contract}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {summary.helperShape}
              </p>
              <div className="mt-4">
                <ListBlock
                  title="Риски текущего helper"
                  items={
                    summary.risks.length > 0
                      ? summary.risks
                      : [
                          'Явных рисков не видно: helper скрывает только повторяемую инфраструктуру.',
                        ]
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Remount по ключу позволяет снова увидеть стартовый provider snapshot,
          что полезно и для самой лаборатории, и для её тестового контракта. */}
      <AsyncTestHarnessProvider
        key={`${assertionMode}-${networkMode}-${seedKey}`}
        initialState={{ assertionMode, networkMode }}
      >
        <ProviderHarnessLab />
      </AsyncTestHarnessProvider>

      <Panel>
        <ProjectStudy {...projectStudyByLab.providers} />
      </Panel>
    </div>
  );
}
