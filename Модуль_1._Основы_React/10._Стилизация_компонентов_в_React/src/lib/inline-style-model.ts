import type { StatusTone } from './learning-model';

export type InlineControls = {
  hue: number;
  radius: number;
  progress: number;
  glow: number;
};

export type InlineStyleReport = {
  stylePropertyCount: number;
  tone: StatusTone;
  summary: string;
  accentLabel: string;
  snippet: string;
};

export const defaultInlineControls: InlineControls = {
  hue: 208,
  radius: 24,
  progress: 62,
  glow: 32,
};

function describeHue(hue: number) {
  if (hue < 60) return 'тёплый спектр';
  if (hue < 180) return 'зелёный спектр';
  if (hue < 280) return 'холодный спектр';
  return 'магентный спектр';
}

export function buildInlineStyleReport(controls: InlineControls): InlineStyleReport {
  return {
    stylePropertyCount: 6,
    tone: controls.glow > 46 ? 'warn' : 'success',
    summary:
      'Inline styles особенно полезны, когда значения вычисляются в рантайме: числовой прогресс, динамический `hsl(...)`, радиус, transform или позиция. Они плохо подходят для `:hover`, media queries и больших наборов вариантных правил.',
    accentLabel: describeHue(controls.hue),
    snippet: [
      'const surfaceStyle = {',
      '  borderRadius: `${radius}px`,',
      '  background: `linear-gradient(135deg, hsl(${hue} 88% 96%), white)`,',
      '  boxShadow: `0 18px ${18 + glow}px hsl(${hue} 75% 42% / 0.22)`,',
      '};',
      '',
      '<article className="..." style={surfaceStyle}>...</article>',
    ].join('\n'),
  };
}
