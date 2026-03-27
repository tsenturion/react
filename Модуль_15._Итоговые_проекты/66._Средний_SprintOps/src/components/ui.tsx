import clsx from 'clsx';
import type { ReactNode } from 'react';

import {
  priorityLabels,
  priorityTone,
  statusLabels,
  statusTone,
} from '../lib/incidents-domain';
import type { IncidentPriority, IncidentStatus } from '../lib/types';

export function PageIntro(props: {
  eyebrow: string;
  title: string;
  copy: string;
  actions?: ReactNode;
}) {
  return (
    <section className="page-intro">
      <div>
        <p className="eyebrow">{props.eyebrow}</p>
        <h1>{props.title}</h1>
        <p className="page-copy">{props.copy}</p>
      </div>
      {props.actions ? <div className="page-intro__actions">{props.actions}</div> : null}
    </section>
  );
}

export function SectionCard(props: {
  title: string;
  kicker?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx('panel-card', props.className)}>
      <header className="panel-card__header">
        <div>
          {props.kicker ? <p className="panel-kicker">{props.kicker}</p> : null}
          <h2>{props.title}</h2>
        </div>
        {props.action ? <div>{props.action}</div> : null}
      </header>
      {props.children}
    </section>
  );
}

export function MetricCard(props: {
  label: string;
  value: string | number;
  hint: string;
  tone?: 'blue' | 'amber' | 'green' | 'rose' | 'slate';
}) {
  return (
    <article
      className={clsx('metric-card', props.tone ? `metric-card--${props.tone}` : null)}
    >
      <p className="metric-card__label">{props.label}</p>
      <strong className="metric-card__value">{props.value}</strong>
      <p className="metric-card__hint">{props.hint}</p>
    </article>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  return <ToneBadge tone={statusTone[status]}>{statusLabels[status]}</ToneBadge>;
}

export function PriorityBadge({ priority }: { priority: IncidentPriority }) {
  return <ToneBadge tone={priorityTone[priority]}>{priorityLabels[priority]}</ToneBadge>;
}

export function ToneBadge(props: {
  tone: 'slate' | 'blue' | 'amber' | 'green' | 'rose';
  children: ReactNode;
}) {
  return (
    <span className={clsx('tone-badge', `tone-badge--${props.tone}`)}>
      {props.children}
    </span>
  );
}

export function InlineErrorState(props: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <div>
        <h3>{props.title}</h3>
        <p>{props.message}</p>
      </div>
      {props.onAction ? (
        <button
          type="button"
          className="button button--secondary"
          onClick={props.onAction}
        >
          {props.actionLabel ?? 'Повторить'}
        </button>
      ) : null}
    </div>
  );
}

export function LoadingRows({ count = 3 }: { count?: number }) {
  return (
    <div className="loading-stack" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="loading-row" />
      ))}
    </div>
  );
}

export function EmptyState(props: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h3>{props.title}</h3>
      <p>{props.message}</p>
      {props.action}
    </div>
  );
}
