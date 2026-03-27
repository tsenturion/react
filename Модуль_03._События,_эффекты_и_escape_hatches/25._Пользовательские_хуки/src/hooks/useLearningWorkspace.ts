import { useState } from 'react';

import type { Course, Density } from '../lib/custom-hooks-domain';
import { useCatalogFilters } from './useCatalogFilters';
import { usePersistentPreference } from './usePersistentPreference';
import { useSelectionHistory } from './useSelectionHistory';

export function useLearningWorkspace(courses: readonly Course[]) {
  const filters = useCatalogFilters(courses);
  const [density, setDensity] = usePersistentPreference<Density>(
    'custom-hooks:density',
    'comfortable',
  );
  const history = useSelectionHistory();
  const [selectedId, setSelectedId] = useState(courses[0]?.id ?? '');

  // Composed hook собирает smaller hooks в одну screen-level модель:
  // фильтрацию, persistent preference и историю выбора.
  const selectedCourse =
    filters.visibleCourses.find((course) => course.id === selectedId) ??
    filters.visibleCourses[0] ??
    null;

  return {
    filters,
    visibleCourses: filters.visibleCourses,
    density,
    setDensity,
    selectedId: selectedCourse?.id ?? '',
    selectedCourse,
    history: history.history,
    selectCourse: (courseId: string) => {
      setSelectedId(courseId);
      history.rememberSelection(courseId);
    },
    clearHistory: history.clearHistory,
  };
}
