import type { PricingLine } from './state-architecture-domain';
import type { StatusTone } from './learning-model';

export type PricingSummary = {
  lineCount: number;
  subtotal: number;
};

export type BadPricingState = {
  lines: PricingLine[];
  storedLineCount: number;
  storedSubtotal: number;
};

export type DerivedStateReport = {
  tone: StatusTone;
  mismatch: boolean;
  summary: string;
  snippet: string;
};

export function calculatePricingSummary(lines: PricingLine[]): PricingSummary {
  return {
    lineCount: lines.reduce((sum, line) => sum + line.qty, 0),
    subtotal: lines.reduce((sum, line) => sum + line.qty * line.price, 0),
  };
}

export function createBadPricingState(lines: PricingLine[]): BadPricingState {
  const summary = calculatePricingSummary(lines);

  return {
    lines,
    storedLineCount: summary.lineCount,
    storedSubtotal: summary.subtotal,
  };
}

export function incrementLineQty(lines: PricingLine[], lineId: string): PricingLine[] {
  return lines.map((line) =>
    line.id === lineId ? { ...line, qty: line.qty + 1 } : line,
  );
}

export function incrementBadPricingWithoutSync(
  state: BadPricingState,
  lineId: string,
): BadPricingState {
  return {
    ...state,
    lines: incrementLineQty(state.lines, lineId),
  };
}

export function syncBadPricingState(state: BadPricingState): BadPricingState {
  const summary = calculatePricingSummary(state.lines);

  return {
    ...state,
    storedLineCount: summary.lineCount,
    storedSubtotal: summary.subtotal,
  };
}

export function buildDerivedStateReport(state: BadPricingState): DerivedStateReport {
  const actual = calculatePricingSummary(state.lines);
  const mismatch =
    actual.lineCount !== state.storedLineCount ||
    actual.subtotal !== state.storedSubtotal;

  return {
    tone: mismatch ? 'error' : 'success',
    mismatch,
    summary: mismatch
      ? 'storedSubtotal и storedLineCount уже расходятся с lines. Это и есть цена лишнего derived state: каждое действие нужно синхронизировать вручную.'
      : 'Когда итог вычисляется из lines прямо в рендере, отдельный subtotal не нужен и не может устареть.',
    snippet: [
      'const summary = useMemo(() => calculatePricingSummary(lines), [lines]);',
      '',
      'return (',
      '  <p>{summary.subtotal}</p>',
      ');',
    ].join('\n'),
  };
}
