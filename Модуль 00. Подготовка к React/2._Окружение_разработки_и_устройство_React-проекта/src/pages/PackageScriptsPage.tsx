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
  buildIndexHtmlPreview,
  buildPackagePreview,
  collectWorkspaceDiagnostics,
  runWorkspaceCommand,
  type WorkspaceCommandId,
  type WorkspaceConfig,
} from '../lib/learning-model';
import { workspaceStudy } from '../lib/project-study';

const baseConfig: WorkspaceConfig = {
  nodeVersion: 24,
  hasLockfile: true,
  hasDevScript: true,
  hasBuildScript: true,
  hasPreviewScript: true,
  hasTestScript: true,
  hasLintScript: true,
  hasFormatScript: true,
  hasModuleType: true,
  hasReactDeps: true,
  hasViteDep: true,
  hasTypeScript: true,
  hasEntryHtml: true,
  rootIdMatches: true,
  hasEslintConfig: true,
  hasPrettierConfig: true,
};

const commandButtons: { id: WorkspaceCommandId; label: string }[] = [
  { id: 'install', label: 'npm install' },
  { id: 'dev', label: 'npm run dev' },
  { id: 'build', label: 'npm run build' },
  { id: 'preview', label: 'npm run preview' },
  { id: 'lint', label: 'npm run lint' },
  { id: 'format-check', label: 'npm run format:check' },
  { id: 'test', label: 'npm test' },
];

export function PackageScriptsPage() {
  const [config, setConfig] = useState<WorkspaceConfig>(baseConfig);
  const [command, setCommand] = useState<WorkspaceCommandId>('dev');

  // manifest-конфиг и результат команды считаются отдельно от JSX, чтобы эта
  // лаборатория оставалась моделью проекта, а не россыпью условий в разметке.
  const diagnostics = collectWorkspaceDiagnostics(config);
  const result = runWorkspaceCommand(config, command);

  const toggle = (key: keyof WorkspaceConfig) => {
    setConfig((current) => ({
      ...current,
      [key]: typeof current[key] === 'boolean' ? !current[key] : current[key],
    }));
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="package.json, scripts и стартовая HTML-цепочка"
        copy="Эта лаборатория показывает, что React-проект стартует не только из `src`, но и из manifest, `type: module`, lockfile, entry HTML, scripts и конфигов качества. Вы меняете состав проекта и сразу смотрите, как ведут себя команды."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="rounded-[24px] border border-black/10 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Версия Node.js
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[16, 18, 20, 24].map((version) => (
                  <button
                    key={version}
                    type="button"
                    onClick={() =>
                      setConfig((current) => ({
                        ...current,
                        nodeVersion: version as WorkspaceConfig['nodeVersion'],
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
            </div>

            <div className="space-y-2">
              {[
                ['hasLockfile', 'Есть package-lock.json'],
                ['hasDevScript', 'Есть `dev` script'],
                ['hasBuildScript', 'Есть `build` script'],
                ['hasPreviewScript', 'Есть `preview` script'],
                ['hasTestScript', 'Есть `test` script'],
                ['hasLintScript', 'Есть `lint` script'],
                ['hasFormatScript', 'Есть `format:check` script'],
                ['hasModuleType', 'package.json содержит `type: module`'],
                ['hasReactDeps', 'React указан в dependencies'],
                ['hasViteDep', 'Vite указан в devDependencies'],
                ['hasTypeScript', 'TypeScript подключён'],
                ['hasEntryHtml', 'index.html содержит `type="module"` entry script'],
                ['rootIdMatches', 'root id совпадает с main.tsx'],
                ['hasEslintConfig', 'eslint config есть в проекте'],
                ['hasPrettierConfig', 'prettier config есть в проекте'],
              ].map(([key, label]) => {
                const typedKey = key as keyof WorkspaceConfig;
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
              <CodeBlock
                label="package.json preview"
                code={buildPackagePreview(config)}
              />
              <CodeBlock
                label="index.html preview"
                code={buildIndexHtmlPreview(config)}
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock
          title="Живые диагностики"
          items={
            diagnostics.length > 0
              ? diagnostics.map(
                  (item) => `${item.title}: ${item.message} Исправление: ${item.fix}`,
                )
              : ['Manifest, scripts и стартовая HTML-цепочка согласованы между собой.']
          }
        />
        <ListBlock
          title="Что именно раскрывает эта страница"
          items={[
            'Manifest и scripts — это не бюрократия, а реальный контракт запуска проекта.',
            '`package.json` с `type: module` и `index.html` с `script type="module"` собирают ES-модульный старт проекта.',
            'index.html и src/main.tsx образуют фактический entry-point в браузер.',
            'Lockfile, lint и format-слои — это часть устройства проекта, а не внешние украшения.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy files={workspaceStudy.files} snippets={workspaceStudy.snippets} />
      </Panel>
    </div>
  );
}
