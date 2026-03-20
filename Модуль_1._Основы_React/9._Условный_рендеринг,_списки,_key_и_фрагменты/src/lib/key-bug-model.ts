import type { KeyStrategy } from './reconciliation-model';
import type { StatusTone } from './learning-model';

export type BugAction = 'reverse' | 'filter-first' | 'prepend';

export type KeyBugReport = {
  tone: StatusTone;
  title: string;
  note: string;
};

export function buildKeyBugReport(
  strategy: KeyStrategy,
  action: BugAction,
): KeyBugReport {
  if (strategy === 'stable-id') {
    return {
      tone: 'success',
      title: 'Состояние остаётся привязано к данным',
      note: 'Даже после изменения порядка или фильтрации локальное состояние item-компонента остаётся у того же элемента.',
    };
  }

  if (strategy === 'index') {
    return {
      tone: 'warn',
      title:
        action === 'filter-first'
          ? 'Состояние сместилось вместе с позицией'
          : 'Состояние приклеилось к слоту, а не к сущности',
      note:
        action === 'filter-first'
          ? 'После скрытия первого элемента все индексы сдвинулись, и React переиспользовал компоненты не для тех данных.'
          : 'Индекс повторно использовал старые экземпляры компонентов для новых данных в тех же позициях.',
    };
  }

  return {
    tone: 'error',
    title: 'Элементы монтируются заново',
    note: 'Случайный ключ мешает reuse полностью: локальное состояние сбрасывается и появляются визуальные артефакты.',
  };
}
