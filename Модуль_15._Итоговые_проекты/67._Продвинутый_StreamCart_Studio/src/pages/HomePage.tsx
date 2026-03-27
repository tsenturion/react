import { Link } from 'react-router-dom';

import { ProductCard } from '../components/storefront/ProductCard';
import { MetricCard, Panel, StatusPill } from '../components/ui';
import {
  collections,
  departmentLabels,
  getProductsBySlugs,
  products,
} from '../lib/store-data';

const featuredProducts = products.slice(0, 3);
const heroProduct = products[0];

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br from-orange-100 via-white to-teal-100 p-8 shadow-[0_22px_80px_-36px_rgba(15,23,42,0.55)] sm:p-10">
          <div className="max-w-2xl space-y-5">
            <span className="soft-label">Весенняя коллекция 2026</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              Техническая экипировка для жизни между городом и горами.
            </h1>
            <p className="text-base leading-7 text-slate-700 sm:text-lg">
              StreamCart это полноценная витрина магазина: отобранные коллекции, подробные
              карточки товара, корзина с сохранением состояния и оформление заказа. Под
              капотом проект построен вокруг сценарного рендеринга по маршрутам,
              серверного первого рендера и современных возможностей React.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Смотреть весь каталог
              </Link>
              <Link
                to={`/product/${heroProduct.slug}`}
                className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Перейти к главному товару
              </Link>
            </div>
          </div>
        </div>

        <Panel className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Товар витрины</p>
              <p className="text-sm leading-6 text-slate-600">{heroProduct.title}</p>
            </div>
            <StatusPill tone="success">{heroProduct.badge ?? 'Рекомендация'}</StatusPill>
          </div>

          <div className="rounded-[28px] bg-slate-950 px-5 py-6 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
              {departmentLabels[heroProduct.department]}
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight">
              {heroProduct.subtitle}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {heroProduct.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              label="Рейтинг"
              value={heroProduct.rating.toFixed(1)}
              hint={`${heroProduct.reviewCount} отзывов`}
              tone="accent"
            />
            <MetricCard
              label="Варианты"
              value={`${heroProduct.variants.length}`}
              hint="Доступные размеры и цвета прямо сейчас."
              tone="cool"
            />
          </div>
        </Panel>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Подборки
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Рюкзаки, мембраны и всё для холодных маршрутов
            </h2>
          </div>
          <Link to="/catalog" className="text-sm font-semibold text-orange-700">
            Открыть каталог
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              to={collection.routeHint}
              className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:-translate-y-0.5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {collection.slug.replace('-', ' ')}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                {collection.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {collection.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {getProductsBySlugs(collection.featuredSlugs).map((product) => (
                  <span
                    key={product.slug}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {product.title}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Новинки и акценты
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Главное на витрине
          </h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priorityLabel={index === 0 ? 'Главный показ' : 'Быстрая доставка'}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Порог бесплатной доставки"
          value="30 000 ₽"
          hint="Заказы выше порога получают стандартную доставку без доплаты."
          tone="accent"
        />
        <MetricCard
          label="Пункты самовывоза"
          value="12"
          hint="Сеть самовывоза покрывает ключевые города запуска."
          tone="cool"
        />
        <MetricCard
          label="Средняя оценка"
          value="4.8/5"
          hint="Тщательно отобранный ассортимент и более жёсткий контроль качества."
          tone="dark"
        />
      </section>
    </div>
  );
}
