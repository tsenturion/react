import type { StatusTone } from './learning-model';
import type { Course, CourseLevel } from './custom-hooks-domain';

export type CatalogFilterState = {
  query: string;
  level: CourseLevel | 'Все';
  featuredOnly: boolean;
};

export const defaultCatalogFilters: CatalogFilterState = {
  query: '',
  level: 'Все',
  featuredOnly: false,
};

export function filterCourses(
  courses: readonly Course[],
  filters: CatalogFilterState,
): Course[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesLevel = filters.level === 'Все' || course.level === filters.level;
    const matchesFeatured = !filters.featuredOnly || course.featured;
    const searchableText =
      `${course.title} ${course.summary} ${course.track}`.toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesLevel && matchesFeatured && matchesQuery;
  });
}

export function buildCatalogSummary(
  totalCourses: number,
  visibleCourses: number,
  filters: CatalogFilterState,
): {
  headline: string;
  detail: string;
  tone: StatusTone;
} {
  const hasFilters =
    filters.query.trim().length > 0 || filters.level !== 'Все' || filters.featuredOnly;

  if (visibleCourses === 0) {
    return {
      headline: 'Ничего не найдено',
      detail:
        'Текущий контракт не ломается: hook возвращает пустой список и понятный статус.',
      tone: 'error',
    };
  }

  if (!hasFilters) {
    return {
      headline: `Показаны все ${totalCourses} модулей`,
      detail: 'Hook отдаёт полный каталог и нейтральный набор команд.',
      tone: 'success',
    };
  }

  return {
    headline: `${visibleCourses} из ${totalCourses} модулей`,
    detail:
      'Параметры фильтрации сузили выдачу, но состояние и derived data остались синхронны.',
    tone: 'warn',
  };
}
