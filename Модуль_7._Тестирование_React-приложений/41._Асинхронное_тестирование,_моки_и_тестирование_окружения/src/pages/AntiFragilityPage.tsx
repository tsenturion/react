import { useState } from 'react';

import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { smellCards } from '../lib/async-testing-domain';
import { projectStudyByLab } from '../lib/project-study';
import { evaluateTestingSmell, type SmellInput } from '../lib/async-testing-runtime';

const initialSmells: SmellInput = {
  usesSleep: true,
  assertsImplementation: false,
  leaksEnvironment: false,
  overMocks: true,
};

export function AntiFragilityPage() {
  const [smells, setSmells] = useState(initialSmells);
  const evaluation = evaluateTestingSmell(smells);
  const activeCount =
    Number(smells.usesSleep) +
    Number(smells.assertsImplementation) +
    Number(smells.leaksEnvironment) +
    Number(smells.overMocks);
  const tone = evaluation.severity.includes('Высокая')
    ? 'error'
    : evaluation.severity.includes('Средняя')
      ? 'warn'
      : 'success';

  function toggle(field: keyof SmellInput) {
    setSmells((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function isCardActive(id: string) {
    switch (id) {
      case 'sleep':
        return smells.usesSleep;
      case 'implementation':
        return smells.assertsImplementation;
      case 'leaking-environment':
        return smells.leaksEnvironment;
      case 'over-mocking':
        return smells.overMocks;
      default:
        return false;
    }
  }

  function toggleFromCard(id: string) {
    switch (id) {
      case 'sleep':
        toggle('usesSleep');
        return;
      case 'implementation':
        toggle('assertsImplementation');
        return;
      case 'leaking-environment':
        toggle('leaksEnvironment');
        return;
      case 'over-mocking':
        toggle('overMocks');
        return;
      default:
        return;
    }
  }

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Anti-fragility"
        title="Async-тесты ломаются не из-за асинхронности как таковой, а из-за неверной синхронизации и слишком широких моков"
        copy="На этой странице можно собрать собственный smell-профиль и увидеть, как быстро fixed sleep, implementation assertions и leaking environment делают test suite недостоверным."
        aside={<StatusPill tone={tone}>{evaluation.severity}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Active Smells"
          value={String(activeCount)}
          hint="Каждая включённая ловушка повышает стоимость сопровождения и риск ложных срабатываний."
        />
        <MetricCard
          label="Main Fix"
          value={activeCount === 0 ? 'stable loop' : 'visible result'}
          hint="Самое частое улучшение: ждать то, что видит пользователь, а не то, что удобно внутренней реализации."
          tone="accent"
        />
        <MetricCard
          label="Recommendation"
          value={tone === 'success' ? 'keep it small' : 'tighten scope'}
          hint="Чем уже mock boundary и чище environment, тем меньше скрытых зависимостей между тестами."
          tone="cool"
        />
      </div>

      <BeforeAfter
        beforeTitle="Ложно-зелёный тест"
        before="Тест ждёт фиксированное время, читает внутренние вызовы и случайно проходит благодаря чужому состоянию окружения."
        afterTitle="Устойчивая проверка"
        after="Тест синхронизируется по alert/status/list, мокает только внешнюю границу и очищает среду после каждого сценария."
      />

      <Panel className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Smell Builder
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Включайте и выключайте ловушки по одной
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {smellCards.map((card) => {
            const active = isCardActive(card.id);

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => toggleFromCard(card.id)}
                className={`rounded-[24px] border p-5 text-left shadow-sm transition ${
                  active
                    ? 'border-rose-300 bg-rose-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                  <StatusPill tone={active ? 'error' : 'warn'}>
                    {active ? 'active' : 'inactive'}
                  </StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.symptom}</p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Риск
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{card.risk}</p>
                </div>
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Лучше сделать так
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-950">{card.better}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <StatusPill tone={tone}>{evaluation.severity}</StatusPill>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {evaluation.recommendation}
            </p>
          </div>
          <ListBlock
            title="Зафиксированные проблемы"
            items={
              evaluation.issues.length > 0
                ? evaluation.issues
                : [
                    'Хрупких мест не видно: ожидание, mock boundary и environment выглядят собранно.',
                  ]
            }
          />
        </div>
      </Panel>

      <Panel>
        <ProjectStudy {...projectStudyByLab['anti-fragility']} />
      </Panel>
    </div>
  );
}
