import { useState } from 'react';

import { StrictModeSandbox } from '../components/root/StrictModeSandbox';
import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  describeStrictModeScenario,
  type ProbeKind,
  type StrictModeSnapshot,
} from '../lib/strict-mode-model';
import { projectStudy } from '../lib/project-study';

const initialSnapshot: StrictModeSnapshot = {
  runtimeMode: 'development',
  strictEnabled: true,
  probeKind: 'impure',
  renderedItems: 0,
  effectLogCount: 0,
};

export function StrictModePage() {
  const [strictEnabled, setStrictEnabled] = useState(true);
  const [probeKind, setProbeKind] = useState<ProbeKind>('impure');
  const [refreshToken, setRefreshToken] = useState(0);
  const [snapshot, setSnapshot] = useState<StrictModeSnapshot>(initialSnapshot);
  const scenario = describeStrictModeScenario(snapshot);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="StrictMode"
        title="Зачем StrictMode нужен в development"
        copy="Эта лаборатория использует отдельный React Root, чтобы можно было сравнить subtree с `StrictMode` и без него прямо внутри текущего приложения. Попробуйте чистый и нечистый probe и посмотрите, как dev-only проверки делают проблему заметнее."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {snapshot.runtimeMode === 'development'
                ? 'dev-only checks активны'
                : 'production runtime'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              {scenario.expectedRenderPattern}
            </p>
          </div>
        }
      />

      <Panel className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">Обёртка StrictMode</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStrictEnabled(true)}
              className={`chip ${strictEnabled ? 'chip-active' : ''}`}
            >
              Включена
            </button>
            <button
              type="button"
              onClick={() => setStrictEnabled(false)}
              className={`chip ${!strictEnabled ? 'chip-active' : ''}`}
            >
              Выключена
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">Probe type</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setProbeKind('pure')}
              className={`chip ${probeKind === 'pure' ? 'chip-active' : ''}`}
            >
              Pure
            </button>
            <button
              type="button"
              onClick={() => setProbeKind('impure')}
              className={`chip ${probeKind === 'impure' ? 'chip-active' : ''}`}
            >
              Impure
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRefreshToken((current) => current + 1)}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Перемонтировать sandbox
        </button>
      </Panel>

      <Panel>
        <StrictModeSandbox
          strictEnabled={strictEnabled}
          probeKind={probeKind}
          refreshToken={refreshToken}
          onSnapshotChange={setSnapshot}
        />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Runtime mode"
          value={snapshot.runtimeMode}
          hint="StrictMode dev-checks имеют смысл именно в development и не задают production-контракт."
          tone="accent"
        />
        <MetricCard
          label="Видимых элементов"
          value={String(snapshot.renderedItems)}
          hint={scenario.renderedItemsLabel}
          tone="cool"
        />
        <MetricCard
          label="Effect log"
          value={String(snapshot.effectLogCount)}
          hint={scenario.effectInterpretation}
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Зачем это полезно" items={scenario.usefulBecause} />
        </Panel>
        <Panel>
          <ListBlock title="Частые заблуждения" items={scenario.misconceptions} />
        </Panel>
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Без dev-checks"
          before={scenario.before}
          afterTitle="С StrictMode в development"
          after={scenario.after}
        />
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.strictMode.files}
          snippets={projectStudy.strictMode.snippets}
        />
      </Panel>
    </div>
  );
}
