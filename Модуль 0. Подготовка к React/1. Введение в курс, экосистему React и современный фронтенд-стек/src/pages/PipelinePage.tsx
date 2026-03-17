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
  analyzePipeline,
  pipelineFeatureOptions,
  pipelineIssueOptions,
  pipelineModes,
  type PipelineFeatureId,
  type PipelineIssueId,
  type PipelineModeId,
} from '../lib/learning-model';
import { pipelineStudy } from '../lib/project-study';

const initialFeatures: PipelineFeatureId[] = ['jsx', 'bare-imports', 'css-imports'];

export function PipelinePage() {
  const [mode, setMode] = useState<PipelineModeId>('vite-dev');
  const [features, setFeatures] = useState<PipelineFeatureId[]>(initialFeatures);
  const [issues, setIssues] = useState<PipelineIssueId[]>([]);

  // В этой лаборатории React-часть лишь собирает входные параметры,
  // а полный pipeline рассчитывается как детерминированная модель.
  const analysis = analyzePipeline(mode, features, issues);

  const toggleFeature = (featureId: PipelineFeatureId) => {
    setFeatures((current) =>
      current.includes(featureId)
        ? current.filter((item) => item !== featureId)
        : [...current, featureId],
    );
  };

  const toggleIssue = (issueId: PipelineIssueId) => {
    setIssues((current) =>
      current.includes(issueId)
        ? current.filter((item) => item !== issueId)
        : [...current, issueId],
    );
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Pipeline: как исходники доходят до браузера"
        copy="Здесь вы буквально собираете себе фронтенд-пайплайн: выбираете режим, подключаете JSX, TypeScript, env-переменные, server features и провоцируете реальные поломки. Это не абстракция, а модель тех причинно-следственных связей, которые потом встречаются в каждом React-проекте."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Режим выполнения
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pipelineModes.map((item) => (
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
                Что есть в проекте
              </p>
              <div className="mt-3 space-y-2">
                {pipelineFeatureOptions.map((item) => {
                  const active = features.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleFeature(item.id)}
                      className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                        active
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-black/10 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em]">
                          {active ? 'active' : 'off'}
                        </span>
                      </div>
                      <p className={`mt-2 text-sm leading-6 ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                        {item.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Типичные поломки
              </p>
              <div className="mt-3 space-y-2">
                {pipelineIssueOptions.map((item) => {
                  const active = issues.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleIssue(item.id)}
                      className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                        active
                          ? 'border-rose-700 bg-rose-950 text-white'
                          : 'border-black/10 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em]">
                          {active ? 'simulated' : 'off'}
                        </span>
                      </div>
                      <p className={`mt-2 text-sm leading-6 ${active ? 'text-rose-100' : 'text-slate-500'}`}>
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
                  Сводка по пайплайну
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Один и тот же набор исходников ведёт себя по-разному в зависимости от выбранного слоя tooling и от того, где именно произошла ошибка.
                </p>
              </div>
              <StatusPill tone={analysis.overall}>
                {analysis.overall === 'success'
                  ? 'pipeline ok'
                  : analysis.overall === 'warn'
                    ? 'есть ограничения'
                    : 'pipeline broken'}
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
          <ListBlock title="Почему это важно" items={analysis.importance} />
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Типичные ошибки интерпретации" items={analysis.mistakes} />
        <ListBlock
          title="Практический вывод"
          items={[
            'No-build полезен как учебный контраст, но не закрывает основной modern React workflow.',
            'Vite объясняет современный client-side pipeline: JSX, npm-граф, HMR, production build.',
            'CRA исторически скрывал многие детали пайплайна, а Vite и framework-first подходы делают текущую архитектурную картину заметно яснее.',
            'Framework-first нужен тогда, когда у вас уже не только клиентский UI, а полноценная серверно-клиентская архитектура уровня React Router framework mode или Next.js.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy files={pipelineStudy.files} snippets={pipelineStudy.snippets} />
      </Panel>
    </div>
  );
}
