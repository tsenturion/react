import { useMemo, useState } from 'react';

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
import { smellCards } from '../lib/rtl-domain';
import { evaluateTestingSmell, type SmellInput } from '../lib/rtl-runtime';

export function AntiPatternsPage() {
  const [input, setInput] = useState<SmellInput>({
    readsInternalState: true,
    mocksSetState: false,
    queriesByClassName: false,
    assertsVisibleResult: true,
    hidesProviderNoise: true,
  });

  const recommendation = useMemo(() => evaluateTestingSmell(input), [input]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Anti-patterns"
        title="Плохой RTL-тест знает слишком много о реализации и слишком мало о пользовательском результате"
        copy="Внизу можно собрать smell-профиль теста и посмотреть, насколько он остаётся user-centric."
        aside={
          <StatusPill
            tone={recommendation.verdict === 'behavior-oriented' ? 'success' : 'error'}
          >
            {recommendation.verdict}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Smell score"
          value={String(recommendation.score)}
          hint="Чем сильнее тест привязан к внутренностям, тем хуже переносится рефакторинг."
        />
        <MetricCard
          label="Better approach"
          value={recommendation.betterApproach}
          hint="Здесь важнее observable outcome, а не private implementation."
          tone="accent"
        />
        <MetricCard
          label="Main rule"
          value="test the contract"
          hint="Контракт компонента — это доступный UI и реакции на пользовательские действия."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Соберите профиль тестового smell
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['readsInternalState', 'Тест читает внутренний state'],
            ['mocksSetState', 'Тест мокает setState или handler вместо userEvent'],
            ['queriesByClassName', 'Элемент ищется по className'],
            ['assertsVisibleResult', 'Тест проверяет видимый пользовательский результат'],
            ['hidesProviderNoise', 'Повторяемый setup вынесен в понятный helper'],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={input[key as keyof SmellInput]}
                onChange={(event) =>
                  setInput((current) => ({
                    ...current,
                    [key as keyof SmellInput]: event.target.checked,
                  }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <ListBlock title="Почему это важно" items={recommendation.why} />
      </Panel>

      <BeforeAfter
        beforeTitle="Implementation-centric test"
        before="Тест монтирует компонент, ищет `.button-primary`, вручную вызывает callback и проверяет private state."
        afterTitle="Behavior-oriented test"
        after="Тест использует role queries, userEvent и проверяет alert, status, disabled state и видимую копию интерфейса."
      />

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Частые smell-карты</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {smellCards.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.signal}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.whyRisky}</p>
              <p className="mt-3 text-sm leading-6 text-slate-900">
                <strong>Лучше:</strong> {item.better}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab['anti-patterns']} />
      </Panel>
    </div>
  );
}
