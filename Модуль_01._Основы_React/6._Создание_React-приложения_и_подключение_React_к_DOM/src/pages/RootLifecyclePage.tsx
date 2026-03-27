import { useState } from 'react';

import { RootLifecycleSandbox } from '../components/root/RootLifecycleSandbox';
import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  describeRootLifecycle,
  type RootLifecycleSnapshot,
} from '../lib/root-lifecycle-model';
import { projectStudy } from '../lib/project-study';

const initialSnapshot: RootLifecycleSnapshot = {
  hostPresent: true,
  rootCreated: false,
  treeMounted: false,
  activeView: 'none',
  logCount: 0,
};

export function RootLifecyclePage() {
  const [snapshot, setSnapshot] = useState<RootLifecycleSnapshot>(initialSnapshot);
  const scenario = describeRootLifecycle(snapshot);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="React Root Lifecycle"
        title="createRoot, render, update и unmount на живом sandbox"
        copy="Ниже находится отдельный sub-root, созданный прямо внутри текущего проекта. Вы можете создать `React Root`, смонтировать в него поддерево, заменить его другим `root.render(...)` и затем очистить через `root.unmount()`."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {snapshot.rootCreated ? 'React Root уже создан' : 'Root пока не создан'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">{scenario.stateLabel}</p>
          </div>
        }
      />

      <Panel>
        <RootLifecycleSandbox onSnapshotChange={setSnapshot} />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Host container"
          value={snapshot.hostPresent ? 'Есть в DOM' : 'Отсутствует'}
          hint="React не может создать client root без реального DOM-контейнера."
          tone="accent"
        />
        <MetricCard
          label="Статус root"
          value={snapshot.rootCreated ? 'Создан' : 'Не создан'}
          hint="`createRoot(container)` создаёт instance root, но ещё не показывает UI сам по себе."
          tone="cool"
        />
        <MetricCard
          label="Текущее дерево"
          value={snapshot.activeView}
          hint={scenario.visibleUI}
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Что можно сделать дальше" items={scenario.allowedActions} />
        </Panel>
        <Panel>
          <ListBlock title="Что важно не сломать" items={scenario.risks} />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy
          files={projectStudy.lifecycle.files}
          snippets={projectStudy.lifecycle.snippets}
        />
      </Panel>
    </div>
  );
}
