import { useMemo, useState } from 'react';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { recommendTestingArchitecture } from '../lib/testing-runtime';
import { projectStudyByLab } from '../lib/project-study';

export function ArchitecturePage() {
  const [input, setInput] = useState({
    criticalFlows: true,
    denseUiStates: true,
    sharedState: true,
    browserDependent: false,
    teamGrowing: true,
    flakeBudgetLow: true,
  });

  const recommendation = useMemo(() => recommendTestingArchitecture(input), [input]);

  const toggle = (key: keyof typeof input) => {
    setInput((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Test Architecture"
        title="Стратегия тестирования — это архитектурное решение, а не просто набор разных инструментов"
        copy="Меняйте признаки приложения и смотрите, как меняется центр тяжести стратегии: быстрый feedback, поведенческие проверки, integration core или targeted E2E."
        aside={<StatusPill tone="success">{recommendation.model}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Recommended model"
          value={recommendation.model}
          hint="Главный вопрос: где в приложении рождается риск и какой слой его реально ловит."
        />
        <MetricCard
          label="Confidence"
          value={`${recommendation.score}%`}
          hint="Это архитектурная оценка распределения рисков, а не рейтинг конкретного инструмента."
          tone="accent"
        />
        <MetricCard
          label="Growth pressure"
          value={input.teamGrowing ? 'rising' : 'stable'}
          hint="По мере роста команды и продукта тестовая стратегия почти всегда должна эволюционировать."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Переключайте признаки и смотрите, как меняется стратегический центр вашей
            тестовой системы.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['criticalFlows', 'Есть критические пользовательские пути'],
              ['denseUiStates', 'UI насыщен состояниями и условными переходами'],
              ['sharedState', 'Много связей между компонентами и shared state'],
              ['browserDependent', 'Есть browser-only логика и реальные DOM зависимости'],
              ['teamGrowing', 'Приложение и команда продолжают расти'],
              ['flakeBudgetLow', 'Нужно держать стоимость и флаки под контролем'],
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
        beforeTitle="Тесты пишутся бессистемно"
        before="Сценарии дублируются на разных уровнях, E2E пухнет без нужды, а быстрые feedback loops почти не помогают. Количество тестов растёт, а доверие — нет."
        afterTitle="Стратегия привязана к рискам"
        after="Каждый слой проверяет свой тип поведения: unit — правила, component — видимое поведение, integration — связки, E2E — критические браузерные пути."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.architecture} />
      </Panel>
    </div>
  );
}
