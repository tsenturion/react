import { getStyleTheme, type InjectionMode, type StyleThemeId } from './dom-hooks-domain';

export function buildInjectedThemeCss(scopeClass: string, themeId: StyleThemeId) {
  const theme = getStyleTheme(themeId);

  return [
    `.${scopeClass} .theme-shell {`,
    `  background: linear-gradient(145deg, ${theme.surface}, ${theme.card});`,
    `  border: 1px solid ${theme.border};`,
    `  color: ${theme.text};`,
    `  border-radius: 28px;`,
    `  padding: 20px;`,
    `}`,
    `.${scopeClass} .theme-pill {`,
    `  display: inline-flex;`,
    `  align-items: center;`,
    `  border-radius: 9999px;`,
    `  padding: 6px 12px;`,
    `  background: ${theme.accent};`,
    `  color: ${theme.card};`,
    `  font-weight: 700;`,
    `}`,
    `.${scopeClass} .theme-card {`,
    `  margin-top: 14px;`,
    `  border-radius: 20px;`,
    `  background: ${theme.card};`,
    `  border: 1px solid ${theme.border};`,
    `  padding: 16px;`,
    `  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);`,
    `}`,
    `.${scopeClass} .theme-action {`,
    `  margin-top: 14px;`,
    `  border: 0;`,
    `  border-radius: 9999px;`,
    `  background: ${theme.accent};`,
    `  color: ${theme.card};`,
    `  padding: 10px 16px;`,
    `  font-weight: 700;`,
    `}`,
  ].join('\n');
}

export function buildInjectionTimeline(mode: InjectionMode) {
  return mode === 'insertion'
    ? [
        'render',
        'DOM commit',
        'useInsertionEffect injects CSS',
        'layout effects',
        'paint',
      ]
    : ['render', 'DOM commit', 'paint', 'useEffect injects CSS', 'next paint'];
}

export function describeInjectionMode(mode: InjectionMode) {
  if (mode === 'insertion') {
    return {
      title: 'useInsertionEffect',
      summary:
        'Подходит для CSS-in-JS и style injection, когда правила должны оказаться в DOM раньше layout-эффектов.',
      snippet: [
        'useInsertionEffect(() => {',
        '  styleNode.textContent = cssText;',
        '  document.head.append(styleNode);',
        '}, [cssText]);',
      ].join('\n'),
    };
  }

  return {
    title: 'Passive style injection',
    summary:
      'Через useEffect style tag попадёт в DOM позже. Для библиотек стилизации это уже слишком поздно.',
    snippet: [
      'useEffect(() => {',
      '  styleNode.textContent = cssText;',
      '  document.head.append(styleNode);',
      '}, [cssText]);',
    ].join('\n'),
  };
}
