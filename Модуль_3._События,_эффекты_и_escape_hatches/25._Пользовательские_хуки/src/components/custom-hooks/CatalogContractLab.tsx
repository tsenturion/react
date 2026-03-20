import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { courseCatalog } from '../../lib/custom-hooks-domain';
import { MetricCard, StatusPill } from '../ui';

const levels = ['Все', 'База', 'Продвинутый'] as const;

export function CatalogContractLab() {
  const {
    query,
    level,
    featuredOnly,
    visibleCourses,
    summary,
    setQuery,
    setLevel,
    toggleFeaturedOnly,
    resetFilters,
  } = useCatalogFilters(courseCatalog);

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Входы hook-а
          </p>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Поисковый запрос</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Например, architecture"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Уровень</span>
              <select
                value={level}
                onChange={(event) =>
                  setLevel(event.target.value as (typeof levels)[number])
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              >
                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={toggleFeaturedOnly}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Только featured модули</span>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Сбросить контракт к исходному виду
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          <MetricCard
            label="Видимых модулей"
            value={String(visibleCourses.length)}
            hint="Derived data приходит из hook-а уже готовым к рендеру."
          />
          <MetricCard
            label="Команд наружу"
            value="4"
            hint="setQuery, setLevel, toggleFeaturedOnly, resetFilters."
            tone="accent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{summary.headline}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{summary.detail}</p>
            </div>
            <StatusPill tone={summary.tone}>{summary.tone}</StatusPill>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что hook отдаёт наружу
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>`query`, `level`, `featuredOnly`</li>
                <li>`visibleCourses` как готовый список для UI</li>
                <li>`summary` как status + human readable объяснение</li>
                <li>Команды управления вместо доступа к внутренностям</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что не протекает наружу
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>Нет прямого `setState` для каждой внутренней детали.</li>
                <li>Нет дублирования фильтрации прямо в компоненте.</li>
                <li>Нет отдельного хранения derived списка рядом с исходными данными.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <article
              key={course.id}
              className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {course.level} • {course.track}
                  </p>
                </div>
                {course.featured ? (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                    featured
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{course.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
