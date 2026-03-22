import type { StatusTone } from './learning-model';

export type PuritySignal =
  | 'readsRandomInRender'
  | 'mutatesRefInRender'
  | 'setsStateInRender'
  | 'derivesInRender';

export type PurityState = Record<PuritySignal, boolean>;

export const defaultPurityState: PurityState = {
  readsRandomInRender: false,
  mutatesRefInRender: false,
  setsStateInRender: false,
  derivesInRender: true,
};

export function evaluatePurityState(state: PurityState): {
  tone: StatusTone;
  headline: string;
  issues: string[];
  safeMoves: string[];
} {
  const issues: string[] = [];

  if (state.readsRandomInRender) {
    issues.push('Нестабильное значение рождается прямо в рендере.');
  }

  if (state.mutatesRefInRender) {
    issues.push('ref мутируется во время рендера и создаёт скрытый side effect.');
  }

  if (state.setsStateInRender) {
    issues.push('setState во время рендера ломает чистоту и может вызвать цикл.');
  }

  if (!state.derivesInRender) {
    issues.push('Чистое derived вычисление вынесено из рендера без необходимости.');
  }

  let tone: StatusTone = 'success';
  if (issues.length >= 2) {
    tone = 'error';
  } else if (issues.length === 1) {
    tone = 'warn';
  }

  return {
    tone,
    headline:
      issues.length === 0
        ? 'Компонент остаётся чистой функцией от входных данных'
        : issues.length === 1
          ? 'Есть одно нарушение чистоты'
          : 'Чистота компонента уже потеряна в нескольких местах',
    issues,
    safeMoves: [
      'Чистые derived вычисления держите в рендере.',
      'ref обновляйте в обработчике или effect, а не в теле компонента.',
      'Нестабильные значения создавайте по событию или синхронизируйте effect-ом.',
    ],
  };
}
