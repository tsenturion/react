import type { ConditionalViewModel } from '../../lib/conditional-model';
import { StatusPill } from '../ui';

export function ConditionalLessonPanel({
  viewModel,
}: {
  viewModel: ConditionalViewModel;
}) {
  if (viewModel.visibleBlocks.length === 1 && viewModel.visibleBlocks[0] === 'skeleton') {
    return (
      <section className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Загрузка
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {viewModel.loadingMessage}
        </p>
      </section>
    );
  }

  return (
    <article className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <header className="space-y-3">
        <h3 className="text-2xl font-semibold text-slate-900">{viewModel.title}</h3>
        {viewModel.reviewLabel ? (
          <StatusPill tone="success">{viewModel.reviewLabel}</StatusPill>
        ) : null}
      </header>

      <StatusPill tone={viewModel.seatTone}>{viewModel.seatLabel}</StatusPill>

      {viewModel.mentorLabel ? (
        <p className="text-sm leading-6 text-slate-600">{viewModel.mentorLabel}</p>
      ) : null}

      {viewModel.archiveLabel ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {viewModel.archiveLabel}
        </p>
      ) : null}
    </article>
  );
}
