import type { LabId } from './learning-model';

type StudyFile = {
  path: string;
  note: string;
};

type StudySnippet = {
  label: string;
  note: string;
  code: string;
};

export const projectStudies: Record<
  LabId,
  {
    files: readonly StudyFile[];
    snippets: readonly StudySnippet[];
  }
> = {
  contract: {
    files: [
      {
        path: 'src/hooks/useCatalogFilters.ts',
        note: 'Сам hook: состояние фильтров, derived список и команды управления контрактом.',
      },
      {
        path: 'src/lib/catalog-filter-model.ts',
        note: 'Pure functions для фильтрации и human-readable summary.',
      },
      {
        path: 'src/components/custom-hooks/CatalogContractLab.tsx',
        note: 'Живой экран, который использует контракт hook-а без доступа к его внутренностям.',
      },
    ],
    snippets: [
      {
        label: 'useCatalogFilters.ts',
        note: 'Hook возвращает наружу готовый набор команд и derived data.',
        code: `const visibleCourses = filterCourses(courses, filters);
const summary = buildCatalogSummary(courses.length, visibleCourses.length, filters);

return {
  query,
  level,
  featuredOnly,
  visibleCourses,
  summary,
  setQuery,
  setLevel,
  toggleFeaturedOnly: () => setFeaturedOnly((current) => !current),
  resetFilters: () => {
    setQuery('');
    setLevel('Все');
    setFeaturedOnly(false);
  },
};`,
      },
      {
        label: 'catalog-filter-model.ts',
        note: 'Чистая фильтрация живёт отдельно от React-слоя и легко тестируется.',
        code: `export function filterCourses(courses, filters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesLevel = filters.level === 'Все' || course.level === filters.level;
    const matchesFeatured = !filters.featuredOnly || course.featured;
    const searchableText = \`\${course.title} \${course.summary} \${course.track}\`.toLowerCase();

    return matchesLevel && matchesFeatured && searchableText.includes(normalizedQuery || '');
  });
}`,
      },
    ],
  },
  composition: {
    files: [
      {
        path: 'src/hooks/useLearningWorkspace.ts',
        note: 'Composed hook, который собирает smaller hooks в screen-level модель.',
      },
      {
        path: 'src/hooks/usePersistentPreference.ts',
        note: 'Reusable localStorage-backed preference hook.',
      },
      {
        path: 'src/components/custom-hooks/WorkspaceCompositionLab.tsx',
        note: 'Экран, который работает только с composed contract и не знает внутреннюю склейку.',
      },
    ],
    snippets: [
      {
        label: 'useLearningWorkspace.ts',
        note: 'Composition читает как единый workflow, а не как случайный набор setState.',
        code: `const filters = useCatalogFilters(courses);
const [density, setDensity] = usePersistentPreference('custom-hooks:density', 'comfortable');
const history = useSelectionHistory();

return {
  filters,
  visibleCourses: filters.visibleCourses,
  density,
  setDensity,
  history: history.history,
  selectCourse: (courseId) => {
    setSelectedId(courseId);
    history.rememberSelection(courseId);
  },
};`,
      },
      {
        label: 'usePersistentPreference.ts',
        note: 'Эффект здесь отражает именно синхронизацию с внешней системой, а не бизнес-логику экрана.',
        code: `useEffect(() => {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // UI не должен падать, если storage недоступен.
  }
}, [storageKey, value]);`,
      },
    ],
  },
  reuse: {
    files: [
      {
        path: 'src/hooks/useDisclosure.ts',
        note: 'Минимальный reusable hook для toggle/open/close поведения.',
      },
      {
        path: 'src/components/custom-hooks/ReuseIsolationLab.tsx',
        note: 'Одна и та же логика используется несколькими карточками и остаётся изолированной.',
      },
    ],
    snippets: [
      {
        label: 'useDisclosure.ts',
        note: 'Один маленький hook убирает повторение и задаёт читаемый язык команд.',
        code: `export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((current) => !current),
  };
}`,
      },
      {
        label: 'ReuseIsolationLab.tsx',
        note: 'Каждая карточка вызывает hook отдельно и получает своё состояние.',
        code: `function DisclosureCard({ title, detail }) {
  const disclosure = useDisclosure(false);

  return (
    <article>
      <button onClick={disclosure.toggle}>
        {disclosure.isOpen ? 'Скрыть' : 'Открыть'}
      </button>
      {disclosure.isOpen ? <div>{detail}</div> : null}
    </article>
  );
}`,
      },
    ],
  },
  api: {
    files: [
      {
        path: 'src/hooks/useChecklistBoard.ts',
        note: 'Hook с explicit command API вместо raw setter-ов.',
      },
      {
        path: 'src/lib/checklist-model.ts',
        note: 'Pure operations над checklist-данными и summary builder.',
      },
      {
        path: 'src/components/custom-hooks/ChecklistApiLab.tsx',
        note: 'Экран, который говорит с hook-ом через toggle/assign/reset.',
      },
    ],
    snippets: [
      {
        label: 'useChecklistBoard.ts',
        note: 'Команды делают внешний контракт стабильнее внутренней структуры массива.',
        code: `return {
  items,
  summary,
  toggleItem: (itemId) => {
    setItems((current) => toggleChecklistItem(current, itemId));
  },
  assignOwner: (itemId, owner) => {
    setItems((current) => assignChecklistOwner(current, itemId, owner));
  },
  reset: () => setItems(cloneChecklist(seed)),
};`,
      },
      {
        label: 'checklist-model.ts',
        note: 'Чистые операции остаются обычными функциями и не зависят от React.',
        code: `export function summarizeChecklist(items) {
  const doneCount = items.filter((item) => item.done).length;
  const nextPending = items.find((item) => !item.done)?.title ?? 'Все шаги завершены';

  return {
    doneCount,
    totalCount: items.length,
    progressLabel: \`\${doneCount}/\${items.length}\`,
    nextPending,
  };
}`,
      },
    ],
  },
  boundary: {
    files: [
      {
        path: 'src/lib/hook-boundary-model.ts',
        note: 'Pure decision model для выбора между inline logic, helper и custom hook.',
      },
      {
        path: 'src/components/custom-hooks/HookBoundaryLab.tsx',
        note: 'Интерактивный редактор сценария и его live-оценка.',
      },
      {
        path: 'src/pages/BoundaryPage.tsx',
        note: 'Учебная страница, где явно зафиксировано, что hook нужен не всегда.',
      },
    ],
    snippets: [
      {
        label: 'hook-boundary-model.ts',
        note: 'Сначала оцениваются повторяемость, hidden state и внешняя синхронизация.',
        code: `if (!scenario.internalState && !scenario.sideEffects) {
  return {
    decision: 'prefer-helper',
    label: 'Оставьте pure helper',
    tone: 'warn',
    explanation: 'Если состояния и синхронизации нет, custom hook здесь избыточен.',
  };
}`,
      },
      {
        label: 'HookBoundaryLab.tsx',
        note: 'Лаборатория intentionally не скрывает decision logic в новый hook.',
        code: `const [scenario, setScenario] = useState({ ...boundaryPresets[0] });
const assessment = assessHookBoundary(scenario);

function updateScenario(key, value) {
  setScenario((current) => ({ ...current, [key]: value }));
}`,
      },
    ],
  },
  refactor: {
    files: [
      {
        path: 'src/hooks/useFeedbackDraft.ts',
        note: 'Hook, который собирает поля, ошибки, preview и команды в одну модель.',
      },
      {
        path: 'src/lib/feedback-model.ts',
        note: 'Pure validation и preview builder.',
      },
      {
        path: 'src/components/custom-hooks/RefactorHookLab.tsx',
        note: 'Форма, в которой уже виден эффект очистки шума через hook.',
      },
    ],
    snippets: [
      {
        label: 'useFeedbackDraft.ts',
        note: 'Экран получает уже собранную модель формы, а не разрозненные куски логики.',
        code: `const errors = validateFeedbackDraft(draft);
const preview = buildFeedbackPreview(draft);
const isReady = Object.values(errors).every((value) => value === null);

return {
  draft,
  errors,
  preview,
  isReady,
  updateField: (field, value) =>
    setDraft((current) => ({ ...current, [field]: value })),
  reset: () => setDraft(defaultFeedbackDraft),
};`,
      },
      {
        label: 'feedback-model.ts',
        note: 'Validation и preview остаются pure layer и не зависят от useState.',
        code: `export function validateFeedbackDraft(draft) {
  return {
    name: draft.name.trim().length >= 2 ? null : 'Укажите имя или роль.',
    message:
      draft.message.trim().length >= 20
        ? null
        : 'Опишите проблему чуть подробнее.',
  };
}`,
      },
    ],
  },
};
