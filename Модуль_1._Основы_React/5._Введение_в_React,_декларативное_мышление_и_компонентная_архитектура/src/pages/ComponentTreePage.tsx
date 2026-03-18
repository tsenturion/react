import { useState } from 'react';

import { ComponentTreeView } from '../components/architecture/ComponentTreeView';
import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildComponentTreeScenario,
  stateOwners,
  type StateOwner,
  type TreeNodeId,
} from '../lib/component-tree-model';
import { projectStudy } from '../lib/project-study';

export function ComponentTreePage() {
  const [stateOwner, setStateOwner] = useState<StateOwner>('workbench');
  const [selectedNodeId, setSelectedNodeId] = useState<TreeNodeId>('workbench-layout');

  const scenario = buildComponentTreeScenario(stateOwner, selectedNodeId);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Component Tree"
        title="Как читать дерево компонентов и владельца состояния"
        copy="React-интерфейс удобнее воспринимать как дерево: у каждого узла есть роль, входные props и место в общей композиции. Ниже можно менять владельца состояния и смотреть, что это делает с деревом и цепочкой props."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {scenario.tone === 'success'
                ? 'Граница owner выглядит здоровой'
                : scenario.tone === 'warn'
                  ? 'Owner поднят шире нужного'
                  : 'Owner опущен слишком низко'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">{scenario.ownerReason}</p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">Где живёт state</p>
          <div className="flex flex-wrap gap-2">
            {stateOwners.map((owner) => (
              <button
                key={owner.id}
                type="button"
                onClick={() => setStateOwner(owner.id)}
                className={`chip ${stateOwner === owner.id ? 'chip-active' : ''}`}
              >
                {owner.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <ComponentTreeView
            nodes={[scenario.tree]}
            selectedId={selectedNodeId}
            onSelect={(id) => setSelectedNodeId(id as TreeNodeId)}
          />

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Выбранный узел
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                {scenario.selectedNode.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {scenario.selectedNode.role}
              </p>
            </div>

            <ListBlock
              title="Что получает через props"
              items={scenario.selectedNode.receives}
            />
            <ListBlock title="Что отдаёт дальше" items={scenario.selectedNode.sends} />
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Текущий state owner"
          value={scenario.stateOwnerLabel}
          hint="Это компонент, который держит источник истины для текущего сценария."
          tone="accent"
        />
        <MetricCard
          label="Длина prop chain"
          value={String(scenario.propChain.length)}
          hint={`Путь до выбранного узла: ${scenario.propChain.join(' → ')}`}
          tone="cool"
        />
        <MetricCard
          label="Rerender scope"
          value={scenario.tone === 'success' ? 'Локальный' : 'Шире нормы'}
          hint={scenario.rerenderScope}
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Путь от owner к дереву" items={scenario.updatePath} />
        </Panel>
        <Panel>
          <ListBlock title="Архитектурные риски" items={scenario.risks} />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy
          files={projectStudy.tree.files}
          snippets={projectStudy.tree.snippets}
        />
      </Panel>
    </div>
  );
}
