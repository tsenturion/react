import type { DiscountState } from './shared-state-domain';
import type { StatusTone } from './learning-model';

export type LiftingReport = {
  tone: StatusTone;
  grossLabel: string;
  netLabel: string;
  summary: string;
  snippet: string;
};

export function calculateNetPrice(state: DiscountState) {
  return Math.round(state.grossPrice * (1 - state.discountPercent / 100));
}

export function calculatePercentFromNet(grossPrice: number, netPrice: number) {
  if (grossPrice <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((1 - netPrice / grossPrice) * 100)));
}

export function updateNetPrice(
  state: DiscountState,
  nextNetPrice: number,
): DiscountState {
  return {
    ...state,
    discountPercent: calculatePercentFromNet(state.grossPrice, nextNetPrice),
  };
}

export function buildLiftingReport(state: DiscountState): LiftingReport {
  return {
    tone: 'success',
    grossLabel: `${state.grossPrice}`,
    netLabel: `${calculateNetPrice(state)}`,
    summary:
      'Оба поля работают с одним shared source of truth в родителе. Изменение одного инпута сразу переводит второй и summary в новое согласованное состояние.',
    snippet: [
      'const [discount, setDiscount] = useState(createDiscountState);',
      '',
      '<PercentField value={discount.discountPercent} onChange={...} />',
      '<NetField value={calculateNetPrice(discount)} onChange={...} />',
    ].join('\n'),
  };
}
