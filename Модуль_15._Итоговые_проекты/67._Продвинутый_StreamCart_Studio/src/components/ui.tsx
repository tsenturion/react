import clsx from 'clsx';
import type { ReactNode } from 'react';

import type { StatusTone } from '../lib/learning-model';

export function SectionIntro({
  eyebrow,
  title,
  copy,
  aside,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  aside?: ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="space-y-3">
        <span className="soft-label">{eyebrow}</span>
        <h1 className="section-title">{title}</h1>
        <p className="section-copy">{copy}</p>
      </div>
      {aside ? <div className="panel p-4">{aside}</div> : null}
    </div>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={clsx('panel p-5 sm:p-6', className)}>{children}</section>;
}

export function StatusPill({
  tone,
  children,
}: {
  tone: StatusTone;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        tone === 'success' && 'status-success',
        tone === 'warn' && 'status-warn',
        tone === 'error' && 'status-error',
      )}
    >
      {children}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint: string;
  tone?: 'default' | 'accent' | 'cool' | 'dark';
}) {
  return (
    <div
      className={clsx(
        'rounded-[24px] border p-4',
        tone === 'default' && 'border-black/10 bg-white/75',
        tone === 'accent' && 'border-orange-300/60 bg-orange-100/70',
        tone === 'cool' && 'border-teal-300/60 bg-teal-100/70',
        tone === 'dark' && 'border-slate-800 bg-slate-950 text-white',
      )}
    >
      <p
        className={clsx(
          'text-xs font-semibold uppercase tracking-[0.18em] leading-5 break-words',
          tone === 'dark' ? 'text-slate-300' : 'text-slate-500',
        )}
      >
        {label}
      </p>
      <p
        className={clsx(
          'mt-2 break-words font-bold tracking-tight',
          tone === 'dark' && 'text-white',
          value.length > 42
            ? 'text-base leading-7 sm:text-lg'
            : value.length > 18
              ? 'text-xl sm:text-2xl'
              : 'text-3xl',
        )}
      >
        {value}
      </p>
      <p
        className={clsx(
          'mt-2 text-sm leading-6',
          tone === 'dark' ? 'text-slate-300' : 'text-slate-600',
        )}
      >
        {hint}
      </p>
    </div>
  );
}

export function ListBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </h3>
      <ul className="space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-black/8 bg-white/65 px-4 py-3"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="panel-dark p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
          streamcart
        </span>
      </div>
      <pre className="overflow-x-auto text-sm leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ProjectStudy({
  files,
  snippets,
}: {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-slate-600">
        Ниже идут файлы и фрагменты именно текущего проекта. Здесь видно не только UI, но
        и то, как архитектурные решения выражены в коде и runtime-моделях.
      </p>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Файлы проекта для изучения
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {files.map((item) => (
            <div
              key={item.path}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <code className="text-xs font-semibold text-blue-700 break-all">
                {item.path}
              </code>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Листинг из проекта
        </h3>
        <div className="grid gap-4 xl:grid-cols-2">
          {snippets.map((snippet) => (
            <div key={snippet.label} className="space-y-3">
              <CodeBlock label={snippet.label} code={snippet.code} />
              <p className="text-sm leading-6 text-slate-600">{snippet.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
