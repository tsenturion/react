import type { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

import { StatusPill } from '../ui';

export function FormStatusProbe({
  idleLabel,
  pendingLabel,
  fieldName = 'title',
  emptyValue = '—',
}: {
  idleLabel: string;
  pendingLabel: string;
  fieldName?: string;
  emptyValue?: string;
}) {
  const status = useFormStatus();
  const fieldValue = String(status.data?.get(fieldName) ?? '').trim();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">
          {status.pending ? pendingLabel : idleLabel}
        </p>
        <StatusPill tone={status.pending ? 'warn' : 'success'}>
          {status.pending ? 'pending' : 'idle'}
        </StatusPill>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Snapshot поля <code>{fieldName}</code>: {fieldValue || emptyValue}
      </p>
    </div>
  );
}

export function PendingSubmitButton({
  children,
  pendingLabel,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel: string;
}) {
  const status = useFormStatus();

  return (
    <button {...props} disabled={status.pending || props.disabled} className={className}>
      {status.pending ? pendingLabel : children}
    </button>
  );
}
