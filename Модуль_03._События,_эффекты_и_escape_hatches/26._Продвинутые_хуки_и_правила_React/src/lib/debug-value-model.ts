import type { StatusTone } from './learning-model';

export type DiagnosticsKey =
  | 'stableOrder'
  | 'pureRender'
  | 'completeDeps'
  | 'safeRefs'
  | 'externalStore';

export const diagnosticsLabels: Record<DiagnosticsKey, string> = {
  stableOrder: 'Порядок hooks стабилен',
  pureRender: 'Рендер остаётся чистым',
  completeDeps: 'Effect dependencies полны',
  safeRefs: 'ref не мутируется в рендере',
  externalStore: 'Внешний store даёт согласованный snapshot',
};

export type DiagnosticsState = Record<DiagnosticsKey, boolean>;

export const defaultDiagnosticsState: DiagnosticsState = {
  stableOrder: true,
  pureRender: true,
  completeDeps: true,
  safeRefs: true,
  externalStore: false,
};

export function buildDiagnosticsSummary(state: DiagnosticsState) {
  const keys = Object.keys(state) as DiagnosticsKey[];
  const passed = keys.filter((key) => state[key]).length;
  const blockers = keys.filter((key) => !state[key]);

  let tone: StatusTone = 'success';
  if (blockers.length >= 2) {
    tone = 'error';
  } else if (blockers.length === 1) {
    tone = 'warn';
  }

  return {
    total: keys.length,
    passed,
    blockers,
    tone,
    headline:
      blockers.length === 0
        ? 'Hook выглядит предсказуемо'
        : blockers.length === 1
          ? 'Есть один критичный сигнал'
          : 'Несколько ограничений уже нарушены',
  };
}

export function formatDiagnosticsDebugValue(
  summary: ReturnType<typeof buildDiagnosticsSummary>,
) {
  return `${summary.passed}/${summary.total} safe • ${summary.blockers.length} blockers`;
}
