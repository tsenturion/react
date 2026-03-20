import type { StatusTone } from './learning-model';

export type TreeMoveStrategy = 'css-order' | 'tree-move';

export type TreeMoveReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  lifecycle: string;
  snippet: string;
};

export function buildTreeMoveReport(strategy: TreeMoveStrategy): TreeMoveReport {
  if (strategy === 'css-order') {
    return {
      tone: 'success',
      title: 'Визуальное перемещение без remount',
      summary:
        'Если JSX остаётся тем же, а меняется только layout через CSS classes, React видит один и тот же slot.',
      lifecycle:
        'Локальный state и refs сохраняются, потому что поддерево не покидало своё место в React tree.',
      snippet: [
        "<div className={dock === 'left' ? 'lg:order-1' : 'lg:order-2'}>",
        '  <InspectorWidget />',
        '</div>',
      ].join('\n'),
    };
  }

  return {
    tone: 'warn',
    title: 'Перенос поддерева между слотами',
    summary:
      'Когда один и тот же компонент рендерится то слева, то справа разными ветками, React создаёт новый экземпляр в новом slot.',
    lifecycle:
      'Предыдущий экземпляр проходит cleanup, новый монтируется заново, а локальный state начинается с initial value.',
    snippet: [
      "{dock === 'left' ? <InspectorWidget /> : null}",
      "{dock === 'right' ? <InspectorWidget /> : null}",
    ].join('\n'),
  };
}
