import type { StatusTone } from './learning-model';

export function inspectChildContract(mode: 'direct' | 'wrapped' | 'mixed'): {
  tone: StatusTone;
  directChildSafety: 'stable' | 'fragile' | 'broken';
  summary: string;
  warning: string;
} {
  if (mode === 'direct') {
    return {
      tone: 'success',
      directChildSafety: 'stable',
      summary:
        'Паттерн работает, потому что все элементы лежат прямо под root и готовы принять injected props.',
      warning:
        'Даже здесь контракт остаётся неявным: consumer должен знать, какие children считаются допустимыми.',
    };
  }

  if (mode === 'wrapped') {
    return {
      tone: 'warn',
      directChildSafety: 'fragile',
      summary:
        'Один wrapper уже ломает ожидание, что root увидит и изменит нужного ребёнка напрямую.',
      warning:
        'cloneElement не проходит сквозь произвольные обёртки и создаёт скрытую структурную зависимость.',
    };
  }

  return {
    tone: 'error',
    directChildSafety: 'broken',
    summary:
      'Смесь wrapper-узлов и постороннего контента превращает API в хрупкую систему скрытых правил.',
    warning:
      'Здесь лучше перейти к explicit slots, config arrays или compound components.',
  };
}
