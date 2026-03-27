import { useMemo, useState } from 'react';

import {
  codemodCatalog,
  recommendReleaseStrategy,
  releaseChannelCards,
  type CodebasePatternId,
  type ReleaseChannel,
} from '../../lib/codemod-release-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

function buildCommandSnippet(selectedPatterns: readonly CodebasePatternId[]) {
  const selected = codemodCatalog.filter((item) => selectedPatterns.includes(item.id));

  if (selected.length === 0) {
    return `# codemods are not selected yet
# first mark the real patterns in the codebase`;
  }

  return selected.map((item) => `# ${item.title}\n${item.codemod}`).join('\n\n');
}

export function CodemodReleaseLab() {
  const [channel, setChannel] = useState<ReleaseChannel>('latest');
  const [selectedPatterns, setSelectedPatterns] = useState<CodebasePatternId[]>([
    'removed-dom-helpers',
    'third-party-adapters',
  ]);

  const recommendation = useMemo(
    () => recommendReleaseStrategy(channel, selectedPatterns),
    [channel, selectedPatterns],
  );

  const togglePattern = (id: CodebasePatternId) => {
    setSelectedPatterns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <StatusPill tone={recommendation.tone}>Release strategy</StatusPill>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Здесь видно, что codemods и release channels обслуживают разные части
              миграции. Один ускоряет механическую замену, другой определяет уровень
              допустимого риска и цель текущего окружения.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {releaseChannelCards.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setChannel(item.id)}
                className={`chip ${channel === item.id ? 'chip-active' : ''}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {releaseChannelCards.map((item) => (
            <div
              key={item.id}
              className={`rounded-[24px] border p-4 ${
                channel === item.id
                  ? 'border-sky-300 bg-sky-50/70'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <StatusPill tone={item.tone}>{item.tone}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="grid gap-4 xl:grid-cols-2">
        {codemodCatalog.map((item) => {
          const selected = selectedPatterns.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => togglePattern(item.id)}
              className={`rounded-[24px] border p-5 text-left transition ${
                selected
                  ? 'border-teal-300 bg-teal-50/80 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.why}</p>
              <p className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                <code>{item.codemod}</code>
              </p>
            </button>
          );
        })}
      </Panel>

      <Panel className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {recommendation.title}
              </h3>
              <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{recommendation.why}</p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {recommendation.steps.map((step) => (
                <li
                  key={step}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <CodeBlock
            label="Codemod command plan"
            code={buildCommandSnippet(selectedPatterns)}
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Selected codemods
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {recommendation.codemods.length === 0 ? (
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Сначала отметьте реальные patterns в кодовой базе.
              </li>
            ) : (
              recommendation.codemods.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {item}
                </li>
              ))
            )}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
