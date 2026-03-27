import { useFormStatus } from 'react-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function FormStatusProbe({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const status = useFormStatus();
  const title = String(status.data?.get('title') ?? '').trim();
  const owner = String(status.data?.get('owner') ?? '').trim();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        useFormStatus snapshot
      </p>
      <p className="mt-3 text-sm font-semibold text-slate-900">
        {status.pending ? pendingLabel : idleLabel}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {status.pending
          ? `Сейчас в action ушли поля title="${title || 'empty'}" и owner="${owner || 'empty'}".`
          : 'Пока submit не начался, статус формы не создаёт лишний локальный state.'}
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
  children: ReactNode;
  pendingLabel: string;
}) {
  const status = useFormStatus();

  return (
    <button {...props} disabled={status.pending || props.disabled} className={className}>
      {status.pending ? pendingLabel : children}
    </button>
  );
}
