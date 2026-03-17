import { useState } from 'react';

import { ListBlock, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import {
  deliveryRequirementOptions,
  recommendDeliveryModes,
  type DeliveryRequirementId,
} from '../lib/learning-model';
import { deliveryStudy } from '../lib/project-study';

const presets: {
  id: string;
  label: string;
  requirements: DeliveryRequirementId[];
}[] = [
  {
    id: 'learning',
    label: 'Учебный старт',
    requirements: ['fast-start', 'interactive-dashboard', 'minimal-tooling'],
  },
  {
    id: 'marketing',
    label: 'Маркетинговый сайт',
    requirements: ['marketing-seo', 'team-scale', 'long-lived-product'],
  },
  {
    id: 'product',
    label: 'Full-stack продукт',
    requirements: [
      'interactive-dashboard',
      'server-data',
      'server-actions',
      'team-scale',
      'long-lived-product',
    ],
  },
];

export function DeliveryModesPage() {
  const [requirements, setRequirements] = useState<DeliveryRequirementId[]>(
    presets[0].requirements,
  );

  // Победитель не захардкожен в JSX: страница каждый раз пересчитывает рекомендацию
  // из активного набора требований, как это происходило бы в обычной бизнес-логике.
  const recommendation = recommendDeliveryModes(requirements);
  // Подсветка пресета зависит от текущего состояния требований, а не от "последней
  // нажатой кнопки". Поэтому ручные изменения не ломают правдивость интерфейса.
  const activePresetId =
    presets.find(
      (preset) =>
        preset.requirements.length === requirements.length &&
        preset.requirements.every((item) => requirements.includes(item)),
    )?.id ?? null;

  const toggleRequirement = (requirementId: DeliveryRequirementId) => {
    setRequirements((current) =>
      current.includes(requirementId)
        ? current.filter((item) => item !== requirementId)
        : [...current, requirementId],
    );
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="No-build vs Vite vs framework-first"
        copy="На этой странице вы учитесь выбирать не модный инструмент, а подход под конкретную задачу. Вы задаёте требования продукта и сразу видите, какой уровень абстракции выигрывает и где начинаются границы применения."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Быстрые пресеты
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setRequirements([...preset.requirements])}
                    className={`chip ${activePresetId === preset.id ? 'chip-active' : ''}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {deliveryRequirementOptions.map((item) => {
                const active = requirements.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleRequirement(item.id)}
                    className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                      active
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-black/10 bg-white/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-[10px] uppercase tracking-[0.18em]">
                        {active ? 'required' : 'off'}
                      </span>
                    </div>
                    <p className={`mt-2 text-sm leading-6 ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                      {item.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-emerald-300/40 bg-emerald-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Лучшая рекомендация
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-emerald-950">
                {recommendation.winner.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-900">
                {recommendation.winner.summary}
              </p>
              <div className="mt-4 rounded-[20px] bg-white/70 px-4 py-3 text-sm font-semibold text-emerald-900">
                Score: {recommendation.winner.score}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {recommendation.modes.map((mode) => (
                <div
                  key={mode.id}
                  className={`rounded-[24px] border p-4 ${
                    mode.id === recommendation.winner.id
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-black/10 bg-white/65 text-slate-900'
                  }`}
                >
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-base font-semibold leading-6 break-words">
                      {mode.label}
                    </p>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold">
                      {mode.score}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${mode.id === recommendation.winner.id ? 'text-slate-200' : 'text-slate-600'}`}>
                    {mode.summary}
                  </p>
                  <div className="mt-4 space-y-2">
                    {mode.strengths.map((item) => (
                      <p
                        key={item}
                        className={`rounded-2xl px-3 py-2 text-sm ${
                          mode.id === recommendation.winner.id
                            ? 'bg-white/10 text-white'
                            : 'bg-white/70 text-slate-700'
                        }`}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ListBlock
            title="Где это особенно полезно"
            items={[
              'Когда нужно выбрать стартовую архитектуру нового проекта и не перепутать задачу клиента со full-stack платформой.',
              'Когда важно объяснить, почему учебный курс логично начинает с Vite, а не с framework-first слоя.',
              'Когда нужно понять момент, в котором SPA уже начинает упираться в потолок архитектуры.',
            ]}
          />
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock
          title="Частые ошибки выбора"
          items={[
            'Считать no-build вариантом для типичного production React-приложения.',
            'Думать, что Vite устарел, если у проекта нет потребности в SSR и server actions.',
            'Подключать framework-first не из-за требований продукта, а просто потому, что он "полнее".',
          ]}
        />
        <ListBlock
          title="Короткий вывод"
          items={[
            'Для введения в React и современный клиентский стек Vite остаётся самой понятной и практичной отправной точкой.',
            'No-build полезен как контраст и как способ увидеть границы платформы.',
            'Framework-first нужен позже, когда задача реально выходит за пределы клиентского SPA.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy files={deliveryStudy.files} snippets={deliveryStudy.snippets} />
      </Panel>
    </div>
  );
}
