export type ProfilingScenarioId = 'filter-workbench' | 'composer-pane' | 'dense-grid';

export type ProfilingInput = {
  readonly scenarioId: ProfilingScenarioId;
  readonly dataSize: 'small' | 'medium' | 'large';
  readonly compilerEnabled: boolean;
  readonly manualMemoKept: boolean;
};

export type ProfilerTracePoint = {
  readonly label: string;
  readonly beforeMs: number;
  readonly afterMs: number;
};

export type ProfilingReport = {
  readonly title: string;
  readonly beforeCommitMs: number;
  readonly afterCommitMs: number;
  readonly beforeRerenders: number;
  readonly afterRerenders: number;
  readonly devtoolsSignal: string;
  readonly trace: readonly ProfilerTracePoint[];
  readonly workflow: readonly string[];
};

type ScenarioMeta = {
  readonly title: string;
  readonly baseCommitMs: number;
  readonly baseRerenders: number;
  readonly devtoolsSignal: string;
};

const scenarioMeta: Record<ProfilingScenarioId, ScenarioMeta> = {
  'filter-workbench': {
    title: 'Filter workbench',
    baseCommitMs: 38,
    baseRerenders: 17,
    devtoolsSignal:
      'Parent state churn repeatedly redraws filter badges and result summary while typing.',
  },
  'composer-pane': {
    title: 'Composer pane',
    baseCommitMs: 26,
    baseRerenders: 15,
    devtoolsSignal:
      'Typing into the editor also repaints preview and toolbar even when their logical inputs stay stable.',
  },
  'dense-grid': {
    title: 'Dense grid',
    baseCommitMs: 52,
    baseRerenders: 24,
    devtoolsSignal:
      'A large data grid shows repeated row work; compiler helps some subtree churn but does not replace virtualization.',
  },
};

const sizeMultiplier = {
  small: 0.8,
  medium: 1,
  large: 1.35,
} as const;

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function buildProfilingReport(input: ProfilingInput): ProfilingReport {
  const meta = scenarioMeta[input.scenarioId];
  const baseCommitMs = meta.baseCommitMs * sizeMultiplier[input.dataSize];
  const baseRerenders = meta.baseRerenders * sizeMultiplier[input.dataSize];

  const compilerFactor = input.compilerEnabled ? 0.68 : 1;
  const manualFactor = input.manualMemoKept ? 0.93 : 1;
  const combinedFactor = compilerFactor * manualFactor;

  const afterCommitMs = round(baseCommitMs * combinedFactor);
  const afterRerenders = Math.max(
    2,
    Math.round(baseRerenders * (input.compilerEnabled ? 0.62 : 0.84)),
  );

  return {
    title: meta.title,
    beforeCommitMs: round(baseCommitMs),
    afterCommitMs,
    beforeRerenders: Math.round(baseRerenders),
    afterRerenders,
    devtoolsSignal: meta.devtoolsSignal,
    trace: [
      {
        label: 'Input update',
        beforeMs: round(baseCommitMs * 0.38),
        afterMs: round(afterCommitMs * 0.34),
      },
      {
        label: 'Unrelated subtree',
        beforeMs: round(baseCommitMs * 0.34),
        afterMs: round(afterCommitMs * (input.compilerEnabled ? 0.16 : 0.29)),
      },
      {
        label: 'Derived data',
        beforeMs: round(baseCommitMs * 0.28),
        afterMs: round(afterCommitMs * (input.manualMemoKept ? 0.27 : 0.31)),
      },
    ] as const,
    workflow: [
      'Сначала зафиксируйте interaction, где lag реально заметен пользователю.',
      'Откройте React Profiler и посмотрите commit duration вместе с причинами ререндеров.',
      'После включения compiler повторите тот же сценарий и сравните именно поведение, а не количество удалённых useMemo.',
      'Если выигрыш маленький, ищите architectural bottleneck: context scope, data flow, DOM size или effects.',
    ] as const,
  };
}
