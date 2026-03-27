import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, StudyEntry> = {
  compound: {
    files: [
      {
        path: 'src/App.tsx',
        note: 'Shell урока уже использует compound tabs как реальный рабочий API для переключения лабораторий.',
      },
      {
        path: 'src/components/composition-patterns/PatternTabs.tsx',
        note: 'Здесь лежат Root, List, Trigger и Panel с общим context-контрактом.',
      },
      {
        path: 'src/components/composition-patterns/CompoundComponentsLab.tsx',
        note: 'Лаборатория показывает тот же compound primitive в отдельном учебном surface.',
      },
    ],
    snippets: [
      {
        label: 'Compound root and context',
        note: 'Compound pattern держится на одном общем root-контракте. Именно он связывает Trigger и Panel без ручной прокладки state по props.',
        code: String.raw`const TabsContext = createContext<TabsContextValue | null>(null);

function Root({ value, onValueChange, children }: PropsWithChildren<TabsContextValue>) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
}`,
      },
      {
        label: 'Shell uses compound tabs',
        note: 'Паттерн живёт не только в лаборатории: навигация всей страницы построена через тот же compound primitive.',
        code: String.raw`<PatternTabs.Root value={activeLabId} onValueChange={setActiveLabId}>
  <PatternTabs.List>
    {lessonLabs.map((item) => (
      <PatternTabs.Trigger key={item.id} value={item.id}>
        {item.label}
      </PatternTabs.Trigger>
    ))}
  </PatternTabs.List>
</PatternTabs.Root>`,
      },
    ],
  },
  'render-props': {
    files: [
      {
        path: 'src/components/composition-patterns/SelectionLens.tsx',
        note: 'Primitive-компонент хранит state и отдаёт наружу render function с данными и действиями.',
      },
      {
        path: 'src/components/composition-patterns/RenderPropsLab.tsx',
        note: 'Одна и та же логика рендерится разными способами через children-as-function.',
      },
      {
        path: 'src/lib/pattern-domain.ts',
        note: 'Данные для render props сценария лежат отдельно от JSX.',
      },
    ],
    snippets: [
      {
        label: 'Render prop contract',
        note: 'Логика выбора и статистика остаются внутри SelectionLens, а внешний код получает готовый API для собственного render layer.',
        code: String.raw`export function SelectionLens({
  items,
  initialId,
  children,
}: {
  items: readonly Item[];
  initialId: string;
  children: (args: SelectionLensRenderArgs) => ReactNode;
}) {
  const [selectedId, setSelectedId] = useState(initialId);
  const selected = items.find((item) => item.id === selectedId) ?? items[0]!;

  return <>{children({ items, selected, totalExamples, select: setSelectedId })}</>;
}`,
      },
      {
        label: 'Different render modes, same logic',
        note: 'Children function получает один и тот же data API, но caller свободно меняет итоговую визуальную структуру.',
        code: String.raw`<SelectionLens items={renderItems} initialId={renderItems[0]!.id}>
  {({ items, selected, totalExamples, select }) => (
    renderMode === 'cards' ? <CardView selected={selected} /> : <AuditView selected={selected} />
  )}
</SelectionLens>`,
      },
    ],
  },
  hoc: {
    files: [
      {
        path: 'src/components/composition-patterns/withPatternStatus.tsx',
        note: 'Higher-order component добавляет injected props поверх base component-а.',
      },
      {
        path: 'src/components/composition-patterns/HocLab.tsx',
        note: 'Лаборатория рендерит два разных wrapped-компонента на одном HOC.',
      },
      {
        path: 'src/lib/hoc-pattern-model.ts',
        note: 'Pure-model слой оценивает, оправдан ли HOC в текущем сценарии.',
      },
    ],
    snippets: [
      {
        label: 'HOC wrapper',
        note: 'Важная особенность HOC: base component получает полезные props не из JSX использования, а через внешний wrapper-слой.',
        code: String.raw`export function withPatternStatus<P extends InjectedStatusProps>(
  Component: ComponentType<P>,
) {
  type OuterProps = Omit<P, keyof InjectedStatusProps> & HocSignals;

  function WrappedComponent(props: OuterProps) {
    const diagnostics = describeHocScenario(...);

    return <Component {...(rest as Omit<P, keyof InjectedStatusProps>)} {...diagnostics} />;
  }
}`,
      },
      {
        label: 'One HOC, multiple base components',
        note: 'HOC действительно даёт cross-cutting reuse: один wrapper обслуживает несколько base-компонентов с одинаковым injected contract.',
        code: String.raw`const ScenarioCard = withPatternStatus(ScenarioCardBase);
const ScenarioLine = withPatternStatus(ScenarioLineBase);`,
      },
    ],
  },
  children: {
    files: [
      {
        path: 'src/components/composition-patterns/ActionRail.tsx',
        note: 'Здесь находятся Children.map, isValidElement и cloneElement с прямым child-контрактом.',
      },
      {
        path: 'src/components/composition-patterns/ChildrenCloneLab.tsx',
        note: 'Лаборатория показывает, что происходит, когда в дерево попадает wrapper.',
      },
      {
        path: 'src/lib/children-api-model.ts',
        note: 'Pure-model слой описывает устойчивость или хрупкость child-контракта.',
      },
    ],
    snippets: [
      {
        label: 'cloneElement over direct children',
        note: 'Паттерн работает только потому, что root знает форму direct child и может безопасно добавить injected props.',
        code: String.raw`return Children.map(children, (child) => {
  if (!isValidElement(child) || child.type !== ActionRailButton) {
    return child;
  }

  return cloneElement(child, {
    active: child.props.value === value,
    size,
    onSelect: onValueChange,
  });
});`,
      },
      {
        label: 'Wrapped child breaks the contract',
        note: 'Если нужный child оказывается внутри wrapper-а, root уже не может добраться до него как до прямого участника API.',
        code: String.raw`<ActionRail value={activeValue} onValueChange={setActiveValue} size={density}>
  <ActionRail.Button value="overview">Overview</ActionRail.Button>
  <div>
    <ActionRail.Button value="api">API</ActionRail.Button>
  </div>
</ActionRail>`,
      },
    ],
  },
  alternatives: {
    files: [
      {
        path: 'src/lib/pattern-recommendation-model.ts',
        note: 'Модель выбирает паттерн по требованиям сценария, а не по привычке.',
      },
      {
        path: 'src/lib/pattern-domain.ts',
        note: 'Пресеты сценариев задают типичные продуктовые требования для сравнения подходов.',
      },
      {
        path: 'src/components/composition-patterns/AlternativesLab.tsx',
        note: 'UI редактирует входные требования и визуализирует решение pure model.',
      },
    ],
    snippets: [
      {
        label: 'Requirements → pattern',
        note: 'Главная мысль урока: паттерн выбирается по типу задачи, а не просто потому, что он красивый или знакомый.',
        code: String.raw`if (requirements.logicReuseOnly) {
  return { primary: 'custom hook + explicit slots', ... };
}

if (requirements.needInjectIntoChildren) {
  return { primary: 'cloneElement + Children API', ... };
}

if (requirements.sharedSubparts) {
  return { primary: 'compound components', ... };
}`,
      },
      {
        label: 'Preset-driven comparison',
        note: 'Лаборатория позволяет быстро переключать типовые сценарии и смотреть, как вместе с ними меняется рекомендуемая архитектура API-компонента.',
        code: String.raw`const [requirements, setRequirements] = useState<PatternRequirements>({
  ...requirementPresets[0],
});
const recommendation = recommendCompositionPattern(requirements);`,
      },
    ],
  },
  tradeoffs: {
    files: [
      {
        path: 'src/lib/pattern-cost-model.ts',
        note: 'Модель считает risk score по wrapper layers, hidden contracts и fragility сценария.',
      },
      {
        path: 'src/components/composition-patterns/TradeoffsLab.tsx',
        note: 'Лаборатория делает стоимость паттерна видимой до внедрения в продуктовый код.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Тесты проверяют выбор паттерна и оценку риска как обычную предметную логику.',
      },
    ],
    snippets: [
      {
        label: 'Cost scoring',
        note: 'Здесь видно, что проблема не в названии паттерна самом по себе, а в условиях его использования.',
        code: String.raw`if (scenario.pattern === 'higher-order components') {
  score += 2;
  if (scenario.wrapperLayers >= 2) {
    score += 3;
    issues.push('Wrapper nesting усложняет поиск источника props и stack trace.');
  }
}`,
      },
      {
        label: 'Boundary-focused guidance',
        note: 'Модель не просто ругает паттерн, а подсказывает, куда двигаться: hooks, slots, config arrays или более узкий compound API.',
        code: String.raw`if (score <= 3) {
  return { tone: 'success', headline: 'Стоимость паттерна под контролем', ... };
}

if (score <= 7) {
  return { tone: 'warn', headline: 'Паттерн уже требует дисциплины', ... };
}

return { tone: 'error', headline: 'Паттерн начинает вредить архитектуре', ... };`,
      },
    ],
  },
};
