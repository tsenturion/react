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
import { recommendDataOwnership } from '../lib/data-router-runtime';

export function ArchitecturePage() {
  const [input, setInput] = useState({
    dependsOnUrl: true,
    blocksScreen: true,
    submittedFromForm: false,
    shouldRevalidateRoute: true,
    purelyDerived: false,
    tiedToOneWidget: false,
    shouldUseRouteBoundary: true,
  });

  const recommendation = useMemo(() => recommendDataOwnership(input), [input]);

  const toggle = (key: keyof typeof input) => {
    setInput((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Data Ownership"
        title="Loader, action и component request нужны не одновременно, а по роли в navigation lifecycle"
        copy="Эта лаборатория помогает понять, когда данные действительно принадлежат маршруту, а когда их честнее оставить в локальном клиентском слое или вообще посчитать без отдельного state."
        aside={<StatusPill tone="success">{recommendation.model}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Recommended owner"
          value={recommendation.model}
          hint="Главный вопрос: влияет ли этот data flow на navigation contract экрана."
        />
        <MetricCard
          label="Confidence"
          value={`${recommendation.score}%`}
          hint="Это архитектурная оценка признаков сценария, а не универсальная догма."
          tone="accent"
        />
        <MetricCard
          label="Route pressure"
          value={input.dependsOnUrl || input.blocksScreen ? 'high' : 'low'}
          hint="Чем ближе данные к URL и screen blocking, тем сильнее аргумент в пользу loader/action."
          tone="cool"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            Переключайте признаки сценария и смотрите, как меняется владелец данных.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['dependsOnUrl', 'Данные определяются URL или route params'],
              ['blocksScreen', 'Без этих данных экран не имеет смысла'],
              ['submittedFromForm', 'Изменение приходит из route form submit'],
              ['shouldRevalidateRoute', 'После мутации нужен route revalidation'],
              ['purelyDerived', 'Значение полностью вычисляется из уже известных данных'],
              ['tiedToOneWidget', 'Запрос нужен только одному локальному виджету'],
              [
                'shouldUseRouteBoundary',
                'Ошибку нужно ловить именно на route branch уровне',
              ],
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
        beforeTitle="Всё уезжает в useEffect"
        before="Если route-critical данные, submit flow и route errors собираются локально в компоненте, компонент быстро становится слишком шумным и начинает сам симулировать поведение маршрутизатора."
        afterTitle="Данные живут на своём уровне"
        after="Когда loader, action, component request и plain compute делят роли осознанно, экран остаётся устойчивым, а navigation и data flow совпадают по смыслу."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.architecture} />
      </Panel>
    </div>
  );
}
