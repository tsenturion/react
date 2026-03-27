import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, StudyEntry> = {
  flux: {
    files: [
      {
        path: 'src/lib/flux-loop-model.ts',
        note: 'Чистая модель разворачивает одно пользовательское действие в полный Flux cycle.',
      },
      {
        path: 'src/components/redux-architecture/FluxCycleLab.tsx',
        note: 'Лаборатория связывает action presets с пошаговой картой потока данных.',
      },
      {
        path: 'src/lib/redux-domain.ts',
        note: 'Здесь лежат action presets и domain-данные, из которых строится цикл.',
      },
    ],
    snippets: [
      {
        label: 'Flux cycle as pure model',
        note: 'Цикл намеренно вынесен в pure function. Благодаря этому Flux разбирается как модель данных, а не как разрозненный JSX с текстами.',
        code: String.raw`return {
  tone: 'success',
  title: preset.label,
  actionType: preset.actionType,
  steps: [
    { phase: 'view', title: 'UI event', detail: preset.uiEvent },
    { phase: 'action', title: 'Action dispatch', detail: ... },
    { phase: 'store', title: 'Central store', detail: ... },
    { phase: 'reducer', title: 'Reducer transition', detail: preset.reducerEffect },
    { phase: 'selector', title: 'Derived state', detail: preset.selectorEffect },
    { phase: 'view-update', title: 'View render', detail: preset.result },
  ],
};`,
      },
      {
        label: 'Interactive preset switch',
        note: 'UI не объясняет Flux абстрактно. Он подставляет реальный action preset и тут же перестраивает все шаги цикла.',
        code: String.raw`const [selectedActionId, setSelectedActionId] = useState(actionPresets[0]!.id);
const report = buildFluxReport(selectedActionId);

{actionPresets.map((preset) => (
  <button key={preset.id} onClick={() => setSelectedActionId(preset.id)}>
    {preset.label}
  </button>
))}`,
      },
    ],
  },
  store: {
    files: [
      {
        path: 'src/store/reviewBoardSlice.ts',
        note: 'Feature slice описывает state shape, actions и reducer transitions одного shared domain.',
      },
      {
        path: 'src/store/selectors.ts',
        note: 'Selectors формируют derived data для отдельных веток интерфейса.',
      },
      {
        path: 'src/components/redux-architecture/ReduxStoreLab.tsx',
        note: 'Лаборатория показывает, как list, toolbar и inspector читают один store и dispatch-ят actions.',
      },
      {
        path: 'src/store/hooks.ts',
        note: 'Typed hooks фиксируют безопасный контракт чтения и dispatch для всего урока.',
      },
    ],
    snippets: [
      {
        label: 'RTK slice reducer',
        note: 'Reducers здесь написаны в стиле Redux Toolkit, но комментарий рядом фиксирует важную мысль: под капотом всё равно остаются immutable transitions.',
        code: String.raw`export const reviewBoardSlice = createSlice({
  name: 'reviewBoard',
  initialState,
  reducers: {
    filterSet(state, action: PayloadAction<ReviewTrack>) {
      state.filter = action.payload;
      markAction(state, 'reviewBoard/filterSet');
    },
    draftApplied(state) {
      if (!state.focusedId) {
        return;
      }

      const item = state.items.find((entry) => entry.id === state.focusedId);
      if (item) {
        item.note = state.draftNote;
      }
      markAction(state, 'reviewBoard/draftApplied');
    },
  },
});`,
      },
      {
        label: 'Selectors as view layer',
        note: 'Selectors вынесены отдельно, чтобы list и summary не вычисляли shared derived data каждый раз прямо внутри JSX.',
        code: String.raw`export const selectVisibleItems = createSelector(
  [selectReviewBoard],
  (board) =>
    board.items.filter((item) => {
      const matchesFilter = board.filter === 'all' || item.track === board.filter;
      const matchesVisibility = board.showResolved || !item.resolved;

      return matchesFilter && matchesVisibility;
    }),
);`,
      },
    ],
  },
  flow: {
    files: [
      {
        path: 'src/store/store.ts',
        note: 'Root store собирает reducer tree и фиксирует app-level точку входа для dispatch.',
      },
      {
        path: 'src/components/redux-architecture/UnidirectionalFlowLab.tsx',
        note: 'Лаборатория dispatch-ит реальные actions и связывает их с текущим состоянием store.',
      },
      {
        path: 'src/store/selectors.ts',
        note: 'Именно selectors возвращают веткам UI уже подготовленное derived state.',
      },
    ],
    snippets: [
      {
        label: 'Root store as data-flow boundary',
        note: 'Комментарий в store.ts важен: root reducer здесь выступает архитектурной границей однонаправленного потока данных на уровне приложения.',
        code: String.raw`export const store = configureStore({
  reducer: {
    lessonView: lessonViewSlice.reducer,
    reviewBoard: reviewBoardSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
      },
      {
        label: 'One intent dispatches one action',
        note: 'Компонент не меняет несколько веток напрямую. Он dispatch-ит один intent, а Redux уже сам доводит следующий state до всех потребителей.',
        code: String.raw`function dispatchSelectedIntent() {
  switch (intentId) {
    case 'resolve-item':
      if (focusedItem) {
        dispatch(itemResolvedToggled(focusedItem.id));
      }
      break;
    case 'change-filter':
      dispatch(filterSet('architecture'));
      break;
    case 'apply-draft':
      dispatch(draftApplied());
      break;
  }
}`,
      },
    ],
  },
  compare: {
    files: [
      {
        path: 'src/lib/redux-strategy-model.ts',
        note: 'Pure-model слой принимает сигналы сценария и рекомендует подходящую архитектуру state.',
      },
      {
        path: 'src/lib/redux-domain.ts',
        note: 'Здесь лежат готовые пресеты сценариев для быстрого сравнения подходов.',
      },
      {
        path: 'src/components/redux-architecture/ContextVsReduxLab.tsx',
        note: 'UI управляет только входными параметрами сценария и визуализирует решение модели.',
      },
    ],
    snippets: [
      {
        label: 'Architecture recommendation rules',
        note: 'Порядок условий важен: сначала оценивается масштаб shared state и тип проблемы, а уже потом выбирается local state, context или Redux.',
        code: String.raw`if (
  scenario.sharedScope === 'branch' &&
  scenario.consumerSpread === 'near' &&
  scenario.transitions === 'simple'
) {
  return {
    primary: 'local state',
    tone: 'success',
    summary: '...',
    reasons,
    risks: ['...'],
  };
}

return {
  primary: 'redux',
  tone: 'success',
  summary: '...',
  reasons,
  risks: ['...'],
};`,
      },
      {
        label: 'Scenario editor drives pure model',
        note: 'Лаборатория отделяет ввод сценария от архитектурного решения. Благодаря этому контраст между Context и Redux считается как обычная функция.',
        code: String.raw`const [scenario, setScenario] = useState<StrategyScenario>({
  ...strategyPresets[1],
});
const recommendation = recommendStateArchitecture(scenario);`,
      },
    ],
  },
  tradeoffs: {
    files: [
      {
        path: 'src/lib/redux-strategy-model.ts',
        note: 'Модель считает overload score и показывает, какие concerns не должны жить в одном Redux store.',
      },
      {
        path: 'src/lib/redux-domain.ts',
        note: 'Список concerns и consumer profiles задаёт реальные роли данных, а не абстрактные флажки.',
      },
      {
        path: 'src/components/redux-architecture/ReduxOverkillLab.tsx',
        note: 'Лаборатория связывает конкретную ветку-потребителя с составом store и делает overkill видимым.',
      },
    ],
    snippets: [
      {
        label: 'Store surface evaluation',
        note: 'Модель повышает риск не только за объём store, но и за смешивание local, URL и server concerns с app-level coordination.',
        code: String.raw`const overloadScore =
  irrelevantConcerns.length + localCount * 2 + urlCount * 2 + serverCount * 3 + contextCount;

if (overloadScore <= 1) {
  return { tone: 'success', ... };
}

if (overloadScore <= 4) {
  return { tone: 'warn', ... };
}

return { tone: 'error', ... };`,
      },
      {
        label: 'Consumer needs vs selected concerns',
        note: 'Здесь хорошо видно, что overkill возникает не из-за самого Redux, а из-за отсутствия границ ответственности у централизованного слоя.',
        code: String.raw`const consumer =
  consumerProfiles.find((profile) => profile.id === consumerId) ?? consumerProfiles[0]!;
const report = evaluateStoreSurface(selectedConcerns, consumer.needs);`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/App.tsx',
        note: 'Shell урока сам работает через Redux store, так что тема выражена в архитектуре всей страницы.',
      },
      {
        path: 'src/store/store.ts',
        note: 'Root store собирает общий reducer tree и делает Redux реальным app-level слоем.',
      },
      {
        path: 'src/store/lessonViewSlice.ts',
        note: 'Даже активная лаборатория и режимы просмотра живут в Redux, а не в локальном состоянии shell-компонента.',
      },
      {
        path: 'src/components/redux-architecture/ArchitectureShiftLab.tsx',
        note: 'Лаборатория показывает ментальный сдвиг от component-centric к store-centric модели.',
      },
    ],
    snippets: [
      {
        label: 'Shell uses Redux too',
        note: 'Это важный момент урока: Redux не спрятан внутри одной demo-зоны, а реально управляет навигацией и режимами просмотра всей учебной страницы.',
        code: String.raw`const lessonView = useAppSelector(selectLessonView);
const dispatch = useAppDispatch();

{lessonLabs.map((item) => (
  <button key={item.id} onClick={() => dispatch(labSelected(item.id))}>
    {item.label}
  </button>
))}

<button onClick={() => dispatch(densitySet('compact'))}>compact</button>`,
      },
      {
        label: 'Typed hooks for predictable access',
        note: 'Typed hooks превращают Redux API в явный контракт слоя приложения: отдельный канал чтения и отдельный канал dispatch.',
        code: String.raw`import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();`,
      },
    ],
  },
};
