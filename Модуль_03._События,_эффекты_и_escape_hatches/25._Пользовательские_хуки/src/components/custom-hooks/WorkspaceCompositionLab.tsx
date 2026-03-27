import clsx from 'clsx';

import { useLearningWorkspace } from '../../hooks/useLearningWorkspace';
import { courseCatalog } from '../../lib/custom-hooks-domain';
import { MetricCard } from '../ui';

const levels = ['Все', 'База', 'Продвинутый'] as const;

export function WorkspaceCompositionLab() {
  const workspace = useLearningWorkspace(courseCatalog);
  const historyTitles = workspace.history.map((id) => {
    const course = courseCatalog.find((item) => item.id === id);
    return course?.title ?? id;
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Smaller hooks внутри composition
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li>`useCatalogFilters` управляет поиском и derived списком.</li>
            <li>`usePersistentPreference` хранит density между перезагрузками.</li>
            <li>`useSelectionHistory` собирает историю последних выборов.</li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Поиск</span>
              <input
                value={workspace.filters.query}
                onChange={(event) => workspace.filters.setQuery(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Уровень</span>
              <select
                value={workspace.filters.level}
                onChange={(event) =>
                  workspace.filters.setLevel(
                    event.target.value as (typeof levels)[number],
                  )
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

            <div>
              <span className="text-sm font-medium text-slate-700">Плотность списка</span>
              <div className="mt-2 flex gap-2">
                {(['compact', 'comfortable'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => workspace.setDensity(item)}
                    className={clsx(
                      'rounded-xl px-3 py-2 text-sm font-medium transition',
                      workspace.density === item
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                    )}
                  >
                    {item === 'compact' ? 'Compact' : 'Comfortable'}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={workspace.filters.featuredOnly}
                onChange={workspace.filters.toggleFeaturedOnly}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Только featured</span>
            </label>

            <button
              type="button"
              onClick={workspace.clearHistory}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Очистить историю выбора
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          <MetricCard
            label="Видимых карточек"
            value={String(workspace.visibleCourses.length)}
            hint="Список приходит из composed hook уже в согласованном виде."
          />
          <MetricCard
            label="Последних выборов"
            value={String(workspace.history.length)}
            hint="История инкапсулирована и не размазывается по экрану."
            tone="cool"
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Каталог</p>
            <div className="mt-4 grid gap-3">
              {workspace.visibleCourses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => workspace.selectCourse(course.id)}
                  className={clsx(
                    'rounded-2xl border text-left transition',
                    workspace.selectedId === course.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                    workspace.density === 'compact' ? 'p-3' : 'p-4',
                  )}
                >
                  <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {course.level} • {course.track} • {course.minutes} мин
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {course.summary}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Выбранный модуль</p>
            {workspace.selectedCourse ? (
              <div className="mt-4 space-y-3">
                <p className="text-xl font-semibold text-slate-900">
                  {workspace.selectedCourse.title}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {workspace.selectedCourse.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="chip">{workspace.selectedCourse.level}</span>
                  <span className="chip">{workspace.selectedCourse.track}</span>
                  <span className="chip">{workspace.selectedCourse.minutes} мин</span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                После фильтрации ничего не осталось, поэтому composed hook отдаёт `null`,
                а экран не пытается держать несогласованный selected item.
              </p>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">История выбора</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {historyTitles.length > 0 ? (
                historyTitles.map((title) => (
                  <li
                    key={title}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    {title}
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-slate-500">
                  История пока пустая.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
