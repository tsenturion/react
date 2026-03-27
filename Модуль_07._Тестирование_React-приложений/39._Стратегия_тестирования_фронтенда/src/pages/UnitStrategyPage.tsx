import { useMemo, useState } from 'react';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { recommendUnitStrategy } from '../lib/testing-runtime';
import { projectStudyByLab } from '../lib/project-study';

export function UnitStrategyPage() {
  const [input, setInput] = useState({
    pureLogic: true,
    branching: true,
    deterministic: true,
    uiFree: true,
    expensiveSetup: false,
    crossBrowser: false,
  });

  const recommendation = useMemo(() => recommendUnitStrategy(input), [input]);

  const toggle = (key: keyof typeof input) => {
    setInput((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Unit Tests"
        title="Unit-тест полезен там, где главный риск живёт в чистой логике, а не в рендере"
        copy="Меняйте признаки сценария и смотрите, остаётся ли unit-first подход лучшим источником уверенности или уже нужен behavior-level слой."
        aside={<StatusPill tone="success">{recommendation.model}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Recommended layer"
          value={recommendation.model}
          hint="Главный вопрос: даёт ли unit здесь именно ту уверенность, которая нужна."
        />
        <MetricCard
          label="Confidence"
          value={`${recommendation.score}%`}
          hint="Оценка меняется по признакам сценария, а не по любимому инструменту."
          tone="accent"
        />
        <MetricCard
          label="Assertion style"
          value={recommendation.assertionStyle}
          hint="Даже unit-test должен проверять поведение правила, а не внутренний шум реализации."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Переключайте признаки и смотрите, когда unit тест действительно даёт быстрый и
            честный feedback.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['pureLogic', 'Сценарий выражается как чистая логика'],
              ['branching', 'Есть важные branching rules и границы'],
              ['deterministic', 'Результат детерминирован и не зависит от времени UI'],
              ['uiFree', 'Смысл сценария не привязан к DOM и рендеру'],
              ['expensiveSetup', 'Подготовка higher-level теста была бы слишком дорогой'],
              ['crossBrowser', 'Главный риск зависит от браузерного поведения'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key as keyof typeof input)}
                className={`rounded-[24px] border px-4 py-4 text-left transition ${
                  input[key as keyof typeof input]
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {input[key as keyof typeof input] ? 'on' : 'off'}
                </p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recommendation details
          </p>
          <p className="text-lg font-semibold text-slate-900">{recommendation.model}</p>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {recommendation.rationale.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="rounded-[24px] border border-amber-300/60 bg-amber-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Anti-pattern
            </p>
            <p className="mt-3 text-sm leading-6 text-amber-950">
              {recommendation.antiPattern}
            </p>
          </div>
        </Panel>
      </div>

      <BeforeAfter
        beforeTitle="Unit тест повторяет реализацию"
        before="Тест знает про private переменные, внутренние шаги и структуру функции. Любой рефакторинг ломает тест, даже если поведение осталось правильным."
        afterTitle="Unit тест проверяет правило"
        after="Тест опирается на входы, выходы, граничные случаи и бизнес-ветки. Реализацию можно менять, пока правило остаётся тем же."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.unit} />
      </Panel>
    </div>
  );
}
