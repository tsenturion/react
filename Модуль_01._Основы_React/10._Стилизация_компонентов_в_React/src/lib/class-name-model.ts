import type { StatusTone } from './learning-model';

export type AccentTone = 'ocean' | 'amber' | 'forest';
export type CardDensity = 'comfortable' | 'compact';
export type CardEmphasis = 'soft' | 'strong';

export type ClassNameControls = {
  accent: AccentTone;
  density: CardDensity;
  emphasis: CardEmphasis;
  outlined: boolean;
  showMeta: boolean;
};

export type ClassNameViewModel = {
  modifierCount: number;
  tone: StatusTone;
  summary: string;
  activeModifiers: string[];
  snippet: string;
};

export const defaultClassNameControls: ClassNameControls = {
  accent: 'ocean',
  density: 'comfortable',
  emphasis: 'soft',
  outlined: false,
  showMeta: true,
};

export function buildClassNameViewModel(controls: ClassNameControls): ClassNameViewModel {
  const activeModifiers = [
    `marketing-card--${controls.accent}`,
    `marketing-card--${controls.density}`,
    `marketing-card--${controls.emphasis}`,
    controls.outlined ? 'marketing-card--outlined' : null,
  ].filter((item): item is string => item !== null);

  return {
    modifierCount: activeModifiers.length,
    tone: controls.outlined || controls.emphasis === 'strong' ? 'success' : 'warn',
    summary:
      'Обычный CSS-файл хорошо работает, когда внешний вид можно выразить через понятные модификаторы `className`, а стили удобно держать рядом с компонентом или рядом с feature-областью.',
    activeModifiers,
    snippet: [
      'className={clsx(',
      "  'marketing-card',",
      '  `marketing-card--${accent}`,',
      '  `marketing-card--${density}`,',
      '  `marketing-card--${emphasis}`,',
      '  outlined && "marketing-card--outlined",',
      ')}',
    ].join('\n'),
  };
}
