import { useDebugValue, useState } from 'react';

import {
  buildDiagnosticsSummary,
  defaultDiagnosticsState,
  formatDiagnosticsDebugValue,
  type DiagnosticsKey,
} from '../lib/debug-value-model';

export function useRuleDiagnostics() {
  const [state, setState] = useState(defaultDiagnosticsState);
  const summary = buildDiagnosticsSummary(state);

  // В DevTools custom hook будет виден не как сырой объект,
  // а как короткая итоговая сводка, удобная для быстрой диагностики.
  useDebugValue(summary, formatDiagnosticsDebugValue);

  return {
    state,
    summary,
    toggleCheck(key: DiagnosticsKey) {
      setState((current) => ({ ...current, [key]: !current[key] }));
    },
    reset() {
      setState(defaultDiagnosticsState);
    },
  };
}
