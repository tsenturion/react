import { useMemo, useState } from 'react';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { recommendAccessArchitecture } from '../lib/auth-runtime';
import { projectStudyByLab } from '../lib/project-study';

export function ArchitecturePage() {
  const [input, setInput] = useState({
    dependsOnRoute: true,
    mustPreserveIntent: true,
    roleBased: true,
    blocksScreen: true,
    needsSessionRefresh: true,
    affectsSingleWidget: false,
    purelyPresentational: false,
  });

  const recommendation = useMemo(() => recommendAccessArchitecture(input), [input]);

  const toggle = (key: keyof typeof input) => {
    setInput((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Access Architecture"
        title="Где живёт auth logic, определяет устойчивость и роутинга, и данных, и UX"
        copy="Эта лаборатория помогает отделить route guard loader, role gate, local widget guard и случаи, где отдельный auth layer вообще не нужен."
        aside={<StatusPill tone="success">{recommendation.model}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Recommended model"
          value={recommendation.model}
          hint="Главный вопрос: влияет ли access decision на сам факт входа в экран."
        />
        <MetricCard
          label="Confidence"
          value={`${recommendation.score}%`}
          hint="Это оценка архитектурного давления сценария, а не абсолютная догма."
          tone="accent"
        />
        <MetricCard
          label="Route pressure"
          value={input.dependsOnRoute || input.blocksScreen ? 'high' : 'low'}
          hint="Чем ближе access к экрану и navigation, тем сильнее аргумент в пользу маршрутизаторного слоя."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Переключайте признаки сценария и смотрите, как меняется access architecture.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['dependsOnRoute', 'Доступ влияет на сам маршрут и branch navigation'],
              [
                'mustPreserveIntent',
                'После входа нужно вернуть пользователя в исходный путь',
              ],
              ['roleBased', 'Нужен отдельный слой ролей поверх простой аутентификации'],
              ['blocksScreen', 'Без проверки доступа экран вообще не должен рендериться'],
              [
                'needsSessionRefresh',
                'Во время навигации может потребоваться refresh session',
              ],
              [
                'affectsSingleWidget',
                'Ограничение касается только одного локального виджета',
              ],
              ['purelyPresentational', 'Сценарий только визуальный и не меняет доступ'],
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
        beforeTitle="Доступ размазан по случайным компонентам"
        before="Auth flow начинает жить в local state, useEffect и скрытых кнопках. Экран может мигать, терять intent path и путать 401, 403 и logout."
        afterTitle="Доступ встроен в route tree и auth lifecycle"
        after="Когда guard loaders, role gates, session refresh и login redirect разложены по смысловым слоям, navigation остаётся устойчивой, а UX не теряет контекст."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.architecture} />
      </Panel>
    </div>
  );
}
