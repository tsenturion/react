import clsx from 'clsx';
import type { ReactNode } from 'react';

import type { CompositionLayout } from '../../lib/data-composition-model';

type WorkbenchLayoutProps = {
  layoutMode: CompositionLayout;
  header: ReactNode;
  toolbar: ReactNode;
  summary?: ReactNode;
  main: ReactNode;
  aside?: ReactNode;
};

// Явные slot-like props помогают показать композицию прямо в коде текущего урока:
// экран собирается не одной жёсткой разметкой, а из независимых частей.
export function WorkbenchLayout({
  layoutMode,
  header,
  toolbar,
  summary,
  main,
  aside,
}: WorkbenchLayoutProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        {header}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        {toolbar}
      </div>

      {summary ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          {summary}
        </div>
      ) : null}

      <div
        className={clsx(
          'grid gap-4',
          layoutMode === 'split' ? 'xl:grid-cols-[minmax(0,1fr)_280px]' : '',
        )}
      >
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          {main}
        </div>

        {aside ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
