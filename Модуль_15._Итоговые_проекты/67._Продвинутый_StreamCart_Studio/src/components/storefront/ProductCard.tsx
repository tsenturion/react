import { Link } from 'react-router-dom';

import type { Product } from '../../lib/store-data';
import { departmentLabels, formatCurrency } from '../../lib/store-data';
import { StatusPill } from '../ui';

function toneClass(tone: Product['heroTone']) {
  if (tone === 'forest') {
    return 'from-emerald-200 via-emerald-50 to-white';
  }

  if (tone === 'mist') {
    return 'from-sky-200 via-slate-50 to-white';
  }

  return 'from-orange-200 via-orange-50 to-white';
}

export function ProductCard({
  product,
  priorityLabel,
}: {
  product: Product;
  priorityLabel?: string;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-sm">
      <div className={`bg-gradient-to-br ${toneClass(product.heroTone)} p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              {departmentLabels[product.department]}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">{product.title}</h3>
          </div>
          {product.badge ? <StatusPill tone="success">{product.badge}</StatusPill> : null}
        </div>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-700">
          {product.subtitle}
        </p>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-950">
              {formatCurrency(product.price)}
            </p>
            {product.compareAtPrice ? (
              <p className="text-sm text-slate-500 line-through">
                {formatCurrency(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <div className="text-right text-sm leading-6 text-slate-600">
            <p>Рейтинг {product.rating.toFixed(1)}</p>
            <p>{product.reviewCount} отзывов</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          {product.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          {priorityLabel ? (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              {priorityLabel}
            </span>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {product.story}
            </span>
          )}
          <Link
            to={`/product/${product.slug}`}
            className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Открыть товар
          </Link>
        </div>
      </div>
    </article>
  );
}
