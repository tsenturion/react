import { useState } from 'react';

import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  analyzeQualitySafety,
  qualityIssueOptions,
  qualityToolOptions,
  type QualityIssueId,
  type QualityToolId,
} from '../lib/learning-model';
import { qualityStudy } from '../lib/project-study';

const defaultTools: QualityToolId[] = [
  'typescript',
  'eslint',
  'prettier',
  'vitest',
  'strict-mode',
];

export function QualityPage() {
  const [issueId, setIssueId] = useState<QualityIssueId>('type-mismatch');
  const [tools, setTools] = useState<QualityToolId[]>(defaultTools);

  // Здесь тема про tooling показана как обычная конфигурация quality-gates:
  // разные инструменты ловят разные классы проблем на разных стадиях проекта.
  const analysis = analyzeQualitySafety(tools, issueId);

  const toggleTool = (toolId: QualityToolId) => {
    setTools((current) =>
      current.includes(toolId)
        ? current.filter((item) => item !== toolId)
        : [...current, toolId],
    );
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="TypeScript, ESLint, Prettier, Vitest и StrictMode"
        copy="Последняя лаборатория показывает, что хороший React-проект состоит не только из сборки и рендера. Вы включаете и выключаете quality-gates и видите, на каком именно уровне каждая ошибка ловится раньше браузера."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Инструменты качества
              </p>
              <div className="mt-3 space-y-2">
                {qualityToolOptions.map((item) => {
                  const active = tools.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleTool(item.id)}
                      className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                        active
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-black/10 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em]">
                          {active ? 'on' : 'off'}
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

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Тип проблемы
              </p>
              <div className="mt-3 space-y-2">
                {qualityIssueOptions.map((item) => {
                  const active = item.id === issueId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIssueId(item.id)}
                      className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                        active
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-black/10 bg-white/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.18em]">
                          {active ? 'selected' : 'open'}
                        </span>
                      </div>
                      <p
                        className={`mt-2 text-sm leading-6 ${active ? 'text-blue-100' : 'text-slate-500'}`}
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
                  Итог по quality-gates
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Один и тот же проект становится заметно устойчивее, когда у ошибки есть
                  свой слой раннего обнаружения.
                </p>
              </div>
              <StatusPill tone={analysis.overall}>{analysis.overall}</StatusPill>
            </div>

            <CodeBlock label="issue sample" code={analysis.codeSample} />

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
          <ListBlock title="Чем проблема ловится" items={analysis.caughtBy} />
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Слепые зоны" items={analysis.blindSpots} />
        <ListBlock
          title="Практический вывод"
          items={[
            'TypeScript, ESLint, Prettier, Vitest и StrictMode не дублируют друг друга, а перекрывают разные типы ошибок.',
            'Чем раньше ошибка ловится в цепочке, тем дешевле исправление и тем меньше шум в браузере и review.',
            'Для темы про устройство проекта это особенно важно: качество кода — часть архитектуры среды, а не отдельный факультатив.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy files={qualityStudy.files} snippets={qualityStudy.snippets} />
      </Panel>
    </div>
  );
}
