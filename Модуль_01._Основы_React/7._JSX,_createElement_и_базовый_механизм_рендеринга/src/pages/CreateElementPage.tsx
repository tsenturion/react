import { useMemo, useState } from 'react';

import { ElementTreeView } from '../components/rendering/ElementTreeView';
import { ManualCatalogCard } from '../components/rendering/ManualCatalogCard';
import { JsxCatalogCard } from '../components/rendering/JsxCatalogCard';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildCardViewModel,
  buildCreateElementCardSnippet,
  buildJsxCardSnippet,
  defaultCardControls,
  type CardControls,
} from '../lib/catalog-card-model';
import { formatInspectedTree, inspectReactNode } from '../lib/element-inspector';
import { buildJsxCatalogCard } from '../lib/jsx-card-element';
import { buildManualCatalogCard } from '../lib/manual-card-element';
import { getProjectStudy } from '../lib/project-study';

export function CreateElementPage() {
  const [controls, setControls] = useState<CardControls>({
    ...defaultCardControls,
    tone: 'intensive',
    highlightCount: 4,
  });

  const viewModel = buildCardViewModel(controls);
  const study = getProjectStudy('create-element');

  const comparison = useMemo(() => {
    const jsxElement = buildJsxCatalogCard(viewModel);
    const manualElement = buildManualCatalogCard(viewModel);
    const jsxTree = formatInspectedTree(inspectReactNode(jsxElement));
    const manualTree = formatInspectedTree(inspectReactNode(manualElement));

    return {
      jsxElement,
      manualElement,
      sameTree: jsxTree === manualTree,
      jsxLines: buildJsxCardSnippet(viewModel).split('\n').length,
      manualLines: buildCreateElementCardSnippet(viewModel).split('\n').length,
    };
  }, [viewModel]);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="JSX и React.createElement(...)"
        copy="JSX удобнее читать, но обе формы описывают один и тот же React element tree. Здесь карточка строится двумя способами, а затем сравнивается на уровне структуры."
        aside={
          <div className="space-y-3 text-left">
            <StatusPill tone={comparison.sameTree ? 'success' : 'warn'}>
              {comparison.sameTree ? 'Описания совпадают' : 'Описания различаются'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если структура совпала, значит JSX действительно выступает как
              синтаксический сахар над тем же описанием интерфейса.
            </p>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard
          label="Tree parity"
          value={comparison.sameTree ? 'Да' : 'Нет'}
          hint="Сравнение идёт по итоговому React element tree."
          tone={comparison.sameTree ? 'cool' : 'accent'}
        />
        <MetricCard
          label="JSX lines"
          value={String(comparison.jsxLines)}
          hint="JSX короче, потому что структура записывается ближе к HTML-форме."
        />
        <MetricCard
          label="createElement lines"
          value={String(comparison.manualLines)}
          hint="Явная форма раскрывает механизм, но хуже читается на больших деревьях."
          tone="accent"
        />
      </div>

      <Panel className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setControls((current) => ({ ...current, showBadge: !current.showBadge }))
            }
            className="chip"
          >
            Badge: {controls.showBadge ? 'on' : 'off'}
          </button>
          <button
            type="button"
            onClick={() =>
              setControls((current) => ({
                ...current,
                stockState:
                  current.stockState === 'available'
                    ? 'low'
                    : current.stockState === 'low'
                      ? 'sold-out'
                      : 'available',
              }))
            }
            className="chip"
          >
            Stock: {controls.stockState}
          </button>
          <button
            type="button"
            onClick={() =>
              setControls((current) => ({
                ...current,
                highlightCount:
                  current.highlightCount === 5 ? 2 : current.highlightCount + 1,
              }))
            }
            className="chip"
          >
            Highlights: {controls.highlightCount}
          </button>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Через JSX</h2>
          <JsxCatalogCard viewModel={viewModel} />
          <CodeBlock label="JSX source" code={buildJsxCardSnippet(viewModel)} />
        </Panel>

        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Через createElement</h2>
          <ManualCatalogCard viewModel={viewModel} />
          <CodeBlock
            label="createElement source"
            code={buildCreateElementCardSnippet(viewModel)}
          />
        </Panel>
      </div>

      <Panel className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Общее итоговое дерево</h2>
        <ElementTreeView
          label="React element tree after createElement"
          element={comparison.manualElement}
        />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
