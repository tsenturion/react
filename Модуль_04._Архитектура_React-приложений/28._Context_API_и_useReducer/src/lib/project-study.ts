import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, StudyEntry> = {
  context: {
    files: [
      {
        path: 'src/components/context-reducer/ContextDeliveryLab.tsx',
        note: 'Здесь рядом показаны обе ветки: prop drilling и context delivery.',
      },
      {
        path: 'src/lib/delivery-model.ts',
        note: 'Pure-model слой объясняет, сколько промежуточных уровней знает о чужих данных и какие риски несут обе схемы.',
      },
      {
        path: 'src/pages/ContextDeliveryPage.tsx',
        note: 'Страница связывает live lab, метрики и архитектурный вывод.',
      },
    ],
    snippets: [
      {
        label: 'Local provider for delivery only',
        note: 'Context здесь отвечает только за delivery. Это важно: lab специально не превращает этот provider в общий контейнер для всех задач страницы.',
        code: String.raw`const TrackDeliveryContext = createContext<DeliveryContextValue | null>(null);

function TrackDeliveryProvider({ children }: { children: ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<DeliveryTrack>('state');

  return (
    <TrackDeliveryContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </TrackDeliveryContext.Provider>
  );
}`,
      },
      {
        label: 'Props chain vs context leaf',
        note: 'В props-ветке intermediate nodes получают лишний API. В context-ветке leaf-компонент читает значение напрямую, а layout остаётся чистым.',
        code: String.raw`<PropsLeaf
  selectedTrack={selectedTrack}
  onSelectTrack={setSelectedTrack}
/>

function ContextLeaf() {
  const { selectedTrack, setSelectedTrack } = useTrackDelivery();
  // ...
}`,
      },
    ],
  },
  reducer: {
    files: [
      {
        path: 'src/lib/workspace-reducer-model.ts',
        note: 'Reducer, state shape и selectors лежат отдельно от UI, поэтому transitions можно тестировать как обычный JS.',
      },
      {
        path: 'src/components/context-reducer/ReducerWorkflowLab.tsx',
        note: 'Лаборатория dispatch-ит реальные actions и показывает action log рядом с UI.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Тесты проверяют reducer transitions и архитектурные правила без участия браузерного UI.',
      },
    ],
    snippets: [
      {
        label: 'Reducer transition switch',
        note: 'useReducer оправдан здесь тем, что focus, filters, draft и items меняются как связанная модель, а не как набор независимых флагов.',
        code: String.raw`switch (action.type) {
  case 'focus/set':
    return withActionCount(state, {
      ...state,
      focusedId: action.id,
      draftNote: focusedItem?.note ?? '',
    });
  case 'draft/apply':
    return withActionCount(state, {
      ...state,
      items: state.items.map((item) =>
        item.id === state.focusedId ? { ...item, note: state.draftNote } : item,
      ),
    });
}`,
      },
      {
        label: 'Dispatch trace in component',
        note: 'Компонент не хранит business logic у себя. Он dispatch-ит action и отдельно ведёт trace, чтобы показывать путь изменений.',
        code: String.raw`function dispatch(action: WorkspaceAction) {
  rawDispatch(action);
  setHistory((current) => [formatAction(action), ...current].slice(0, 6));
}`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/state/WorkspaceProvider.tsx',
        note: 'Отдельный provider задаёт scoped architecture именно для workspace-секции.',
      },
      {
        path: 'src/state/useWorkspaceState.ts',
        note: 'Хук чтения state отделён от dispatch-хука, чтобы контракт был ясным.',
      },
      {
        path: 'src/state/useWorkspaceDispatch.ts',
        note: 'Dispatch layer доставляется в глубокие ветки без prop drilling.',
      },
      {
        path: 'src/components/context-reducer/WorkspaceArchitectureLab.tsx',
        note: 'Здесь Context + Reducer уже работают как реальная архитектура одной секции интерфейса.',
      },
    ],
    snippets: [
      {
        label: 'Split state and dispatch contexts',
        note: 'Provider разделяет delivery state и delivery dispatch на два отдельных контракта. Это делает API провайдера чище и ближе к реальной архитектурной роли.',
        code: String.raw`return (
  <WorkspaceDispatchContext.Provider value={dispatch}>
    <WorkspaceStateContext.Provider value={state}>
      {children}
    </WorkspaceStateContext.Provider>
  </WorkspaceDispatchContext.Provider>
);`,
      },
      {
        label: 'Deep branch dispatches directly',
        note: 'Inspector живёт глубоко в дереве, но всё равно может dispatch-ить actions напрямую через context, без цепочки onApply/onCyclePriority пропсов.',
        code: String.raw`function WorkspaceInspector() {
  const state = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();

  return (
    <>
      <textarea
        value={state.draftNote}
        onChange={(event) => dispatch({ type: 'draft/set', value: event.target.value })}
      />
      <DeepPriorityButton />
    </>
  );
}`,
      },
    ],
  },
  boundaries: {
    files: [
      {
        path: 'src/components/context-reducer/ProviderBoundaryLab.tsx',
        note: 'В одном файле видны и соседние providers, и вложенный provider, который создаёт отдельный state island.',
      },
      {
        path: 'src/state/workspace-context.ts',
        note: 'Один и тот же тип контекста может иметь несколько разных живых экземпляров через разные providers.',
      },
      {
        path: 'src/state/WorkspaceProvider.tsx',
        note: 'Каждый provider поднимает свой собственный reducer instance и тем самым формирует новую область состояния.',
      },
    ],
    snippets: [
      {
        label: 'Two sibling providers',
        note: 'Соседние секции не делят одно и то же состояние только потому, что используют одинаковый context type. У каждой свой provider и свой reducer instance.',
        code: String.raw`<WorkspaceProvider initialState={leftRef.current}>
  <BoundaryScope title="Внешний provider секции" initialScope={leftRef.current} />
</WorkspaceProvider>

<WorkspaceProvider initialState={rightRef.current}>
  <BoundaryScope title="Соседний provider другой секции" initialScope={rightRef.current} />
</WorkspaceProvider>`,
      },
      {
        label: 'Nested provider shadows outer scope',
        note: 'Внутренний provider перекрывает внешний для своего поддерева. Именно поэтому nearest provider wins — не абстракция, а реальное правило чтения context.',
        code: String.raw`function NestedSandbox() {
  const nestedRef = useRef(
    createWorkspaceState('Nested training sandbox', nestedSandboxSeed),
  );

  return (
    <WorkspaceProvider initialState={nestedRef.current}>
      <ScopeBody title="Внутренний provider" />
    </WorkspaceProvider>
  );
}`,
      },
    ],
  },
  strategy: {
    files: [
      {
        path: 'src/lib/architecture-strategy-model.ts',
        note: 'Pure-model слой принимает сигналы сценария и рекомендует подходящую архитектуру.',
      },
      {
        path: 'src/lib/context-domain.ts',
        note: 'Пресеты сценариев помогают быстро проверить типичные архитектурные кейсы.',
      },
      {
        path: 'src/components/context-reducer/StrategyCompareLab.tsx',
        note: 'UI только редактирует входной сценарий и визуализирует решение pure function.',
      },
    ],
    snippets: [
      {
        label: 'Architecture recommendation rules',
        note: 'Порядок условий здесь важен: сначала определяется scope и сложность, затем уже решается, нужен ли context, reducer или их комбинация.',
        code: String.raw`if (scenario.sharedScope === 'branch' && !scenario.distantConsumers) {
  return { primary: 'local state + props', ... };
}

if (scenario.logicComplexity === 'complex' && !scenario.distantConsumers) {
  return { primary: 'useReducer', ... };
}

return {
  primary: 'context + reducer',
  ...
};`,
      },
      {
        label: 'Scenario editor drives pure model',
        note: 'Лаборатория не вшивает архитектурные советы в JSX. Она меняет входные параметры и отдельно вычисляет рекомендацию.',
        code: String.raw`const [scenario, setScenario] = useState<StrategyScenario>({
  ...strategyPresets[1],
});
const recommendation = recommendArchitecture(scenario);`,
      },
    ],
  },
  container: {
    files: [
      {
        path: 'src/lib/architecture-strategy-model.ts',
        note: 'Модель global container считает overload score и показывает, какие concerns не должны жить в одном provider.',
      },
      {
        path: 'src/lib/context-domain.ts',
        note: 'Список container features и consumer profiles задаёт реальные архитектурные роли данных.',
      },
      {
        path: 'src/components/context-reducer/GlobalContainerLab.tsx',
        note: 'Лаборатория связывает одну ветку-потребителя с большим AppContext и показывает избыточную surface area.',
      },
    ],
    snippets: [
      {
        label: 'Global container evaluation',
        note: 'Модель не просто считает количество полей. Она отдельно повышает риск за локальные и серверные concerns внутри общего контекста.',
        code: String.raw`const overloadScore =
  irrelevantFeatures.length + localCount * 2 + serverCount * 3 + scopedCount;

if (overloadScore <= 1) {
  return { tone: 'success', ... };
}

if (overloadScore <= 4) {
  return { tone: 'warn', ... };
}

return { tone: 'error', ... };`,
      },
      {
        label: 'Selected features vs consumer needs',
        note: 'Ветка выбирается отдельно от набора полей контейнера. Так становится видно, сколько лишнего API получает конкретный потребитель.',
        code: String.raw`const consumer =
  consumerProfiles.find((profile) => profile.id === consumerId) ?? consumerProfiles[0]!;
const report = evaluateGlobalContainer(selectedFeatures, consumer.needs);`,
      },
    ],
  },
};
