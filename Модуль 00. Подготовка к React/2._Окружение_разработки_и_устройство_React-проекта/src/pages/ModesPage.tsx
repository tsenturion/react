import { useState } from 'react';

import {
  BeforeAfter,
  ListBlock,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  analyzeRunMode,
  runModeOptions,
  runtimeExpectationOptions,
  type RunModeId,
  type RuntimeExpectationId,
} from '../lib/learning-model';
import { modesStudy } from '../lib/project-study';

const initialExpectations: RuntimeExpectationId[] = ['instant-feedback', 'hmr'];

export function ModesPage() {
  const [mode, setMode] = useState<RunModeId>('vite-dev');
  const [expectations, setExpectations] =
    useState<RuntimeExpectationId[]>(initialExpectations);

  // Режимы и ожидания — это хороший пример чистой конфигурации:
  // React-страница лишь собирает вход, а смысловой разбор делает model-слой.
  const analysis = analyzeRunMode(mode, expectations);

  const toggleExpectation = (expectationId: RuntimeExpectationId) => {
    setExpectations((current) =>
      current.includes(expectationId)
        ? current.filter((item) => item !== expectationId)
        : [...current, expectationId],
    );
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Dev server, build, preview и production-доставка"
        copy="Эта лаборатория отделяет быстрый цикл разработки от production-поверхности. Вы выбираете режим и ожидания, а затем видите, почему hot reload/HMR, dist, preview и Docker нельзя смешивать в одну общую команду «запустить проект»."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Режим
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {runModeOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`chip ${item.id === mode ? 'chip-active' : ''}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Чего вы ожидаете от режима
              </p>
              <div className="mt-3 space-y-2">
                {runtimeExpectationOptions.map((item) => {
                  const active = expectations.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleExpectation(item.id)}
                      className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                        active
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-black/10 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em]">
                          {active ? 'required' : 'off'}
                        </span>
                      </div>
                      <p
                        className={`mt-2 text-sm leading-6 ${active ? 'text-slate-200' : 'text-slate-500'}`}
                      >
                        {item.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 rounded-[24px] border border-black/10 bg-white/65 px-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Сводка по режиму
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Выбранный режим сверяется не с абстрактной теорией, а с тем, чего вы от
                  него ждёте прямо сейчас.
                </p>
              </div>
              <StatusPill tone={analysis.overall}>
                {analysis.overall === 'success'
                  ? 'match'
                  : analysis.overall === 'warn'
                    ? 'partial'
                    : 'mismatch'}
              </StatusPill>
            </div>

            <div className="space-y-3">
              {analysis.stages.map((stage) => (
                <div
                  key={stage.id}
                  className="rounded-[24px] border border-black/10 bg-white/65 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{stage.label}</p>
                    <StatusPill tone={stage.status}>{stage.status}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{stage.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <BeforeAfter
            beforeTitle="До"
            before={analysis.before}
            afterTitle="После"
            after={analysis.after}
          />
          <ListBlock
            title="Ожидания, которые сейчас не закрыты"
            items={
              analysis.unsupported.length > 0
                ? analysis.unsupported.map(
                    (item) => `${item}: выбранный режим не даёт это поведение.`,
                  )
                : ['Все выбранные ожидания совпадают с возможностями режима.']
            }
          />
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Типичные ошибки" items={analysis.mistakes} />
        <ListBlock title="Практический вывод" items={analysis.importance} />
      </Panel>

      <Panel>
        <ProjectStudy files={modesStudy.files} snippets={modesStudy.snippets} />
      </Panel>
    </div>
  );
}
