export type InteractiveKind = 'button' | 'link' | 'div';
export type TabMode = 'native' | 'zero' | 'minus-one' | 'positive-three';

export const interactiveKinds: InteractiveKind[] = ['button', 'link', 'div'];
export const tabModes: TabMode[] = ['native', 'zero', 'minus-one', 'positive-three'];

export const evaluateFocusScenario = ({
  kind,
  hasHref,
  tabMode,
  addRole,
  addKeyboardSupport,
}: {
  kind: InteractiveKind;
  hasHref: boolean;
  tabMode: TabMode;
  addRole: boolean;
  addKeyboardSupport: boolean;
}) => {
  const nativeFocusable =
    kind === 'button' ||
    (kind === 'link' && hasHref) ||
    (kind === 'div' && tabMode !== 'native');
  const focusableInTabOrder =
    tabMode === 'minus-one'
      ? false
      : kind === 'button'
        ? true
        : kind === 'link'
          ? hasHref || tabMode !== 'native'
          : tabMode !== 'native';
  const keyboardActivation =
    kind === 'button'
      ? 'Enter + Space'
      : kind === 'link'
        ? hasHref
          ? 'Enter'
          : addKeyboardSupport
            ? 'ручная обработка'
            : 'нет встроенной активации'
        : addKeyboardSupport
          ? 'ручная обработка'
          : 'нет встроенной активации';

  const warnings = [
    ...(kind === 'div' && !addRole
      ? ['`div` без role не сообщает интерактивное назначение assistive tech.']
      : []),
    ...(kind === 'div' && !addKeyboardSupport
      ? ['`div` без key handlers не реагирует на Enter/Space как нативный button.']
      : []),
    ...(kind === 'link' && !hasHref
      ? ['`a` без href теряет нативную навигационную семантику и таб-поведение.']
      : []),
    ...(tabMode === 'positive-three'
      ? ['Положительный tabIndex меняет естественный порядок и делает навигацию хрупкой.']
      : []),
    ...(tabMode === 'minus-one'
      ? [
          'tabIndex=-1 убирает элемент из таб-цепочки, но ref.focus() всё ещё может работать.',
        ]
      : []),
  ];

  const markupPreview = `<${kind === 'button' ? 'button type="button"' : kind === 'link' ? `a${hasHref ? ' href="#focus-demo"' : ''}` : `div${addRole ? ' role="button"' : ''}`}${tabMode === 'zero' ? ' tabIndex={0}' : tabMode === 'minus-one' ? ' tabIndex={-1}' : tabMode === 'positive-three' ? ' tabIndex={3}' : ''}>...</${kind === 'button' ? 'button' : kind === 'link' ? 'a' : 'div'}>`;

  return {
    nativeFocusable,
    focusableInTabOrder,
    keyboardActivation,
    warnings,
    markupPreview,
  };
};
