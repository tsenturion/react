'use client';

import { startTransition, useDeferredValue, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ProductCard } from '../components/storefront/ProductCard';
import { MetricCard, Panel, StatusPill } from '../components/ui';
import { type Department, formatCurrency, products } from '../lib/store-data';

type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'rating';

function productScore(title: string, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return 100;
  }

  const candidate = title.toLowerCase();
  return (
    (candidate.startsWith(normalized) ? 100 : 0) +
    (candidate.includes(normalized) ? 35 : 0)
  );
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('featured');
  const selectedDepartment =
    (searchParams.get('department') as Department | null) ?? 'all';
  const deferredQuery = useDeferredValue(query);

  const visibleProducts = products
    .map((product) => ({
      product,
      score: productScore(product.title, deferredQuery),
    }))
    .filter(
      (item) =>
        item.score > 35 &&
        (selectedDepartment === 'all' || item.product.department === selectedDepartment),
    )
    .sort((left, right) => {
      if (sortMode === 'price-asc') {
        return left.product.price - right.product.price;
      }

      if (sortMode === 'price-desc') {
        return right.product.price - left.product.price;
      }

      if (sortMode === 'rating') {
        return right.product.rating - left.product.rating;
      }

      return right.score - left.score;
    });

  const averagePrice =
    visibleProducts.length > 0
      ? visibleProducts.reduce((sum, item) => sum + item.product.price, 0) /
        visibleProducts.length
      : 0;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Фильтры
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Каталог
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Изучайте ассортимент по категориям, пользуйтесь живым поиском и сортировкой.
              Каталог построен как реальный продуктовый экран, а не как демонстрация
              урока.
            </p>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Поиск</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Искать куртки, ботинки, рюкзаки..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />
          </label>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Категория</span>
            <div className="flex flex-wrap gap-2">
              {(['all', 'outerwear', 'footwear', 'equipment'] as const).map(
                (department) => (
                  <button
                    key={department}
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        const next = new URLSearchParams(searchParams);

                        if (department === 'all') {
                          next.delete('department');
                        } else {
                          next.set('department', department);
                        }

                        setSearchParams(next);
                      });
                    }}
                    className={`chip ${selectedDepartment === department ? 'chip-active' : ''}`}
                  >
                    {department === 'all'
                      ? 'Все'
                      : department === 'outerwear'
                        ? 'Одежда'
                        : department === 'footwear'
                          ? 'Обувь'
                          : 'Снаряжение'}
                  </button>
                ),
              )}
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Сортировка</span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="featured">По релевантности</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </label>
        </Panel>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Товаров на экране"
              value={`${visibleProducts.length}`}
              hint="Ассортимент после поиска и выбранной категории."
              tone="cool"
            />
            <MetricCard
              label="Средняя цена"
              value={formatCurrency(averagePrice)}
              hint="Быстрый срез цены для текущего набора товаров."
              tone="accent"
            />
            <div className="panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Режим поиска
              </p>
              <div className="mt-3">
                <StatusPill tone={deferredQuery ? 'success' : 'warn'}>
                  {deferredQuery ? `Ищем: "${deferredQuery}"` : 'Показаны все товары'}
                </StatusPill>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Каталог сохраняет отзывчивость через deferred filtering, а не отправляет
                каждое нажатие клавиши в самый тяжёлый путь обновления.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {visibleProducts.map(({ product }) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
