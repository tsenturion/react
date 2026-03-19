import type { ReactNode } from 'react';

export type SlotFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
};

export function SlotFrame({
  eyebrow,
  title,
  description,
  children,
  aside,
  footer,
}: SlotFrameProps) {
  // children здесь выступает реальным расширяемым slot:
  // компонент задаёт только каркас, а внутреннее наполнение приходит снаружи.
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-4">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {eyebrow}
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          </header>
          <div className="space-y-4">{children}</div>
          {footer ? (
            <footer className="border-t border-slate-200 pt-4 text-sm leading-6 text-slate-500">
              {footer}
            </footer>
          ) : null}
        </div>
        {aside ? (
          <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {aside}
          </aside>
        ) : null}
      </div>
    </section>
  );
}
