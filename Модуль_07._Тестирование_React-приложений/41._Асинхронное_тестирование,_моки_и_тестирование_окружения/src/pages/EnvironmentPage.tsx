import { useState } from 'react';

import { PollingEnvironmentLab } from '../components/async-testing/PollingEnvironmentLab';
import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { setupCards } from '../lib/async-testing-domain';
import { projectStudyByLab } from '../lib/project-study';
import {
  evaluateEnvironmentSetup,
  type EnvironmentSetupInput,
} from '../lib/async-testing-runtime';

const initialEnvironment: EnvironmentSetupInput = {
  resetsMocks: true,
  resetsTimers: true,
  restoresGlobals: true,
  includesJestDom: true,
};

export function EnvironmentPage() {
  const [environment, setEnvironment] = useState(initialEnvironment);
  const result = evaluateEnvironmentSetup(environment);
  const tone =
    result.completeness === 4 ? 'success' : result.completeness >= 2 ? 'warn' : 'error';

  function toggle(field: keyof EnvironmentSetupInput) {
    setEnvironment((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Test environment"
        title="Асинхронный suite держится не только на assertions, но и на чистом окружении между тестами"
        copy="Здесь видно, как fake timers, cleanup и restore strategy перестают быть второстепенной инфраструктурой и становятся частью самой архитектуры тестов. Если среда протекает, поведение теста начинает зависеть от порядка запуска файлов."
        aside={<StatusPill tone={tone}>{result.verdict}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Completeness"
          value={`${result.completeness}/4`}
          hint="Чем меньше базовых reset-шагов, тем выше риск скрытых зависимостей между тестами."
        />
        <MetricCard
          label="Timers"
          value={environment.resetsTimers ? 'reset' : 'leaking'}
          hint="Fake timers особенно быстро ломают чужие тесты, если не вернуть real timers после suite."
          tone="accent"
        />
        <MetricCard
          label="Globals"
          value={environment.restoresGlobals ? 'restored' : 'stale'}
          hint="fetch и другие глобальные stub должны жить ровно столько, сколько длится один сценарий."
          tone="cool"
        />
      </div>

      <BeforeAfter
        beforeTitle="Протекающее окружение"
        before="Один тест включает fake timers, другой наследует их случайно и начинает падать только в полном прогоне."
        afterTitle="Собранная среда"
        after="После каждого теста возвращаются real timers, восстанавливаются mocks и очищается DOM, поэтому suite остаётся независимым."
      />

      <Panel className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Environment Checklist
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Проверьте состав test setup
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={environment.resetsMocks}
              onChange={() => toggle('resetsMocks')}
            />
            Сбрасывать mocks после каждого теста
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={environment.resetsTimers}
              onChange={() => toggle('resetsTimers')}
            />
            Возвращать real timers после fake timers
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={environment.restoresGlobals}
              onChange={() => toggle('restoresGlobals')}
            />
            Восстанавливать глобальные stub
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <input
              type="checkbox"
              className="mr-3"
              checked={environment.includesJestDom}
              onChange={() => toggle('includesJestDom')}
            />
            Подключать `@testing-library/jest-dom` в общем setup
          </label>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <StatusPill tone={tone}>{result.verdict}</StatusPill>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{result.nextStep}</p>
          </div>
          <ListBlock
            title="Что уже собрано"
            items={
              result.checklist.length > 0
                ? result.checklist
                : ['Пока не выбрано ни одной опоры устойчивого test environment.']
            }
          />
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Setup Backbone
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Базовые кирпичи окружения
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {setupCards.map((card) => (
            <div
              key={card.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
            </div>
          ))}
        </div>
      </Panel>

      <PollingEnvironmentLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.environment} />
      </Panel>
    </div>
  );
}
