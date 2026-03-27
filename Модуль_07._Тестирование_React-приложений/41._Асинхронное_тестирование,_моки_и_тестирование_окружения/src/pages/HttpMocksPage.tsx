import { useState } from 'react';

import { MockedHttpLab } from '../components/async-testing/MockedHttpLab';
import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import type { MockScope } from '../lib/async-testing-domain';
import { projectStudyByLab } from '../lib/project-study';
import { recommendMockingStrategy } from '../lib/async-testing-runtime';

export function HttpMocksPage() {
  const [scope, setScope] = useState<MockScope>('component');
  const [needsRetry, setNeedsRetry] = useState(true);
  const [exercisesProviders, setExercisesProviders] = useState(false);
  const [rerendersWithNewInput, setRerendersWithNewInput] = useState(true);

  const strategy = recommendMockingStrategy({
    scope,
    needsRetry,
    exercisesProviders,
    rerendersWithNewInput,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Mocked HTTP"
        title="Мок запроса полезен только тогда, когда он подменяет внешнюю границу, а не внутренности компонента"
        copy="Здесь можно сравнить разные уровни мока: изолированный client adapter, fetch-границу и интеграционный слой с provider harness. На практике это решает, насколько тест остаётся устойчивым при рефакторинге."
        aside={<StatusPill tone="success">{scope}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Mock Scope"
          value={scope}
          hint="Scope определяет, сколько слоёв приложения вы проверяете одновременно."
        />
        <MetricCard
          label="Retry Path"
          value={needsRetry ? 'covered' : 'ignored'}
          hint="Retry быстро показывает, действительно ли mock держится на уровне HTTP-потока."
          tone="accent"
        />
        <MetricCard
          label="Rerender Flow"
          value={rerendersWithNewInput ? 'checked' : 'not checked'}
          hint="Повторный запрос после смены входных данных часто ломает слишком узкий mock."
          tone="cool"
        />
      </div>

      <BeforeAfter
        beforeTitle="Опасный mock"
        before="Тест подменяет внутреннюю функцию компонента и перестаёт проверять реальный поток fetch -> loading -> retry -> success."
        afterTitle="Устойчивая граница"
        after="Тест оставляет UI и его состояния настоящими, а подменяет только fetch или client adapter как внешний слой."
      />

      <Panel className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Mock Strategy
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Выберите границу подмены для сценария
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Уровень теста</span>
              <select
                value={scope}
                onChange={(event) => setScope(event.target.value as MockScope)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                <option value="unit">unit</option>
                <option value="component">component</option>
                <option value="integration">integration</option>
              </select>
            </label>

            <label className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <input
                type="checkbox"
                className="mr-3"
                checked={needsRetry}
                onChange={() => setNeedsRetry((current) => !current)}
              />
              Нужен retry после ошибки
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <input
                type="checkbox"
                className="mr-3"
                checked={exercisesProviders}
                onChange={() => setExercisesProviders((current) => !current)}
              />
              Сценарий проходит через provider/router слой
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <input
                type="checkbox"
                className="mr-3"
                checked={rerendersWithNewInput}
                onChange={() => setRerendersWithNewInput((current) => !current)}
              />
              Нужен повторный запрос после rerender
            </label>
          </div>

          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <StatusPill tone="success">mock boundary</StatusPill>
            </div>
            <p className="text-sm leading-6 text-slate-700">{strategy.primary}</p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Почему это сейчас подходит
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {strategy.rationale}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                На что смотреть внимательно
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-950">{strategy.caution}</p>
            </div>
            <ListBlock
              title="Подходящие опоры"
              items={
                strategy.helpers.length > 0
                  ? strategy.helpers
                  : [
                      'Дополнительные подсказки появятся, если включить retry, rerender или provider layer.',
                    ]
              }
            />
          </div>
        </div>
      </Panel>

      <MockedHttpLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['http-mocks']} />
      </Panel>
    </div>
  );
}
