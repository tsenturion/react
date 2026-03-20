import { useState } from 'react';

import {
  buildCatalogSummary,
  defaultCatalogFilters,
  filterCourses,
  type CatalogFilterState,
} from '../lib/catalog-filter-model';
import type { Course } from '../lib/custom-hooks-domain';

export function useCatalogFilters(courses: readonly Course[]) {
  const [query, setQuery] = useState(defaultCatalogFilters.query);
  const [level, setLevel] = useState<CatalogFilterState['level']>(
    defaultCatalogFilters.level,
  );
  const [featuredOnly, setFeaturedOnly] = useState(defaultCatalogFilters.featuredOnly);

  const filters: CatalogFilterState = {
    query,
    level,
    featuredOnly,
  };

  // Контракт hook-а построен вокруг намерений и derived data, а не вокруг
  // прямого setState наружу для каждой внутренней детали.
  const visibleCourses = filterCourses(courses, filters);
  const summary = buildCatalogSummary(courses.length, visibleCourses.length, filters);

  return {
    query,
    level,
    featuredOnly,
    filters,
    visibleCourses,
    summary,
    setQuery,
    setLevel,
    toggleFeaturedOnly: () => setFeaturedOnly((current) => !current),
    resetFilters: () => {
      setQuery(defaultCatalogFilters.query);
      setLevel(defaultCatalogFilters.level);
      setFeaturedOnly(defaultCatalogFilters.featuredOnly);
    },
  };
}
