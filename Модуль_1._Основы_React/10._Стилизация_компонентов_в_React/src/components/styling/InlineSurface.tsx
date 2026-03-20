import type { CSSProperties } from 'react';

import type { InlineControls } from '../../lib/inline-style-model';

export function InlineSurface({ controls }: { controls: InlineControls }) {
  const surfaceStyle: CSSProperties = {
    borderRadius: `${controls.radius}px`,
    background: `linear-gradient(135deg, hsl(${controls.hue} 90% 97%), white)`,
    boxShadow: `0 18px ${18 + controls.glow}px hsl(${controls.hue} 70% 42% / 0.24)`,
  };

  // Inline styles полезны именно здесь: оттенок, радиус и длина индикатора
  // вычисляются из числовых значений в рантайме, а не выбираются из конечного списка классов.
  const barStyle: CSSProperties = {
    width: `${controls.progress}%`,
    background: `linear-gradient(90deg, hsl(${controls.hue} 82% 44%), hsl(${controls.hue + 28} 88% 52%))`,
    borderRadius: `${Math.max(12, controls.radius - 10)}px`,
  };

  return (
    <article
      className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
      style={surfaceStyle}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Inline styles
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Живой индикатор доставки
          </h3>
        </div>
        <span
          className="rounded-full px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: `hsl(${controls.hue} 72% 40%)` }}
        >
          {controls.progress}%
        </span>
      </div>

      <div className="mt-5 h-4 rounded-full bg-white/85 p-1">
        <div className="h-full transition-all duration-300" style={barStyle} />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">
        Когда значения приходят со слайдеров и вычисляются на лету, `style={'{...}'}`
        читается проще, чем генерация десятков одноразовых классов.
      </p>
    </article>
  );
}
