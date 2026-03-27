import { Link } from 'react-router-dom';

import type { CartLine } from '../../lib/cart-store';
import { getCartSummary } from '../../lib/cart-store';
import { Panel, StatusPill } from '../ui';

export function CartSummaryCard({
  lines,
  ctaHref = '/checkout',
  ctaLabel = 'Перейти к оформлению',
}: {
  lines: readonly CartLine[];
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const summary = getCartSummary(lines);

  return (
    <Panel className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">Сводка по заказу</h3>
        <StatusPill tone={summary.shipping === 0 ? 'success' : 'warn'}>
          {summary.shipping === 0 ? 'Бесплатная доставка' : 'Доставка добавлена'}
        </StatusPill>
      </div>

      <div className="space-y-3 text-sm leading-6 text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <span>Товары</span>
          <span>{summary.itemCount}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Подытог</span>
          <span>{summary.formattedSubtotal}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Доставка</span>
          <span>{summary.formattedShipping}</span>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-900">Итого</span>
          <span className="text-xl font-bold text-slate-950">
            {summary.formattedTotal}
          </span>
        </div>
      </div>

      <Link
        to={ctaHref}
        className="inline-flex w-full items-center justify-center rounded-full bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
      >
        {ctaLabel}
      </Link>
    </Panel>
  );
}
