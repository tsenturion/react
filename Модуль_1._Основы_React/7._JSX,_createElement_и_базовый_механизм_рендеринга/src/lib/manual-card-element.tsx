import React, { type ReactElement } from 'react';

import type { CardViewModel } from './catalog-card-model';

export function buildManualCatalogCard(viewModel: CardViewModel): ReactElement {
  return React.createElement(
    'article',
    { className: viewModel.rootClassName },
    React.createElement(
      'header',
      { className: 'space-y-3' },
      viewModel.badgeLabel
        ? React.createElement(
            'span',
            {
              className: `inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${viewModel.badgeClassName}`,
            },
            viewModel.badgeLabel,
          )
        : null,
      React.createElement(
        'div',
        { className: 'space-y-2' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold text-slate-900' },
          viewModel.title,
        ),
        React.createElement(
          'p',
          { className: 'text-sm leading-6 text-slate-600' },
          viewModel.subtitle,
        ),
      ),
    ),
    React.createElement(
      'span',
      {
        className:
          viewModel.stockTone === 'success'
            ? 'inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800'
            : viewModel.stockTone === 'warn'
              ? 'inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800'
              : 'inline-flex items-center rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-800',
      },
      viewModel.stockLabel,
    ),
    React.createElement(
      'ul',
      { className: 'space-y-2 text-sm leading-6 text-slate-700' },
      ...viewModel.highlights.map((item) =>
        React.createElement(
          'li',
          { key: item, className: 'rounded-2xl bg-slate-50 px-3 py-2' },
          item,
        ),
      ),
    ),
    React.createElement(
      'footer',
      {
        className:
          'mt-auto flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between',
      },
      React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          { className: 'text-lg font-semibold text-slate-900' },
          viewModel.priceLine,
        ),
        React.createElement(
          'p',
          { className: 'text-sm leading-6 text-slate-500' },
          viewModel.priceHint,
        ),
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          disabled: viewModel.ctaDisabled,
          className: viewModel.buttonClassName,
        },
        viewModel.ctaLabel,
      ),
    ),
  );
}
