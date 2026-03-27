import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

type BadgeProps = PropsWithChildren<{
  tone?: Tone;
}>;

type CardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  tone?: Tone;
}>;

type StatCardProps = {
  label: string;
  value: string | number;
  note?: string;
  tone?: Tone;
};

type TeachingNoteProps = {
  title: string;
  items: string[];
  tone?: Tone;
};

type FieldProps = PropsWithChildren<{
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}>;

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={clsx('badge', `badge--${tone}`)}>{children}</span>;
}

export function InfoCard({ eyebrow, title, tone = 'neutral', children }: CardProps) {
  return (
    <article className={clsx('info-card', `tone-${tone}`)}>
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="card-title">{title}</h3>
      <div className="card-copy">{children}</div>
    </article>
  );
}

export function StatCard({ label, value, note, tone = 'neutral' }: StatCardProps) {
  return (
    <article className={clsx('stat-card', `tone-${tone}`)}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {note ? <p className="stat-note">{note}</p> : null}
    </article>
  );
}

export function TeachingNote({ title, items, tone = 'neutral' }: TeachingNoteProps) {
  return (
    <section className={clsx('teaching-note', `tone-${tone}`)}>
      <h3 className="note-title">{title}</h3>
      <ul className="note-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function Field({ label, htmlFor, hint, error, required, children }: FieldProps) {
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div className="field">
      <div className="field-label-row">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="field-label">
            {label}
          </label>
        ) : (
          <span className="field-label">{label}</span>
        )}
        {required ? <span className="field-required">Обязательно</span> : null}
      </div>
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
