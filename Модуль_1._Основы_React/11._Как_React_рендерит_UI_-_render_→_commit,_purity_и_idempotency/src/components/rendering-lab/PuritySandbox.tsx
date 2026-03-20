import { useMemo } from 'react';

const impureRegistry: string[] = [];

export function resetImpureRegistry() {
  impureRegistry.length = 0;
}

function PureCard({
  topic,
  showBadge,
}: {
  topic: string;
  showBadge: boolean;
}) {
  const labels = showBadge ? ['pure', topic] : [topic];

  return (
    <article className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Pure component
      </p>
      <p className="mt-3 text-lg font-semibold text-slate-900">{topic}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-emerald-100 px-3 py-2 text-sm text-emerald-900"
          >
            {label}
          </span>
        ))}
      </div>
    </article>
  );
}

function ImpureCard({
  topic,
  pulse,
}: {
  topic: string;
  pulse: number;
}) {
  // Эта мутация намеренно встроена в учебный sandbox.
  // Она показывает, как render перестаёт быть чистым, если трогает внешнее mutable состояние.
  const registryLength = useMemo(() => {
    impureRegistry.push(topic);
    return impureRegistry.length;
  }, [pulse, topic]);

  return (
    <article className="rounded-[28px] border border-rose-200 bg-rose-50/75 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
        Impure component
      </p>
      <p className="mt-3 text-lg font-semibold text-slate-900">{topic}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Внешний registry уже содержит {registryLength} записей.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {impureRegistry.slice(-4).map((label, index) => (
          <span
            key={`${label}-${index}`}
            className="rounded-full bg-rose-100 px-3 py-2 text-sm text-rose-900"
          >
            {label}
          </span>
        ))}
      </div>
    </article>
  );
}

export function PuritySandbox({
  topic,
  showBadge,
  pulse,
}: {
  topic: string;
  showBadge: boolean;
  pulse: number;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PureCard topic={topic} showBadge={showBadge} />
      <ImpureCard topic={topic} pulse={pulse} />
    </div>
  );
}
