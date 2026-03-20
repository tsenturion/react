import type { StatusTone } from './learning-model';

export type ModuleTone = 'teal' | 'amber' | 'slate';

export type CssModulesControls = {
  tone: ModuleTone;
  compact: boolean;
  withRibbon: boolean;
  loudGlobalTitle: boolean;
};

export type CssModulesReport = {
  isolatedRules: number;
  tone: StatusTone;
  summary: string;
  collisionRisk: string;
  snippet: string;
};

export const defaultCssModulesControls: CssModulesControls = {
  tone: 'teal',
  compact: false,
  withRibbon: true,
  loudGlobalTitle: false,
};

export function buildCssModulesReport(controls: CssModulesControls): CssModulesReport {
  return {
    isolatedRules: 4 + (controls.compact ? 1 : 0) + (controls.withRibbon ? 1 : 0),
    tone: controls.loudGlobalTitle ? 'success' : 'warn',
    summary:
      'CSS Modules удобны там, где компоненту нужны локальные классы с обычными именами вроде `.title` и `.note`, но без риска протечь в остальное приложение.',
    collisionRisk: controls.loudGlobalTitle
      ? 'Глобальный `.title` стал агрессивнее, но module-компонент не изменился из-за изоляции.'
      : 'Глобальный стиль пока спокойный, однако generic-классы всё равно остаются общими для всего приложения.',
    snippet: [
      "import styles from './ModulePreviewCard.module.css';",
      '',
      '<article',
      '  className={clsx(',
      '    styles.card,',
      '    styles[tone],',
      '    compact && styles.compact,',
      '  )}',
      '>',
      '  <h3 className={styles.title}>...</h3>',
      '</article>',
    ].join('\n'),
  };
}
