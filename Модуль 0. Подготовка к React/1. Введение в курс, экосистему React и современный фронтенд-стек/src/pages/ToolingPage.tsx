import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildDockerPreview,
  buildPackagePreview,
  collectToolingDiagnostics,
  runToolingCommand,
  type ToolingCommandId,
  type ToolingConfig,
} from '../lib/learning-model';
import { toolingStudy } from '../lib/project-study';
import { stackVersions } from '../lib/stack-meta';

const baseConfig: ToolingConfig = {
  nodeVersion: 20,
  hasDevScript: true,
  hasBuildScript: true,
  hasTestScript: true,
  hasReactDep: true,
  hasViteDep: true,
  hasRouterDep: true,
  hasVitestDep: true,
  usesRouter: true,
  envPrefixOk: true,
  importCaseMatches: true,
  dockerSpaFallback: true,
};

const commandButtons: { id: ToolingCommandId; label: string }[] = [
  { id: 'dev', label: 'npm run dev' },
  { id: 'build', label: 'npm run build' },
  { id: 'test', label: 'npm test' },
  { id: 'docker', label: 'docker run' },
];

export function ToolingPage() {
  const [config, setConfig] = useState<ToolingConfig>(baseConfig);
  const [command, setCommand] = useState<ToolingCommandId>('dev');

  // И диагностика, и "вывод терминала" строятся из одной конфигурации.
  // Это делает лабораторию тестируемой и не привязывает правила к JSX-разметке.
  const diagnostics = collectToolingDiagnostics(config);
  const result = runToolingCommand(config, command);

  const toggle = (key: keyof ToolingConfig) => {
    setConfig((current) => ({
      ...current,
      [key]: typeof current[key] === 'boolean' ? !current[key] : current[key],
    }));
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Node.js, npm, scripts, тесты и Docker как часть React-проекта"
        copy="Последняя часть вводной темы переводит разговор в инженерную плоскость. React-приложение ценно не только как UI, но и как воспроизводимая система: со scripts, проверками, production build и контейнеризацией."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="rounded-[24px] border border-black/10 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Версия Node.js
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[16, 18, 20, 22].map((version) => (
                  <button
                    key={version}
                    type="button"
                    onClick={() =>
                      setConfig((current) => ({
                        ...current,
                        nodeVersion: version as ToolingConfig['nodeVersion'],
                      }))
                    }
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                      config.nodeVersion === version
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-black/10 bg-white text-slate-700'
                    }`}
                  >
                    {version}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В этой версии проекта{' '}
                <span className="font-semibold text-slate-900">
                  Vite {stackVersions.vite}
                </span>{' '}
                считается рабочим на Node `20` и `22`. Значения `16` и `18`
                здесь показывают устаревшее окружение и типичный отказ toolchain.
              </p>
            </div>

            <div className="space-y-2">
              {[
                ['hasDevScript', 'Есть `dev` script'],
                ['hasBuildScript', 'Есть `build` script'],
                ['hasTestScript', 'Есть `test` script'],
                ['hasReactDep', 'React установлен'],
                ['hasViteDep', 'Vite установлен'],
                ['hasRouterDep', 'Роутер установлен'],
                ['hasVitestDep', 'Vitest установлен'],
                ['usesRouter', 'Приложение использует роутинг'],
                ['envPrefixOk', 'Клиентские env имеют `VITE_`'],
                ['importCaseMatches', 'Регистры путей совпадают'],
                ['dockerSpaFallback', 'Docker-сервер умеет SPA fallback'],
              ].map(([key, label]) => {
                const typedKey = key as keyof ToolingConfig;
                const active = Boolean(config[typedKey]);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(typedKey)}
                    className={`flex w-full items-center justify-between gap-3 rounded-[22px] border px-4 py-3 text-left transition ${
                      active
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-black/10 bg-white/60 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{label}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em]">
                      {active ? 'on' : 'off'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {commandButtons.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCommand(item.id)}
                  className={`chip ${item.id === command ? 'chip-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="rounded-[24px] border border-black/10 bg-white/65 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Симуляция команды
                  </p>
                  <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-950">
                    {result.title}
                  </h2>
                </div>
                <StatusPill tone={result.status}>{result.status}</StatusPill>
              </div>
              <div className="mt-4 rounded-[24px] bg-slate-950 p-4 text-sm text-slate-100">
                <pre className="overflow-x-auto leading-6">
                  <code>{result.lines.join('\n')}</code>
                </pre>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{result.fix}</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <CodeBlock label="package.json preview" code={buildPackagePreview(config)} />
              <CodeBlock label="nginx/docker preview" code={buildDockerPreview(config)} />
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ListBlock
          title="Живые диагностики"
          items={
            diagnostics.length > 0
              ? diagnostics.map(
                  (item) =>
                    `${item.title}: ${item.message} Исправление: ${item.fix}`,
                )
              : ['Конфигурация выглядит согласованной: локальный запуск, build, tests и Docker работают как единая система.']
          }
        />
        <ListBlock
          title="Почему это часть вводной темы"
          items={[
            'Node.js и npm нужны не как фон, а как обязательная часть современного React workflow.',
            'Scripts переводят знания из "я помню команду" в воспроизводимый проект.',
            'Docker и тесты показывают, что современный frontend это не только UI, но и инженерная дисциплина.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy files={toolingStudy.files} snippets={toolingStudy.snippets} />
      </Panel>
    </div>
  );
}
