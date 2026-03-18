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
  buildExpressionReport,
  defaultExpressionScenario,
  expressionCases,
  type ExpressionCaseId,
  type ExpressionScenario,
} from '../lib/expression-model';
import { getProjectStudy } from '../lib/project-study';

export function ExpressionsPage() {
  const [activeCaseId, setActiveCaseId] = useState<ExpressionCaseId>('template');
  const [scenario, setScenario] = useState<ExpressionScenario>(defaultExpressionScenario);
  const report = buildExpressionReport(activeCaseId, scenario);
  const study = getProjectStudy('expressions');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Выражения JavaScript внутри JSX"
        copy="JSX принимает выражения, а не любые конструкции JavaScript. Ниже можно переключать разные кейсы и сразу видеть, что действительно подходит для рендера, а что приводит к ошибке или к плохому паттерну."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Исходные данные</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Имя</span>
            <input
              value={scenario.viewerName}
              onChange={(event) =>
                setScenario((current) => ({ ...current, viewerName: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="flex items-center justify-between font-medium">
              Мест осталось
              <span className="text-slate-500">{scenario.seatsLeft}</span>
            </span>
            <input
              type="range"
              min={0}
              max={8}
              value={scenario.seatsLeft}
              onChange={(event) =>
                setScenario((current) => ({
                  ...current,
                  seatsLeft: Number(event.target.value),
                }))
              }
              className="w-full"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Тегов в массиве</span>
            <select
              value={scenario.tagCount}
              onChange={(event) =>
                setScenario((current) => ({
                  ...current,
                  tagCount: Number(event.target.value),
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {[1, 2, 3, 4].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Автор указан</span>
            <input
              type="checkbox"
              checked={scenario.authorMode === 'named'}
              onChange={(event) =>
                setScenario((current) => ({
                  ...current,
                  authorMode: event.target.checked ? 'named' : 'missing',
                }))
              }
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Есть сертификат</span>
            <input
              type="checkbox"
              checked={scenario.hasCertificate}
              onChange={(event) =>
                setScenario((current) => ({
                  ...current,
                  hasCertificate: event.target.checked,
                }))
              }
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Кейсы</h2>
            <div className="flex flex-wrap gap-2">
              {expressionCases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveCaseId(item.id)}
                  className={activeCaseId === item.id ? 'chip chip-active' : 'chip'}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{report.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{report.why}</p>
              </div>
              <StatusPill tone={report.tone}>{report.verdict}</StatusPill>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              {report.previewKind === 'text' ? (
                <p className="text-sm leading-6 text-slate-700">{report.previewText}</p>
              ) : null}

              {report.previewKind === 'list' ? (
                <div className="flex flex-wrap gap-2">
                  {report.previewItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              {report.previewKind === 'none' ? (
                <p className="text-sm leading-6 text-slate-700">
                  Здесь живого результата нет, потому что такая конструкция не создаёт
                  корректное JSX-выражение.
                </p>
              ) : null}
            </div>
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Пробуем вставить" code={report.example} />
            <CodeBlock label="Корректный путь" code={report.fix} />
          </div>

          <Panel>
            <ListBlock
              title="Правила"
              items={[
                'JSX принимает значения выражений: строки, числа, результаты тернарных операторов и `map(...)`.',
                'Инструкции `if`, `for`, `switch` нельзя вставить прямо между `{}`.',
                'Побочные эффекты и мутации в render-phase делают поведение непредсказуемым.',
              ]}
            />
          </Panel>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
