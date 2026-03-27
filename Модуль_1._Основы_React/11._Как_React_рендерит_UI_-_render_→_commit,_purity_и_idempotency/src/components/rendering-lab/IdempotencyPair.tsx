export function IdempotencyPair({ topic }: { topic: string }) {
  const stableLabel = `${topic.toUpperCase()} · ${topic.length} символов`;

  // Случайность в render здесь намеренная:
  // с одинаковым input компонент начинает отдавать разный output и нарушает idempotency.
  // eslint-disable-next-line react-hooks/purity -- учебный контрпример для темы урока
  const unstableLabel = `${topic.toUpperCase()} · ${Math.random().toFixed(4)}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Idempotent
        </p>
        <p className="mt-3 text-lg font-semibold text-slate-900">{stableLabel}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          При тех же props output остаётся тем же.
        </p>
      </article>

      <article className="rounded-[28px] border border-rose-200 bg-rose-50/75 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Non-idempotent
        </p>
        <p className="mt-3 text-lg font-semibold text-slate-900">{unstableLabel}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Те же props, но новый render уже дал другой результат.
        </p>
      </article>
    </div>
  );
}
