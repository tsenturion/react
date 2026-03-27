import type { ReactNode } from 'react';

export type BooleanSoupCalloutProps = {
  title: string;
  isInfo: boolean;
  isSuccess: boolean;
  isWarning: boolean;
  isDanger: boolean;
  dense: boolean;
  centered: boolean;
  withBorder: boolean;
  children: ReactNode;
};

function resolveToneClass(props: BooleanSoupCalloutProps) {
  if (props.isDanger) return 'bg-rose-50 text-rose-900 border-rose-200';
  if (props.isWarning) return 'bg-amber-50 text-amber-900 border-amber-200';
  if (props.isSuccess) return 'bg-emerald-50 text-emerald-900 border-emerald-200';
  return 'bg-blue-50 text-blue-900 border-blue-200';
}

export function BooleanSoupCallout(props: BooleanSoupCalloutProps) {
  return (
    <section
      className={`rounded-[24px] border ${resolveToneClass(props)} ${
        props.dense ? 'p-4' : 'p-6'
      } ${props.centered ? 'text-center' : 'text-left'} ${
        props.withBorder ? 'ring-2 ring-current/10' : ''
      }`}
    >
      <h3 className="text-lg font-semibold">{props.title}</h3>
      <div className="mt-3 text-sm leading-6">{props.children}</div>
    </section>
  );
}
