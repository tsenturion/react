import type { ReactElement } from 'react';

import { StatusPill } from '../components/ui';
import type { CardViewModel } from './catalog-card-model';

export function buildJsxCatalogCard(viewModel: CardViewModel): ReactElement {
  return (
    <article className={viewModel.rootClassName}>
      <header className="space-y-3">
        {viewModel.badgeLabel ? (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${viewModel.badgeClassName}`}
          >
            {viewModel.badgeLabel}
          </span>
        ) : null}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">{viewModel.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{viewModel.subtitle}</p>
        </div>
      </header>

      <StatusPill tone={viewModel.stockTone}>{viewModel.stockLabel}</StatusPill>

      <ul className="space-y-2 text-sm leading-6 text-slate-700">
        {viewModel.highlights.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>

      <footer className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">{viewModel.priceLine}</p>
          <p className="text-sm leading-6 text-slate-500">{viewModel.priceHint}</p>
        </div>
        <button
          type="button"
          disabled={viewModel.ctaDisabled}
          className={viewModel.buttonClassName}
        >
          {viewModel.ctaLabel}
        </button>
      </footer>
    </article>
  );
}
