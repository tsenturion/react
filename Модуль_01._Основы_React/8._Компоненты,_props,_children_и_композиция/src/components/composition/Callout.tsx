import type { ReactNode } from 'react';

type Tone = 'info' | 'success' | 'warning' | 'danger';
type Density = 'comfortable' | 'compact';
type Align = 'start' | 'center';
type Border = 'soft' | 'strong';

export type CalloutProps = {
  title: string;
  tone: Tone;
  density: Density;
  align: Align;
  border: Border;
  children: ReactNode;
};

const toneClass: Record<Tone, string> = {
  info: 'bg-blue-50 text-blue-900 border-blue-200',
  success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  warning: 'bg-amber-50 text-amber-900 border-amber-200',
  danger: 'bg-rose-50 text-rose-900 border-rose-200',
};

export function Callout({ title, tone, density, align, border, children }: CalloutProps) {
  return (
    <section
      className={`rounded-[24px] border ${
        toneClass[tone]
      } ${density === 'compact' ? 'p-4' : 'p-6'} ${align === 'center' ? 'text-center' : 'text-left'} ${
        border === 'strong' ? 'ring-2 ring-current/10' : ''
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 text-sm leading-6">{children}</div>
    </section>
  );
}
