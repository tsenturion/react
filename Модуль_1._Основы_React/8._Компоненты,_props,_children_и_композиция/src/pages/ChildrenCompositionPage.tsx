import { useMemo, useState } from 'react';

import { SlotFrame } from '../components/composition/SlotFrame';
import { ElementTreeView } from '../components/rendering/ElementTreeView';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildChildrenScenario,
  type ChildrenScenarioId,
} from '../lib/children-slot-model';
import { getProjectStudy } from '../lib/project-study';

const scenarioOptions: ChildrenScenarioId[] = ['summary', 'checklist', 'split-view'];

export function ChildrenCompositionPage() {
  const [scenarioId, setScenarioId] = useState<ChildrenScenarioId>('summary');
  const [showAside, setShowAside] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  const scenario = buildChildrenScenario(scenarioId, showAside, showFooter);
  const study = getProjectStudy('children');

  const slotElement = useMemo(() => {
    const sharedProps = {
      eyebrow: scenario.eyebrow,
      title: scenario.title,
      description: scenario.description,
      aside: showAside ? <p>{scenario.asideLabel}</p> : undefined,
      footer: showFooter ? scenario.footerLabel : undefined,
    };

    if (scenarioId === 'summary') {
      return (
        <SlotFrame {...sharedProps}>
          <p>Компонент может принять обычный текст, список или даже другой layout.</p>
          <p>`children` остаётся таким же входным prop, как и любой другой.</p>
        </SlotFrame>
      );
    }

    if (scenarioId === 'checklist') {
      return (
        <SlotFrame {...sharedProps}>
          <ul className="space-y-2">
            <li>Определить внешний contract компонента.</li>
            <li>Не зашивать контент внутрь без причины.</li>
            <li>Оставить возможность передавать children извне.</li>
          </ul>
        </SlotFrame>
      );
    }

    return (
      <SlotFrame {...sharedProps}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-100 p-4">Левая колонка</div>
          <div className="rounded-2xl bg-slate-100 p-4">Правая колонка</div>
        </div>
        <p>Снаружи компонент выглядит так же, хотя содержимое стало сложнее.</p>
      </SlotFrame>
    );
  }, [scenario, scenarioId, showAside, showFooter]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Children, вложенность и slot-based композиция"
        copy="`children` позволяет компоненту принимать не только скалярные props, но и целые фрагменты интерфейса. Это делает компонент каркасом, а не закрытым блоком с жёстко зашитым содержимым."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Сценарий children</h2>

          <div className="space-y-2">
            {scenarioOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setScenarioId(item)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  scenarioId === item
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Показывать aside</span>
            <input
              type="checkbox"
              checked={showAside}
              onChange={(event) => setShowAside(event.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Показывать footer</span>
            <input
              type="checkbox"
              checked={showFooter}
              onChange={(event) => setShowFooter(event.target.checked)}
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Children blocks"
              value={String(scenario.childCount)}
              hint="Сколько внутренних блоков передано через children."
              tone="cool"
            />
            <MetricCard
              label="Aside slot"
              value={showAside ? 'on' : 'off'}
              hint="Дополнительный slot можно включать отдельно от основного children."
            />
            <MetricCard
              label="Footer slot"
              value={showFooter ? 'on' : 'off'}
              hint="Компонент остаётся расширяемым без переписывания его тела."
              tone="accent"
            />
          </div>

          {slotElement}

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Использование SlotFrame" code={scenario.snippet} />
            <Panel className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Что здесь важно</h2>
              <p className="text-sm leading-6 text-slate-600">
                Контейнер не знает заранее, какие именно элементы придут внутрь. Он
                предоставляет каркас, а содержимое приезжает извне через `children`,
                `aside` и `footer`.
              </p>
            </Panel>
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Element tree с children
            </h2>
            <ElementTreeView label="Slot composition tree" element={slotElement} />
          </Panel>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
