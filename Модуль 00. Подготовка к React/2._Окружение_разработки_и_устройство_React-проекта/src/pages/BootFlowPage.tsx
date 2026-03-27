import { useState } from 'react';

import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { bootNodes, bootScenarios } from '../lib/learning-model';
import { bootStudy } from '../lib/project-study';

export function BootFlowPage() {
  const [scenarioId, setScenarioId] = useState(bootScenarios[1].id);

  // Страница хранит только выбранный сценарий, а сами цепочки запуска и пояснения
  // приходят из предметной модели. Это делает экран предсказуемым и тестируемым.
  const scenario =
    bootScenarios.find((item) => item.id === scenarioId) ?? bootScenarios[0];

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Жизненный цикл запуска React-проекта"
        copy={`Здесь вы проходите путь от терминала до первого экрана в браузере. На одной и той же теме становятся видны роли npm, Node.js, Vite, \`index.html\`, \`type="module"\`, \`src/main.tsx\`, DOM root, ES-модульной цепочки и production-поставки.`}
      />

      <Panel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Сценарий запуска
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
              Что реально происходит на каждом шаге
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Переключайте сценарии и смотрите, какие части проекта в них вообще
              участвуют. Так легче понять, где искать проблему: в manifest, ES-модульном
              entry, dev server, build или delivery.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {bootScenarios.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setScenarioId(item.id)}
                className={`chip ${item.id === scenario.id ? 'chip-active' : ''}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.8fr)]">
          <div className="rounded-[28px] border border-black/10 bg-white/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Активные участники цепочки
            </p>
            <h3 className="mt-2 text-lg font-bold text-slate-950">{scenario.command}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{scenario.prompt}</p>

            <div className="mt-5 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {bootNodes.map((node) => {
                const active = scenario.activeNodes.includes(node.id);

                return (
                  <div
                    key={node.id}
                    className={`rounded-[24px] border p-4 transition ${
                      active
                        ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_48px_rgba(15,23,42,0.16)]'
                        : 'border-black/8 bg-white/55 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-base font-semibold leading-6 break-words">
                        {node.title}
                      </p>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                        {node.zone}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6">{node.short}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-black/10 bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Терминальный след
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {scenario.command}
                  </h3>
                </div>
                <StatusPill tone="success">active</StatusPill>
              </div>
              <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 p-4">
                <pre className="overflow-x-auto text-sm leading-6 text-slate-100">
                  <code>{scenario.terminalLines.join('\n')}</code>
                </pre>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Участников цепочки"
                value={String(scenario.activeNodes.length)}
                hint="Чем точнее вы видите участников сценария, тем быстрее локализуете ошибку."
                tone="accent"
              />
              <MetricCard
                label="Шагов в сценарии"
                value={String(scenario.steps.length)}
                hint="Даже один запуск React-проекта проходит через несколько разных слоёв."
                tone="cool"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {scenario.steps.map((step) => (
            <div
              key={step.id}
              className="rounded-[24px] border border-black/10 bg-white/65 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{step.label}</p>
                <StatusPill tone={step.status}>{step.status}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <BeforeAfter
            beforeTitle="До"
            before={scenario.before}
            afterTitle="После"
            after={scenario.after}
          />
          <ListBlock title="Типичные ошибки" items={scenario.mistakes} />
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Почему это важно" items={scenario.importance} />
        <CodeBlock
          label="startup chain"
          code={scenario.steps
            .map((step, index) => `${index + 1}. ${step.label}\n   ${step.note}`)
            .join('\n\n')}
        />
      </Panel>

      <Panel>
        <ProjectStudy files={bootStudy.files} snippets={bootStudy.snippets} />
      </Panel>
    </div>
  );
}
