import type { StatusTone } from './learning-model';

export type PositionBindingReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  consequence: string;
  snippet: string;
};

export function buildPositionBindingReport({
  sameComponentType,
  sameTreeSlot,
  keyChanged,
}: {
  sameComponentType: boolean;
  sameTreeSlot: boolean;
  keyChanged: boolean;
}): PositionBindingReport {
  if (keyChanged) {
    return {
      tone: 'warn',
      title: 'Key меняет identity boundary',
      summary:
        'Даже тот же component type в том же месте будет считаться новым экземпляром, если key изменился.',
      consequence:
        'Локальный state начнёт жизнь заново, потому что React видит уже другое поддерево.',
      snippet: [
        '<EditorCard',
        '  key={activeProfile.id}',
        '  profile={activeProfile}',
        '/>',
      ].join('\n'),
    };
  }

  if (sameComponentType && sameTreeSlot) {
    return {
      tone: 'success',
      title: 'State привязан к позиции',
      summary:
        'React хранит локальный state за тем же component type в том же слоте дерева.',
      consequence:
        'Изменение props или внешнего оформления не сбрасывает локальный state само по себе.',
      snippet: [
        '{activeProfile ? (',
        '  <EditorCard profile={activeProfile} />',
        ') : null}',
      ].join('\n'),
    };
  }

  return {
    tone: 'error',
    title: 'Изменился slot или type',
    summary:
      'Когда компонент переезжает в другой slot дерева или его type меняется, React снимает старое поддерево и монтирует новое.',
    consequence:
      'Локальный state, refs и эффекты прежнего экземпляра больше не сохраняются.',
    snippet: [
      "{dock === 'left' ? <EditorCard /> : null}",
      "{dock === 'right' ? <EditorCard /> : null}",
    ].join('\n'),
  };
}
