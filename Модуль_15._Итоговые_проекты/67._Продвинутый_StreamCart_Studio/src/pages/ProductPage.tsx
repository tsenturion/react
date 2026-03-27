'use client';

import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { ProductCard } from '../components/storefront/ProductCard';
import { MetricCard, Panel, StatusPill } from '../components/ui';
import { cartStore } from '../lib/cart-store';
import {
  departmentLabels,
  formatCurrency,
  getProductBySlug,
  getRecommendedProducts,
  type Product,
} from '../lib/store-data';

function ProductDetails({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<'idle' | 'added'>('idle');

  const selectedVariant =
    product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];
  const recommendations = getRecommendedProducts(product);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {departmentLabels[product.department]}
              </span>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                {product.description}
              </p>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              <MetricCard
                label="Цена"
                value={formatCurrency(product.price)}
                hint={
                  product.compareAtPrice
                    ? `Старая цена: ${formatCurrency(product.compareAtPrice)}`
                    : 'Текущая розничная цена'
                }
                tone="accent"
              />
              <MetricCard
                label="Рейтинг"
                value={product.rating.toFixed(1)}
                hint={`${product.reviewCount} подтверждённых отзывов`}
                tone="cool"
              />
              <MetricCard
                label="В наличии"
                value={`${selectedVariant.inventory}`}
                hint="Актуальный остаток для выбранного варианта."
                tone="dark"
              />
            </div>
          </div>

          <Panel className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">История товара</h2>
            <p className="text-sm leading-7 text-slate-600">{product.story}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Особенности</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Материалы</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {product.materials.map((material) => (
                    <li
                      key={material}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Выберите вариант</p>
                <p className="text-sm leading-6 text-slate-600">
                  Выберите цвет, размер и количество перед добавлением в корзину.
                </p>
              </div>
              {product.badge ? (
                <StatusPill tone="success">{product.badge}</StatusPill>
              ) : null}
            </div>

            <div className="space-y-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setVariantId(variant.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                    selectedVariant.id === variant.id
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      {variant.color} / {variant.size}
                    </span>
                    <span className="block text-sm leading-6 text-slate-500">
                      Доступно: {variant.inventory} шт.
                    </span>
                  </span>
                  {selectedVariant.id === variant.id ? (
                    <StatusPill tone="success">выбрано</StatusPill>
                  ) : null}
                </button>
              ))}
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Количество</span>
              <input
                type="number"
                min="1"
                max="6"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                cartStore.addLine({
                  productSlug: product.slug,
                  color: selectedVariant.color,
                  size: selectedVariant.size,
                  quantity,
                });
                setStatus('added');
              }}
              className="inline-flex w-full items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Добавить в корзину
            </button>

            {status === 'added' ? (
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950">
                Добавлено {quantity} шт.: {selectedVariant.color} / {selectedVariant.size}
                .
              </div>
            ) : null}
          </Panel>

          <Panel className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">Условия доставки</p>
            <p className="text-sm leading-6 text-slate-600">
              Заказы, оформленные до 16:00, отправляются в тот же день. Бесплатная
              стандартная доставка начинается от 30 000 ₽, а в городах запуска доступен
              самовывоз.
            </p>
          </Panel>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Рекомендуем вместе с товаром
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Соберите комплект
          </h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {recommendations.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ProductPage() {
  const params = useParams();
  const product = getProductBySlug(params.productSlug ?? '');

  if (!product) {
    return <Navigate to="/catalog" replace />;
  }

  return <ProductDetails key={product.slug} product={product} />;
}
