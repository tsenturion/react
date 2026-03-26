import { useState } from 'react';

import {
  describeCompositionChoice,
  type LinkMode,
} from '../../lib/rsc-composition-model';
import type { ComponentLayer } from '../../lib/rsc-boundary-model';
import { BeforeAfter, ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function CompositionBoundaryLab() {
  const [hostLayer, setHostLayer] = useState<ComponentLayer>('server');
  const [childLayer, setChildLayer] = useState<ComponentLayer>('client');
  const [linkMode, setLinkMode] = useState<LinkMode>('import');
  const result = describeCompositionChoice({
    hostLayer,
    childLayer,
    linkMode,
  });

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Composition rules</span>
          <p className="text-sm leading-6 text-slate-600">
            Меняйте слой host-компонента, слой child-компонента и способ композиции.
            Лаборатория сразу показывает, где проходит допустимая mixed boundary.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Host layer
            </p>
            <div className="flex flex-wrap gap-2">
              {(['server', 'client'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setHostLayer(value)}
                  className={`chip ${hostLayer === value ? 'chip-active' : ''}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Child layer
            </p>
            <div className="flex flex-wrap gap-2">
              {(['server', 'client'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setChildLayer(value)}
                  className={`chip ${childLayer === value ? 'chip-active' : ''}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Link mode
            </p>
            <div className="flex flex-wrap gap-2">
              {(['import', 'slot'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLinkMode(value)}
                  className={`chip ${linkMode === value ? 'chip-active' : ''}`}
                >
                  {value === 'import' ? 'Direct import' : 'Slot / children'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Host"
          value={hostLayer.toUpperCase()}
          hint="Компонент-обёртка, в который встраивается child."
          tone="accent"
        />
        <MetricCard
          label="Child"
          value={childLayer.toUpperCase()}
          hint="Дочерний блок, который нужно встроить в host."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Result
          </p>
          <div className="mt-3">
            <StatusPill tone={result.tone}>{result.headline}</StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{result.bundleImpact}</p>
        </div>
      </div>

      <Panel className="space-y-4">
        <p className="text-sm leading-6 text-slate-700">{result.explanation}</p>
        <ListBlock title="Tree trace" items={result.treeLines} />
      </Panel>

      <BeforeAfter
        beforeTitle="Анти-паттерн"
        before="Client wrapper напрямую импортирует server child. В этот момент модульная граница ломается, потому что browser bundle не должен уметь исполнять server module."
        afterTitle="Рабочая композиция"
        after="Server parent собирает server content заранее и передаёт его в client wrapper через children/slot. Client слой получает уже готовый server output, а не server import."
      />
    </div>
  );
}
