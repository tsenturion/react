import { useDebugValue, useSyncExternalStore } from 'react';

import {
  formatRuleStoreDebugValue,
  ruleStore,
  summarizeRuleStore,
  type RulePreset,
  type StoreRuleFlag,
} from '../lib/rule-store';

export function useLintRuleStore() {
  const snapshot = useSyncExternalStore(ruleStore.subscribe, ruleStore.getSnapshot);
  const summary = summarizeRuleStore(snapshot);

  // useSyncExternalStore держит React на согласованном snapshot-е внешнего store.
  // useDebugValue помогает быстро увидеть, насколько store сейчас здоров.
  useDebugValue(summary, formatRuleStoreDebugValue);

  return {
    snapshot,
    summary,
    setPreset(preset: RulePreset) {
      ruleStore.setPreset(preset);
    },
    toggleFlag(flag: StoreRuleFlag) {
      ruleStore.toggleFlag(flag);
    },
    reset() {
      ruleStore.reset();
    },
  };
}
