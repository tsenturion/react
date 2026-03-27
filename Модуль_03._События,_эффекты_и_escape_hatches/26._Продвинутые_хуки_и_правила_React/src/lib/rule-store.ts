import type { StatusTone } from './learning-model';

export type RulePreset = 'recommended' | 'recommended-latest';
export type StoreRuleFlag =
  | 'stableIds'
  | 'debugHooks'
  | 'syncSnapshot'
  | 'pureRender'
  | 'safeRefs';

export type RuleStoreSnapshot = {
  preset: RulePreset;
  stableIds: boolean;
  debugHooks: boolean;
  syncSnapshot: boolean;
  pureRender: boolean;
  safeRefs: boolean;
  revision: number;
  lastAction: string;
};

export const initialRuleStoreSnapshot: RuleStoreSnapshot = {
  preset: 'recommended-latest',
  stableIds: true,
  debugHooks: true,
  syncSnapshot: false,
  pureRender: true,
  safeRefs: true,
  revision: 1,
  lastAction: 'Store создан',
};

let snapshot: RuleStoreSnapshot = initialRuleStoreSnapshot;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function patchStore(partial: Partial<RuleStoreSnapshot>, lastAction: string) {
  snapshot = {
    ...snapshot,
    ...partial,
    revision: snapshot.revision + 1,
    lastAction,
  };
  emit();
}

export const ruleStore = {
  getSnapshot() {
    return snapshot;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setPreset(preset: RulePreset) {
    patchStore({ preset }, `Preset переключён на ${preset}`);
  },
  toggleFlag(flag: StoreRuleFlag) {
    patchStore({ [flag]: !snapshot[flag] }, `Флаг ${flag} переключён`);
  },
  reset() {
    snapshot = initialRuleStoreSnapshot;
    emit();
  },
};

export function summarizeRuleStore(storeSnapshot: RuleStoreSnapshot): {
  enabledCount: number;
  totalCount: number;
  tone: StatusTone;
  headline: string;
} {
  const flags: StoreRuleFlag[] = [
    'stableIds',
    'debugHooks',
    'syncSnapshot',
    'pureRender',
    'safeRefs',
  ];
  const enabledCount = flags.filter((flag) => storeSnapshot[flag]).length;
  const totalCount = flags.length;

  let tone: StatusTone = 'success';
  if (enabledCount <= 2) {
    tone = 'error';
  } else if (enabledCount < totalCount) {
    tone = 'warn';
  }

  return {
    enabledCount,
    totalCount,
    tone,
    headline:
      tone === 'success'
        ? 'Внешний store выглядит согласованным'
        : tone === 'warn'
          ? 'Есть частичная деградация store snapshot'
          : 'Store уже несёт риск рассинхрона',
  };
}

export function formatRuleStoreDebugValue(
  summary: ReturnType<typeof summarizeRuleStore>,
) {
  return `${summary.enabledCount}/${summary.totalCount} flags active`;
}
