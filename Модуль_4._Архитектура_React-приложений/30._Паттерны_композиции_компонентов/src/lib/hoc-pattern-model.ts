import type { StatusTone } from './learning-model';

export function describeHocScenario(config: {
  consumers: number;
  crossCutting: boolean;
  legacyInterop: boolean;
}): {
  tone: StatusTone;
  statusLabel: string;
  note: string;
  modernAlternative: string;
} {
  if (config.legacyInterop && config.crossCutting) {
    return {
      tone: 'success',
      statusLabel: 'HOC still fits',
      note: 'Есть legacy wrapper-задача и cross-cutting concern, так что HOC здесь ещё может быть прагматичным.',
      modernAlternative:
        'Если код уже новый, проверьте custom hook или явную композицию с provider/slots.',
    };
  }

  if (config.crossCutting && config.consumers >= 3) {
    return {
      tone: 'warn',
      statusLabel: 'Possible but noisy',
      note: 'HOC решит задачу, но источник injected props и wrapper nesting быстро станут менее прозрачными.',
      modernAlternative:
        'Часто лучше вынести логику в hook и передавать явные props поверх обычной композиции.',
    };
  }

  return {
    tone: 'error',
    statusLabel: 'Over-abstracted',
    note: 'Если задача локальна или логика нужна только одному feature-блоку, HOC добавляет лишний слой без архитектурной выгоды.',
    modernAlternative:
      'Оставьте behaviour рядом с компонентом или вынесите его в custom hook.',
  };
}
