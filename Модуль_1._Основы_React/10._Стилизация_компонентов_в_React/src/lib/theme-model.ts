import type { StatusTone } from './learning-model';

export type ThemeName = 'paper' | 'graphite' | 'signal';
export type ThemeDensity = 'comfortable' | 'compact';

export type ThemeControls = {
  theme: ThemeName;
  density: ThemeDensity;
  elevated: boolean;
};

export type ThemeToken = {
  name: string;
  value: string;
};

export type ThemeReport = {
  tokenCount: number;
  tone: StatusTone;
  summary: string;
  tokens: readonly ThemeToken[];
  snippet: string;
};

export const defaultThemeControls: ThemeControls = {
  theme: 'paper',
  density: 'comfortable',
  elevated: true,
};

const tokenMap: Record<ThemeName, readonly ThemeToken[]> = {
  paper: [
    { name: '--stage-bg', value: '#fffaf2' },
    { name: '--stage-surface', value: '#ffffff' },
    { name: '--stage-text', value: '#1f2937' },
    { name: '--stage-accent', value: '#c2410c' },
  ],
  graphite: [
    { name: '--stage-bg', value: '#0f172a' },
    { name: '--stage-surface', value: '#111827' },
    { name: '--stage-text', value: '#f8fafc' },
    { name: '--stage-accent', value: '#38bdf8' },
  ],
  signal: [
    { name: '--stage-bg', value: '#f0fdf4' },
    { name: '--stage-surface', value: '#ecfeff' },
    { name: '--stage-text', value: '#082f49' },
    { name: '--stage-accent', value: '#0f766e' },
  ],
};

export function buildThemeReport(controls: ThemeControls): ThemeReport {
  return {
    tokenCount: tokenMap[controls.theme].length,
    tone: controls.elevated ? 'success' : 'warn',
    summary:
      'Темизация становится масштабируемой, когда компоненты читают не конкретные цвета, а CSS variables. Тогда одно и то же дерево компонентов можно перевести в другую тему без переписывания JSX.',
    tokens: tokenMap[controls.theme],
    snippet: [
      '<section className="theme-stage"',
      '  data-theme={theme}',
      '  data-density={density}',
      '  data-elevated={elevated}',
      '>',
      '  ...',
      '</section>',
    ].join('\n'),
  };
}
