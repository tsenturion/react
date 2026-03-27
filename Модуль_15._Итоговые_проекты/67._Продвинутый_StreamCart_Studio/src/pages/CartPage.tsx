'use client';

import { Link } from 'react-router-dom';

import { CartSummaryCard } from '../components/storefront/CartSummaryCard';
import { Panel, StatusPill } from '../components/ui';
import { cartStore, getCartSummary, useCartLines } from '../lib/cart-store';
import { formatCurrency } from '../lib/store-data';

export function CartPage() {
  const lines = useCartLines();
  const summary = getCartSummary(lines);

  if (summary.lines.length === 0) {
    return (
      <Panel className="space-y-5">
        <span className="soft-label">Корзина пуста</span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Начните с товаров на витрине
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Перейдите в каталог, откройте нужный товар и добавьте подходящий вариант.
          Корзина сохраняется локально, поэтому между маршрутами можно перемещаться как в
          настоящем магазине.
        </p>
        <Link
          to="/catalog"
          className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Перейти в каталог
        </Link>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div>
          <span className="soft-label">Корзина</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Проверьте заказ перед оформлением
          </h1>
        </div>

        <div className="space-y-3">
          {summary.lines.map((line) => (
            <Panel key={line.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    {line.product.title}
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    {line.color} / {line.size}
                  </p>
                </div>
                <StatusPill tone="success">
                  {formatCurrency(line.product.price)}
                </StatusPill>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  Количество
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={line.quantity}
                    onChange={(event) =>
                      cartStore.updateQuantity(line.id, Number(event.target.value))
                    }
                    className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2"
                  />
                </label>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(line.lineTotal)}
                  </span>
                  <button
                    type="button"
                    onClick={() => cartStore.removeLine(line.id)}
                    className="text-sm font-semibold text-rose-700"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <CartSummaryCard lines={lines} />
    </div>
  );
}
