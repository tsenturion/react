import type { ReactNode } from 'react';

import type { StatusTone } from '../../lib/learning-model';
import { StatusPill } from '../ui';

export type CourseCardProps = {
  title: string;
  trackLabel: string;
  levelLabel: string;
  durationLabel: string;
  summary: string;
  mentorLabel?: string;
  statusLabel: string;
  statusTone: StatusTone;
  highlighted?: boolean;
  compact?: boolean;
  footerNote?: string;
  children?: ReactNode;
};

export function CourseCard({
  title,
  trackLabel,
  levelLabel,
  durationLabel,
  summary,
  mentorLabel,
  statusLabel,
  statusTone,
  highlighted = false,
  compact = false,
  footerNote,
  children,
}: CourseCardProps) {
  // Компонент целиком управляется props:
  // он ничего не "додумывает" о внешнем мире и не мутирует входные данные.
  return (
    <article
      className={`flex h-full flex-col rounded-[28px] border bg-white shadow-sm ${
        highlighted ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200'
      } ${compact ? 'gap-3 p-4' : 'gap-5 p-6'}`}
    >
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span>{trackLabel}</span>
          <span>{levelLabel}</span>
          <span>{durationLabel}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-sm leading-6 text-slate-600">{summary}</p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
        {mentorLabel ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            {mentorLabel}
          </span>
        ) : null}
      </div>

      {children ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm">{children}</div>
      ) : null}

      {footerNote ? (
        <footer className="mt-auto border-t border-slate-200 pt-4 text-sm leading-6 text-slate-500">
          {footerNote}
        </footer>
      ) : null}
    </article>
  );
}
