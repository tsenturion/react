import { useState } from 'react';

import { ElementTreeView } from '../components/rendering/ElementTreeView';
import { JsxCatalogCard } from '../components/rendering/JsxCatalogCard';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildCardViewModel,
  buildJsxCardSnippet,
  defaultCardControls,
  summarizeCardViewModel,
  type CardControls,
  type PricingMode,
  type ShowcaseTone,
  type StockState,
} from '../lib/catalog-card-model';
import { buildJsxCatalogCard } from '../lib/jsx-card-element';
import { getProjectStudy } from '../lib/project-study';

const toneOptions: ShowcaseTone[] = ['balanced', 'launch', 'intensive'];
const stockOptions: StockState[] = ['available', 'low', 'sold-out'];
const pricingOptions: PricingMode[] = ['full', 'installment'];

export function JsxOverviewPage() {
  const [controls, setControls] = useState<CardControls>(defaultCardControls);
  const viewModel = buildCardViewModel(controls);
  const stats = summarizeCardViewModel(viewModel);
  const study = getProjectStudy('overview');
  const jsxElement = buildJsxCatalogCard(viewModel);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="JSX как описание интерфейса"
        copy="JSX не меняет DOM напрямую. Он помогает коротко описать, какой интерфейс должен получиться из текущих данных. Ниже одна и та же карточка перестраивается только из-за изменения входных параметров."
        aside={
          <div className="space-y-3 text-left">
            <p className="text-sm font-semibold text-slate-900">Ключевой тезис</p>
            <p className="text-sm leading-6 text-slate-600">
              Пока вы пишете JSX, вы описываете React elements. DOM появится позже, после
              сравнения нового дерева с предыдущим.
            </p>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Параметры описания</h2>
            <p className="text-sm leading-6 text-slate-600">
              Меняйте данные и следите, как JSX меняет только описание интерфейса.
            </p>
          </div>

          <div className="space-y-4">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Сценарий карточки</span>
              <select
                value={controls.tone}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    tone: event.target.value as ShowcaseTone,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                {toneOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Состояние набора</span>
              <select
                value={controls.stockState}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    stockState: event.target.value as StockState,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                {stockOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Режим цены</span>
              <select
                value={controls.pricingMode}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    pricingMode: event.target.value as PricingMode,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                {pricingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="flex items-center justify-between font-medium">
                Пунктов в списке
                <span className="text-slate-500">{controls.highlightCount}</span>
              </span>
              <input
                type="range"
                min={1}
                max={5}
                value={controls.highlightCount}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    highlightCount: Number(event.target.value),
                  }))
                }
                className="w-full"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-medium">Показывать badge</span>
              <input
                type="checkbox"
                checked={controls.showBadge}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    showBadge: event.target.checked,
                  }))
                }
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-medium">Компактная плотность</span>
              <input
                type="checkbox"
                checked={controls.density === 'compact'}
                onChange={(event) =>
                  setControls((current) => ({
                    ...current,
                    density: event.target.checked ? 'compact' : 'comfortable',
                  }))
                }
              />
            </label>
          </div>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Root type"
              value={stats.rootType}
              hint="JSX возвращает корневой `article`, а не напрямую работает с DOM."
            />
            <MetricCard
              label="Visible children"
              value={stats.visibleChildren}
              hint="Число узлов растёт из данных, а не из ручного append/remove."
              tone="cool"
            />
            <MetricCard
              label="Expressions"
              value={stats.expressionCount}
              hint="Условия, строки и массивы уже встроены в описание интерфейса."
              tone="accent"
            />
          </div>

          <Panel className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
            <JsxCatalogCard viewModel={viewModel} />
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Текущий JSX" code={buildJsxCardSnippet(viewModel)} />
            <Panel className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Почему это удобно</h2>
              <ListBlock
                title="Что даёт JSX"
                items={[
                  'Состояние карточки читается из данных, а не из цепочки `appendChild(...)`.',
                  'Условия и списки остаются частью JavaScript-выражений.',
                  'Структуру интерфейса видно целиком в одном месте.',
                ]}
              />
            </Panel>
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              React element tree, созданный JSX
            </h2>
            <ElementTreeView label="JSX element tree" element={jsxElement} />
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
