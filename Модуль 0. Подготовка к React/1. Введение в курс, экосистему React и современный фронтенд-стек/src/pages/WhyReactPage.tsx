import { useState } from 'react';

import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  analyzeReactValue,
  reactFeatureOptions,
  type ReactFeatureId,
} from '../lib/learning-model';
import { whyReactStudy } from '../lib/project-study';

const defaultFeatures: ReactFeatureId[] = ['shared-state', 'repeated-blocks'];

export function WhyReactPage() {
  const [complexity, setComplexity] = useState(3);
  const [features, setFeatures] = useState<ReactFeatureId[]>(defaultFeatures);

  // Реакт-страница намеренно сводит вычисления к pure function:
  // компонент отвечает за состояние и рендер, а не за расчёт всех метрик внутри JSX.
  const analysis = analyzeReactValue(complexity, features);

  const toggleFeature = (featureId: ReactFeatureId) => {
    setFeatures((current) =>
      current.includes(featureId)
        ? current.filter((item) => item !== featureId)
        : [...current, featureId],
    );
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Зачем React: от ручных DOM-мутаций к компонентной модели"
        copy="Здесь вы не просто читаете фразу «React удобнее», а наращиваете сложность интерфейса и смотрите, как растёт цена императивного подхода по сравнению с моделью компонентов, props и состояния."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Сложность сценария
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                Настройте экран как в реальном проекте
              </h2>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-white/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  Уровень сложности UI
                </span>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">
                  {complexity}/5
                </span>
              </div>
              <input
                aria-label="Уровень сложности UI"
                type="range"
                min={1}
                max={5}
                step={1}
                value={complexity}
                onChange={(event) => setComplexity(Number(event.target.value))}
                className="mt-4 w-full accent-orange-500"
              />
            </div>

            <div className="space-y-2">
              {reactFeatureOptions.map((feature) => {
                const active = features.includes(feature.id);
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                      active
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-black/10 bg-white/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{feature.label}</span>
                      <span className="text-[10px] uppercase tracking-[0.18em]">
                        {active ? 'on' : 'off'}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm leading-6 ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                      {feature.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              <MetricCard
                label="Ручные шаги"
                value={String(analysis.manualSteps)}
                hint="Сколько мест приходится синхронизировать вручную в DOM-подходе."
                tone="accent"
              />
              <MetricCard
                label="Риск рассинхрона"
                value={`${analysis.manualRisk}%`}
                hint="Чем больше ручных веток, тем выше шанс забыть обновить часть UI."
                tone="accent"
              />
              <MetricCard
                label="React units"
                value={String(analysis.reactUnits)}
                hint="Сколько осмысленных компонентных единиц получается в декларативной модели."
                tone="cool"
              />
              <MetricCard
                label="Предсказуемость"
                value={`${analysis.reactPredictability}%`}
                hint="UI вычисляется из данных и состояния, а не из разрозненных мутаций."
                tone="cool"
              />
            </div>

            <BeforeAfter
              beforeTitle="До"
              before={analysis.before}
              afterTitle="После"
              after={analysis.after}
            />

            <div className="grid gap-4 xl:grid-cols-2">
              <CodeBlock label="Императивный DOM-подход" code={analysis.imperativeSnippet} />
              <CodeBlock label="React-подход" code={analysis.reactSnippet} />
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Типичные ошибки без компонентной модели" items={analysis.mistakes} />
        <ListBlock title="Что React даёт на практике" items={analysis.practicalWins} />
      </Panel>

      <Panel>
        <ProjectStudy files={whyReactStudy.files} snippets={whyReactStudy.snippets} />
      </Panel>
    </div>
  );
}
