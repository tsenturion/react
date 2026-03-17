import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { diagnosticScenarios } from '../lib/learning-model';
import { diagnosticsStudy } from '../lib/project-study';

export function DiagnosticsPage() {
  const [scenarioId, setScenarioId] = useState(diagnosticScenarios[0].id);
  const scenario =
    diagnosticScenarios.find((item) => item.id === scenarioId) ?? diagnosticScenarios[0];

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Типовые поломки React-проекта"
        copy="Эта страница собрана как диагностический атлас. Вы выбираете конкретную поломку и сразу видите: на каком слое она рвёт цепочку, в каких файлах искать причину, что выведет терминал и почему ошибка важна не только как локальный баг."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-2">
            {diagnosticScenarios.map((item) => {
              const active = item.id === scenario.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScenarioId(item.id)}
                  className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                    active
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-black/10 bg-white/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{item.title}</span>
                    <StatusPill tone={item.tone}>{item.tone}</StatusPill>
                  </div>
                  <p
                    className={`mt-2 text-sm leading-6 ${active ? 'text-slate-200' : 'text-slate-500'}`}
                  >
                    {item.stage}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-black/10 bg-white/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Выбранная поломка
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    {scenario.title}
                  </h2>
                </div>
                <StatusPill tone={scenario.tone}>{scenario.tone}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{scenario.symptom}</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <MetricCard
                label="Команда"
                value={scenario.command}
                hint="Поломка всегда привязана к конкретному шагу workflow, а не к абстрактному «React не работает»."
                tone="accent"
              />
              <MetricCard
                label="Слой"
                value={scenario.stage}
                hint="Так проще отделить ошибки manifest, imports, HTML entry, build и deployment."
                tone="cool"
              />
              <MetricCard
                label="Исправление"
                value={scenario.fix}
                hint="Важна не только симптоматика, но и точное место, где нарушился контракт проекта."
                tone="dark"
              />
            </div>

            <CodeBlock label="terminal output" code={scenario.terminalLines.join('\n')} />
          </div>
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Почему это важно" items={scenario.whyItMatters} />
        <ListBlock
          title="Где искать в проекте"
          items={scenario.files.map(
            (item) => `${item}: именно здесь стоит проверять цепочку запуска.`,
          )}
        />
      </Panel>

      <Panel>
        <ProjectStudy
          files={diagnosticsStudy.files}
          snippets={diagnosticsStudy.snippets}
        />
      </Panel>
    </div>
  );
}
