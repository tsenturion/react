export type AccessibilityPattern = 'text-button' | 'icon-button' | 'text-input';

export const accessibilityPatterns: AccessibilityPattern[] = [
  'text-button',
  'icon-button',
  'text-input',
];

export const evaluateAccessibilityScenario = ({
  pattern,
  hasVisibleLabel,
  hasAriaLabel,
  addRedundantRole,
  addAriaRequired,
}: {
  pattern: AccessibilityPattern;
  hasVisibleLabel: boolean;
  hasAriaLabel: boolean;
  addRedundantRole: boolean;
  addAriaRequired: boolean;
}) => {
  const role =
    pattern === 'text-input'
      ? 'textbox'
      : pattern === 'icon-button' || pattern === 'text-button'
        ? 'button'
        : 'generic';
  const nameSource =
    pattern === 'text-input'
      ? hasVisibleLabel
        ? 'label element'
        : hasAriaLabel
          ? 'aria-label'
          : 'missing'
      : hasVisibleLabel
        ? hasAriaLabel
          ? 'aria-label overrides visible text'
          : 'visible text'
        : hasAriaLabel
          ? 'aria-label'
          : 'missing';

  const warnings = [
    ...(nameSource === 'missing'
      ? [
          pattern === 'text-input'
            ? 'Text input без label или aria-label теряет понятное имя.'
            : 'Интерактивный элемент без видимого текста или aria-label теряет понятное имя.',
        ]
      : []),
    ...(addRedundantRole ? ['Нативному элементу не нужен повторяющий его `role`.'] : []),
    ...(addAriaRequired && pattern === 'text-input'
      ? [
          'Для нативного required-input обычно достаточно атрибута `required`; `aria-required` избыточен.',
        ]
      : []),
    ...(pattern === 'icon-button' && !hasAriaLabel
      ? [
          'Icon-only button почти всегда требует `aria-label`, потому что видимого текста нет.',
        ]
      : []),
  ];

  const markupPreview =
    pattern === 'text-input'
      ? `${hasVisibleLabel ? '<label for="search">Поиск</label>\n' : ''}<input id="search"${addAriaRequired ? ' aria-required="true"' : ''}${hasAriaLabel ? ' aria-label="Поиск"' : ''} ${addRedundantRole ? 'role="textbox" ' : ''}type="text" />`
      : `<button type="button"${addRedundantRole ? ' role="button"' : ''}${hasAriaLabel ? ' aria-label="Открыть меню"' : ''}>${hasVisibleLabel ? 'Открыть меню' : '<svg aria-hidden="true" />'}</button>`;

  return {
    role,
    nameSource,
    warnings,
    ariaAdvice:
      warnings.length === 0
        ? 'ARIA не требуется сверх нативной семантики.'
        : 'ARIA стоит добавлять только там, где без него не хватает имени или связи.',
    markupPreview,
  };
};
