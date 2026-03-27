import { useMemo, useState } from 'react';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import { recommendUrlPlacement } from '../lib/route-placement-model';

export function ArchitecturePage() {
  const [input, setInput] = useState({
    shareable: true,
    hierarchical: true,
    selectedEntity: false,
    needsBackButton: true,
    mustSurviveReload: true,
    ephemeral: false,
    changesWhileTyping: false,
  });

  const recommendation = useMemo(() => recommendUrlPlacement(input), [input]);

  const toggle = (key: keyof typeof input) => {
    setInput((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Navigation Design"
        title="Понятная навигация появляется там, где URL и screen state делят роли осознанно"
        copy="Эта лаборатория помогает решить, где нужен nested route, где path param, где search params, а где достаточно local state без лишнего URL-шумa."
        aside={<StatusPill tone="success">{recommendation.model}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Recommended model"
          value={recommendation.model}
          hint="Решение зависит не от привычки, а от того, какой navigation contract нужен экрану."
        />
        <MetricCard
          label="Confidence"
          value={`${recommendation.score}%`}
          hint="Это архитектурная оценка текущих признаков, а не жёсткая формула."
          tone="accent"
        />
        <MetricCard
          label="URL pressure"
          value={input.shareable || input.mustSurviveReload ? 'high' : 'low'}
          hint="Чем важнее reload, deep link и history, тем сильнее аргумент в пользу URL state."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Переключайте признаки сценария и смотрите, как меняется рекомендация.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['shareable', 'Этим состоянием нужно делиться ссылкой'],
              ['hierarchical', 'Экран живёт внутри route tree как дочерняя ветка'],
              ['selectedEntity', 'Есть выбранная сущность со своей identity'],
              ['needsBackButton', 'Пользователь ожидает back/forward'],
              ['mustSurviveReload', 'Состояние должно переживать refresh'],
              ['ephemeral', 'Это краткоживущий локальный UI mode'],
              ['changesWhileTyping', 'Состояние меняется на каждом вводе'],
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
        beforeTitle="URL заполняется хаотично"
        before="Если path, query string и local state распределены по привычке, экран быстро становится шумным: часть состояния теряется при reload, часть дублируется, а navigation ведёт себя непредсказуемо."
        afterTitle="Navigation contract спроектирован"
        after="Когда route tree, path params, search params и local state делят роли осознанно, экран остаётся понятным, shareable и устойчивым."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.architecture} />
      </Panel>
    </div>
  );
}
