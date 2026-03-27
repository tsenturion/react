import { useState } from 'react';

import { AsyncResourceLab } from '../components/async-testing/AsyncResourceLab';
import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';
import {
  evaluateWaitingStrategy,
  type WaitingStrategyInput,
} from '../lib/async-testing-runtime';

const initialStrategy: WaitingStrategyInput = {
  coversLoading: true,
  coversError: true,
  coversEmpty: false,
  waitsForVisibleResult: true,
  usesFixedDelay: false,
};

export function WaitingPage() {
  const [strategy, setStrategy] = useState(initialStrategy);
  const analysis = evaluateWaitingStrategy(strategy);
  const tone = analysis.score >= 4 ? 'success' : analysis.score >= 2 ? 'warn' : 'error';

  function toggle(field: keyof WaitingStrategyInput) {
    setStrategy((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Loading and waiting"
        title="Ожидание в async-тесте должно быть привязано к DOM-контракту, а не к паузе"
        copy="На этой странице видно, как loading, error, empty и success формируют настоящий поток проверки. Если хотя бы одно состояние выпадает, тест перестаёт описывать реальное поведение интерфейса."
        aside={<StatusPill tone={tone}>{analysis.verdict}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Covered States"
          value={`${Number(strategy.coversLoading) + Number(strategy.coversError) + Number(strategy.coversEmpty)}/3`}
          hint="Минимальный async suite обычно фиксирует loading, error и empty до happy path."
        />
        <MetricCard
          label="Wait Target"
          value={strategy.waitsForVisibleResult ? 'DOM result' : 'Indirect signal'}
          hint="findBy и waitFor полезны только вокруг того, что действительно видит пользователь."
          tone="accent"
        />
        <MetricCard
          label="Fixed Delay"
          value={strategy.usesFixedDelay ? 'used' : 'avoided'}
          hint="Чем больше тест зависит от времени, тем выше риск flaky-падений."
          tone="cool"
        />
      </div>

      <BeforeAfter
        beforeTitle="Хрупкий ход"
        before="Тест ставит sleep на 500ms и надеется, что за это время всё уже закончилось."
        afterTitle="Устойчивый ход"
        after="Тест ждёт loading, затем alert/status/list и синхронизируется с интерфейсом по наблюдаемому результату."
      />

      <Panel className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Strategy Builder
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Соберите свою стратегию ожидания
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={strategy.coversLoading}
              onChange={() => toggle('coversLoading')}
            />
            Фиксировать loading-state через `status`
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={strategy.coversError}
              onChange={() => toggle('coversError')}
            />
            Проверять error-state и alert-contract
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={strategy.coversEmpty}
              onChange={() => toggle('coversEmpty')}
            />
            Проверять empty-state отдельно от success
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={strategy.waitsForVisibleResult}
              onChange={() => toggle('waitsForVisibleResult')}
            />
            Ждать наблюдаемый DOM-result
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:col-span-2">
            <input
              type="checkbox"
              className="mr-3"
              checked={strategy.usesFixedDelay}
              onChange={() => toggle('usesFixedDelay')}
            />
            Полагаться на fixed sleep вместо явного результата
          </label>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <StatusPill tone={tone}>{analysis.verdict}</StatusPill>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {analysis.nextAssertion}
            </p>
          </div>
          <ListBlock
            title="Что усиливает стратегию"
            items={
              analysis.recommendedTools.length > 0
                ? analysis.recommendedTools
                : ['Ни один устойчивый опорный сигнал пока не выбран.']
            }
          />
        </div>

        <ListBlock
          title="Риски текущей конфигурации"
          items={
            analysis.risks.length > 0
              ? analysis.risks
              : [
                  'Явных рисков не видно: стратегия опирается на наблюдаемые состояния интерфейса.',
                ]
          }
        />
      </Panel>

      <AsyncResourceLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.waiting} />
      </Panel>
    </div>
  );
}
