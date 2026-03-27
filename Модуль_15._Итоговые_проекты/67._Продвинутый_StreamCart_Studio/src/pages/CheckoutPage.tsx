'use client';

import { useActionState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormStatus } from 'react-dom';

import { CartSummaryCard } from '../components/storefront/CartSummaryCard';
import { Panel, StatusPill } from '../components/ui';
import { cartStore, getCartSummary, useCartLines } from '../lib/cart-store';
import {
  initialCheckoutFormState,
  submitCheckoutMutation,
} from '../lib/server-actions-form-model';

const checkoutStatusLabels = {
  idle: 'Ожидает действия',
  saved: 'Черновик сохранён',
  'coupon-applied': 'Промокод применён',
  placed: 'Заказ оформлен',
  error: 'Есть ошибка',
} as const;

function CheckoutButtons() {
  const status = useFormStatus();
  const currentIntent = status.data?.get('intent')?.toString() ?? 'save-cart';

  return (
    <div className="flex flex-wrap gap-3">
      <button type="submit" name="intent" value="save-cart" className="chip">
        {status.pending && currentIntent === 'save-cart'
          ? 'Сохраняем черновик...'
          : 'Сохранить черновик'}
      </button>
      <button type="submit" name="intent" value="apply-coupon" className="chip">
        {status.pending && currentIntent === 'apply-coupon'
          ? 'Применяем промокод...'
          : 'Применить промокод'}
      </button>
      <button
        type="submit"
        name="intent"
        value="place-order"
        className="chip chip-active"
      >
        {status.pending && currentIntent === 'place-order'
          ? 'Оформляем заказ...'
          : 'Оформить заказ'}
      </button>
    </div>
  );
}

export function CheckoutPage() {
  const lines = useCartLines();
  const summary = getCartSummary(lines);
  const [state, formAction, isPending] = useActionState(
    submitCheckoutMutation,
    initialCheckoutFormState,
  );

  useEffect(() => {
    if (state.status === 'placed') {
      cartStore.clear();
    }
  }, [state.status]);

  if (summary.lines.length === 0 && state.status !== 'placed') {
    return (
      <Panel className="space-y-5">
        <span className="soft-label">Оформление недоступно</span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Корзина пуста
        </h1>
        <p className="text-sm leading-7 text-slate-600">
          Добавьте товары перед переходом к оформлению. После успешного размещения заказа
          корзина очищается, чтобы сценарий был похож на реальный магазин.
        </p>
        <Link
          to="/catalog"
          className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Вернуться в каталог
        </Link>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="soft-label">Оформление</span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Доставка, промокод и подтверждение заказа
            </h1>
          </div>
          <StatusPill
            tone={isPending ? 'warn' : state.status === 'error' ? 'error' : 'success'}
          >
            {isPending ? 'Обрабатываем...' : checkoutStatusLabels[state.status]}
          </StatusPill>
        </div>

        <Panel className="space-y-5">
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input
                  name="email"
                  defaultValue="hello@streamcart.dev"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                />
                {state.fieldErrors.email ? (
                  <span className="text-sm text-rose-700">{state.fieldErrors.email}</span>
                ) : null}
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Способ оплаты
                </span>
                <input
                  name="paymentMethod"
                  defaultValue="Банковская карта"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                />
                {state.fieldErrors.paymentMethod ? (
                  <span className="text-sm text-rose-700">
                    {state.fieldErrors.paymentMethod}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Адрес доставки</span>
              <textarea
                name="shippingAddress"
                rows={4}
                defaultValue="Невский проспект, 18, Санкт-Петербург"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />
              {state.fieldErrors.shippingAddress ? (
                <span className="text-sm text-rose-700">
                  {state.fieldErrors.shippingAddress}
                </span>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Промокод</span>
              <input
                name="couponCode"
                defaultValue="SAVE20"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />
              {state.fieldErrors.couponCode ? (
                <span className="text-sm text-rose-700">
                  {state.fieldErrors.couponCode}
                </span>
              ) : null}
            </label>

            <CheckoutButtons />
          </form>
        </Panel>

        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">{state.headline}</h2>
          <p className="text-sm leading-7 text-slate-600">{state.message}</p>
          {state.orderNumber ? (
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-950">
              Заказ подтверждён: <strong>{state.orderNumber}</strong>
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Ход обработки
            </p>
            {state.auditTrail.length > 0 ? (
              state.auditTrail.map((entry) => (
                <div
                  key={entry}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {entry}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                Отправьте форму, чтобы увидеть этапы обработки заказа.
              </div>
            )}
          </div>
        </Panel>
      </section>

      <CartSummaryCard lines={lines} ctaHref="/cart" ctaLabel="Вернуться в корзину" />
    </div>
  );
}
